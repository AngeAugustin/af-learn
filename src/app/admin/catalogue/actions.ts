"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { query, queryOne, transaction } from "@/lib/db";
import { audit } from "@/lib/admin/audit";
import { linesToList, MAX_OPTIONS, sourceParcours } from "@/lib/admin/catalog";
import { unsafeMarkdown } from "@/lib/admin/markdown-guard";
import { ICONS, TONES } from "@/components/ui/parcours-icon";

/**
 * Actions du catalogue. Chaque modification écrit la nouvelle valeur ET la note dans `overrides`,
 * pour qu'un rechargement du contenu (`npm run db:seed`) ne l'écrase pas.
 * Chaque action revérifie le rôle administrateur et laisse une trace dans le journal.
 */

const STATUSES = ["published", "coming_soon", "hidden"] as const;
type Table = "parcours" | "modules" | "chapters" | "sections" | "questions";

/** Met à jour les colonnes modifiées et les ajoute aux surcharges. Les colonnes jsonb reçoivent du JSON. */
async function writeOverrides(table: Table, id: number, changes: Record<string, unknown>, jsonCols: string[] = []) {
  const cols = Object.keys(changes);
  if (!cols.length) return;
  const sets = cols.map((c, i) => `${c} = $${i + 2}${jsonCols.includes(c) ? "::jsonb" : ""}`);
  const values = cols.map((c) => (jsonCols.includes(c) ? JSON.stringify(changes[c]) : changes[c]));
  await query(
    `UPDATE ${table} SET ${sets.join(", ")}, overrides = overrides || $${cols.length + 2}::jsonb${table === "parcours" ? ", updated_at = now()" : ""}
     WHERE id = $1`,
    [id, ...values, JSON.stringify(changes)],
  );
}

/** Ne garde que les champs dont la valeur change vraiment. */
function diff(before: Record<string, unknown>, after: Record<string, unknown>) {
  const changes: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(after)) if (JSON.stringify(before[k]) !== JSON.stringify(v)) changes[k] = v;
  return changes;
}

const toId = (v: FormDataEntryValue | null) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

function refresh(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/admin/catalogue");
  if (slug) revalidatePath(`/admin/catalogue/${slug}`);
}

/** Redirige avec un code de retour, placé avant l'ancre éventuelle (#section-12). */
function go(target: string, notice: string): never {
  const [path, hash] = target.split("#");
  redirect(`${path}${path.includes("?") ? "&" : "?"}notice=${notice}${hash ? `#${hash}` : ""}`);
}

/* ---------- Parcours ---------- */

type CourseRow = {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  level: string;
  color: string;
  icon: string;
  status: string;
  position: number;
  prerequisites: string[];
  outcomes: string[];
};

async function loadCourse(slug: string) {
  return queryOne<CourseRow>("SELECT * FROM parcours WHERE slug = $1", [slug]);
}

export async function setCourseStatusAction(form: FormData): Promise<void> {
  const admin = await requireAdmin("/admin/catalogue");
  const slug = String(form.get("slug") ?? "");
  const status = String(form.get("status") ?? "");
  const back = String(form.get("back") ?? "") === "fiche" ? `/admin/catalogue/${slug}` : "/admin/catalogue";
  const course = await loadCourse(slug);
  if (!course) go("/admin/catalogue", "introuvable");
  if (!(STATUSES as readonly string[]).includes(status)) go(back, "statut-invalide");
  if (status === "published") {
    const n = await queryOne<{ n: number }>(
      "SELECT count(*)::int AS n FROM chapters c JOIN modules m ON m.id = c.module_id WHERE m.parcours_id = $1",
      [course.id],
    );
    if (!n?.n) go(back, "parcours-vide");
  }
  if (status === course.status) go(back, "inchange");
  await writeOverrides("parcours", course.id, { status });
  await audit(admin, "course.status", { id: null, label: course.title }, { avant: course.status, apres: status });
  refresh(slug);
  go(back, `statut-${status}`);
}

/** Monte ou descend un parcours dans le catalogue, puis renumérote tout l'ordre (noté dans les surcharges). */
export async function moveCourseAction(form: FormData): Promise<void> {
  const admin = await requireAdmin("/admin/catalogue");
  const slug = String(form.get("slug") ?? "");
  const dir = form.get("dir") === "up" ? -1 : 1;
  const rows = await query<{ id: number; slug: string; title: string }>("SELECT id, slug, title FROM parcours ORDER BY position, id");
  const i = rows.findIndex((r) => r.slug === slug);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) go("/admin/catalogue", "inchange");
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await transaction(async (db) => {
    for (const [index, r] of rows.entries()) {
      await db.query(
        "UPDATE parcours SET position = $2, overrides = overrides || jsonb_build_object('position', $2::int), updated_at = now() WHERE id = $1",
        [r.id, index + 1],
      );
    }
  });
  await audit(admin, "course.reorder", { id: null, label: rows[j].title }, { ordre: rows.map((r) => r.title) });
  refresh();
  go("/admin/catalogue", "ordre-ok");
}

const courseSchema = z.object({
  title: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(300),
  description: z.string().trim().min(2).max(3000),
  level: z.string().trim().min(2).max(80),
  color: z.enum(TONES),
  icon: z.enum(Object.keys(ICONS) as [string, ...string[]]),
});

export async function updateCourseAction(form: FormData): Promise<void> {
  const admin = await requireAdmin("/admin/catalogue");
  const slug = String(form.get("slug") ?? "");
  const course = await loadCourse(slug);
  if (!course) go("/admin/catalogue", "introuvable");
  const back = `/admin/catalogue/${slug}`;
  const parsed = courseSchema.safeParse({
    title: form.get("title"),
    tagline: form.get("tagline"),
    description: form.get("description"),
    level: form.get("level"),
    color: form.get("color"),
    icon: form.get("icon"),
  });
  if (!parsed.success) go(back, "fiche-invalide");
  const next = { ...parsed.data, prerequisites: linesToList(form.get("prerequisites")), outcomes: linesToList(form.get("outcomes")) };
  const changes = diff(course, next);
  if (!Object.keys(changes).length) go(back, "inchange");
  await writeOverrides("parcours", course.id, changes, ["prerequisites", "outcomes"]);
  await audit(admin, "course.update", { id: null, label: next.title }, { champs: Object.keys(changes) });
  refresh(slug);
  go(back, "fiche-ok");
}

/* ---------- Modules, chapitres, sections ---------- */

/** Parcours auquel appartient un élément, pour revenir à la bonne page et vérifier l'appartenance. */
async function owner(table: "modules" | "chapters" | "sections", id: number) {
  const sql = {
    modules: "SELECT p.slug, m.title FROM modules m JOIN parcours p ON p.id = m.parcours_id WHERE m.id = $1",
    chapters:
      "SELECT p.slug, c.title FROM chapters c JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id WHERE c.id = $1",
    sections: `SELECT p.slug, s.title, s.chapter_id FROM sections s JOIN chapters c ON c.id = s.chapter_id
               JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id WHERE s.id = $1`,
  }[table];
  return queryOne<{ slug: string; title: string; chapter_id?: number }>(sql, [id]);
}

export async function updateModuleAction(form: FormData): Promise<void> {
  const admin = await requireAdmin("/admin/catalogue");
  const id = toId(form.get("id"));
  const where = id ? await owner("modules", id) : null;
  if (!id || !where) go("/admin/catalogue", "introuvable");
  const back = `/admin/catalogue/${where.slug}`;
  const parsed = z
    .object({ title: z.string().trim().min(2).max(160), description: z.string().trim().min(2).max(1000) })
    .safeParse({ title: form.get("title"), description: form.get("description") });
  if (!parsed.success) go(back, "module-invalide");
  const before = await queryOne<Record<string, unknown>>("SELECT title, description FROM modules WHERE id = $1", [id]);
  const changes = diff(before ?? {}, parsed.data);
  if (!Object.keys(changes).length) go(back, "inchange");
  await writeOverrides("modules", id, changes);
  await audit(admin, "module.update", { id: null, label: parsed.data.title }, { parcours: where.slug, champs: Object.keys(changes) });
  refresh(where.slug);
  go(`${back}#module-${id}`, "module-ok");
}

export async function updateChapterAction(form: FormData): Promise<void> {
  const admin = await requireAdmin("/admin/catalogue");
  const id = toId(form.get("id"));
  const where = id ? await owner("chapters", id) : null;
  if (!id || !where) go("/admin/catalogue", "introuvable");
  const back = `/admin/catalogue/${where.slug}`;
  const parsed = z
    .object({
      title: z.string().trim().min(2).max(160),
      description: z.string().trim().min(2).max(1000),
      duration_minutes: z.coerce.number().int().min(1).max(1000),
    })
    .safeParse({ title: form.get("title"), description: form.get("description"), duration_minutes: form.get("duration") });
  if (!parsed.success) go(back, "chapitre-invalide");
  const next = { ...parsed.data, objectives: linesToList(form.get("objectives")) };
  const before = await queryOne<Record<string, unknown>>("SELECT title, description, duration_minutes, objectives FROM chapters WHERE id = $1", [id]);
  const changes = diff(before ?? {}, next);
  if (!Object.keys(changes).length) go(back, "inchange");
  await writeOverrides("chapters", id, changes, ["objectives"]);
  await audit(admin, "chapter.update", { id: null, label: next.title }, { parcours: where.slug, champs: Object.keys(changes) });
  refresh(where.slug);
  go(`${back}#chapitre-${id}`, "chapitre-ok");
}

export async function updateSectionAction(form: FormData): Promise<void> {
  const admin = await requireAdmin("/admin/catalogue");
  const id = toId(form.get("id"));
  const where = id ? await owner("sections", id) : null;
  if (!id || !where) go("/admin/catalogue", "introuvable");
  const back = `/admin/catalogue/${where.slug}/chapitres/${where.chapter_id}`;
  const parsed = z
    .object({ title: z.string().trim().min(1).max(200), body_md: z.string().min(1).max(200_000) })
    .safeParse({ title: form.get("title"), body_md: String(form.get("body") ?? "").replace(/\r\n/g, "\n") });
  if (!parsed.success) go(`${back}#section-${id}`, "section-invalide");
  if (unsafeMarkdown(parsed.data.body_md)) go(`${back}#section-${id}`, "section-dangereuse");
  const before = await queryOne<Record<string, unknown>>("SELECT title, body_md FROM sections WHERE id = $1", [id]);
  const changes = diff(before ?? {}, parsed.data);
  if (!Object.keys(changes).length) go(`${back}#section-${id}`, "inchange");
  await writeOverrides("sections", id, changes);
  await audit(admin, "section.update", { id: null, label: parsed.data.title }, { parcours: where.slug, champs: Object.keys(changes) });
  refresh(where.slug);
  go(`${back}#section-${id}`, "section-ok");
}

/* ---------- Questions d'évaluation ---------- */

/**
 * Enregistre une question. Les réponses arrivent en champs option_0..option_7 avec des cases
 * « correct » portant leur numéro ; les lignes vides sont ignorées et les numéros recalculés.
 */
export async function updateQuestionAction(form: FormData): Promise<void> {
  const admin = await requireAdmin("/admin/catalogue");
  const id = toId(form.get("id"));
  const row = id
    ? await queryOne<{ slug: string; chapter_id: number; prompt: string; code: string | null; options: string[]; correct: number[]; multiple: boolean; explanation: string }>(
        `SELECT p.slug, q.chapter_id, q.prompt, q.code, q.options, q.correct, q.multiple, q.explanation
         FROM questions q JOIN chapters c ON c.id = q.chapter_id JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id
         WHERE q.id = $1`,
        [id],
      )
    : null;
  if (!id || !row) go("/admin/catalogue", "introuvable");
  const back = `/admin/catalogue/${row.slug}/chapitres/${row.chapter_id}/questions#question-${id}`;

  const checked = new Set(form.getAll("correct").map(String));
  const entries = Array.from({ length: MAX_OPTIONS }, (_, i) => ({
    text: String(form.get(`option_${i}`) ?? "").trim().slice(0, 500),
    correct: checked.has(String(i)),
  })).filter((e) => e.text);
  const options = entries.map((e) => e.text);
  const correct = entries.flatMap((e, i) => (e.correct ? [i] : []));
  const multiple = form.get("multiple") === "on";

  const parsed = z
    .object({ prompt: z.string().trim().min(3).max(2000), explanation: z.string().trim().min(1).max(3000), code: z.string().max(5000) })
    .safeParse({ prompt: form.get("prompt"), explanation: form.get("explanation"), code: String(form.get("code") ?? "").replace(/\r\n/g, "\n") });
  if (!parsed.success) go(back, "question-invalide");
  if (options.length < 2) go(back, "question-options");
  if (new Set(options).size !== options.length) go(back, "question-doublon");
  if (correct.length === 0) go(back, "question-sans-reponse");
  if (!multiple && correct.length !== 1) go(back, "question-une-reponse");

  const next = {
    prompt: parsed.data.prompt,
    code: parsed.data.code.trim() ? parsed.data.code.replace(/\s+$/, "") : null,
    options,
    correct,
    multiple,
    explanation: parsed.data.explanation,
  };
  const changes = diff(row, next);
  if (!Object.keys(changes).length) go(back, "inchange");
  await writeOverrides("questions", id, changes, ["options", "correct"]);
  await audit(admin, "question.update", { id: null, label: next.prompt.slice(0, 120) }, { parcours: row.slug, champs: Object.keys(changes) });
  refresh(row.slug);
  go(back, "question-ok");
}

/* ---------- Retour à la version des fichiers ---------- */

/**
 * Efface les surcharges d'un élément et remet les valeurs des fichiers de content/.
 * Pour un parcours, seule sa fiche est concernée (pas ses modules ni ses chapitres).
 */
export async function revertAction(form: FormData): Promise<void> {
  const admin = await requireAdmin("/admin/catalogue");
  const kind = String(form.get("kind") ?? "");
  const id = toId(form.get("id"));
  if (!id || !["parcours", "modules", "chapters", "sections", "questions"].includes(kind)) go("/admin/catalogue", "introuvable");

  const row = await queryOne<{
    p_slug: string;
    m_slug: string | null;
    c_slug: string | null;
    s_slug: string | null;
    chapter_id: number | null;
    q_position: number | null;
  }>(
    {
      parcours: "SELECT p.slug AS p_slug, NULL AS m_slug, NULL AS c_slug, NULL AS s_slug, NULL::int AS chapter_id, NULL::int AS q_position FROM parcours p WHERE p.id = $1",
      modules:
        "SELECT p.slug AS p_slug, m.slug AS m_slug, NULL AS c_slug, NULL AS s_slug, NULL::int AS chapter_id, NULL::int AS q_position FROM modules m JOIN parcours p ON p.id = m.parcours_id WHERE m.id = $1",
      chapters: `SELECT p.slug AS p_slug, m.slug AS m_slug, c.slug AS c_slug, NULL AS s_slug, NULL::int AS chapter_id, NULL::int AS q_position FROM chapters c
                 JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id WHERE c.id = $1`,
      sections: `SELECT p.slug AS p_slug, m.slug AS m_slug, c.slug AS c_slug, s.slug AS s_slug, c.id AS chapter_id, NULL::int AS q_position FROM sections s
                 JOIN chapters c ON c.id = s.chapter_id JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id
                 WHERE s.id = $1`,
      questions: `SELECT p.slug AS p_slug, m.slug AS m_slug, c.slug AS c_slug, NULL AS s_slug, c.id AS chapter_id, q.position AS q_position
                  FROM questions q JOIN chapters c ON c.id = q.chapter_id JOIN modules m ON m.id = c.module_id
                  JOIN parcours p ON p.id = m.parcours_id WHERE q.id = $1`,
    }[kind]!,
    [id],
  );
  if (!row) go("/admin/catalogue", "introuvable");
  const back =
    kind === "sections"
      ? `/admin/catalogue/${row.p_slug}/chapitres/${row.chapter_id}`
      : kind === "questions"
        ? `/admin/catalogue/${row.p_slug}/chapitres/${row.chapter_id}/questions#question-${id}`
        : `/admin/catalogue/${row.p_slug}`;

  const src = sourceParcours(row.p_slug);
  const mod = src?.modules.find((m) => m.slug === row.m_slug);
  const chap = mod?.chapters.find((c) => c.slug === row.c_slug);
  const sec = chap?.sections.find((s) => s.slug === row.s_slug);
  const qst = row.q_position !== null ? chap?.questions[row.q_position] : undefined;
  let label = "";
  if (kind === "parcours" && src) {
    label = src.title;
    await query(
      `UPDATE parcours SET title=$2, tagline=$3, description=$4, level=$5, color=$6, icon=$7, status=$8, position=$9,
         prerequisites=$10, outcomes=$11, overrides='{}'::jsonb, updated_at = now() WHERE id = $1`,
      [id, src.title, src.tagline, src.description, src.level, src.color, src.icon, src.status, src.order,
        JSON.stringify(src.prerequisites), JSON.stringify(src.outcomes)],
    );
  } else if (kind === "modules" && mod) {
    label = mod.title;
    await query("UPDATE modules SET title=$2, description=$3, overrides='{}'::jsonb WHERE id = $1", [id, mod.title, mod.description]);
  } else if (kind === "chapters" && chap) {
    label = chap.title;
    await query("UPDATE chapters SET title=$2, description=$3, duration_minutes=$4, objectives=$5, overrides='{}'::jsonb WHERE id = $1", [
      id,
      chap.title,
      chap.description,
      chap.duration,
      JSON.stringify(chap.objectives),
    ]);
  } else if (kind === "sections" && sec) {
    label = sec.title;
    await query("UPDATE sections SET title=$2, body_md=$3, overrides='{}'::jsonb WHERE id = $1", [id, sec.title, sec.body]);
  } else if (kind === "questions" && qst) {
    label = qst.prompt.slice(0, 120);
    await query(
      "UPDATE questions SET prompt=$2, code=$3, options=$4, correct=$5, multiple=$6, explanation=$7, overrides='{}'::jsonb WHERE id = $1",
      [id, qst.prompt, qst.code ?? null, JSON.stringify(qst.options), JSON.stringify([...qst.answer].sort((a, b) => a - b)), qst.multiple, qst.explanation],
    );
  } else {
    go(back, "source-introuvable");
  }
  await audit(admin, kind === "parcours" ? "course.revert" : "content.revert", { id: null, label }, { parcours: row.p_slug, element: kind });
  refresh(row.p_slug);
  go(back, "restaure");
}
