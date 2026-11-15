"use server";

import { redirect } from "next/navigation";
import { getCurrentUser, safeNext } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { getCourse, isCourseOpen } from "@/lib/queries";

/**
 * Marque une section comme lue puis redirige vers la page suivante.
 * Vérifie côté serveur que le chapitre est bien accessible à l'utilisateur.
 */
export async function completeSectionAction(form: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  const sectionId = Number(form.get("sectionId"));
  const next = safeNext(form.get("suivant"), "/tableau-de-bord");
  if (!Number.isInteger(sectionId)) redirect(next);

  const row = await queryOne<{ parcours_slug: string; chapter_id: number }>(
    `SELECT p.slug AS parcours_slug, c.id AS chapter_id
     FROM sections s JOIN chapters c ON c.id = s.chapter_id
     JOIN modules m ON m.id = c.module_id JOIN parcours p ON p.id = m.parcours_id
     WHERE s.id = $1`,
    [sectionId],
  );
  if (!row) redirect(next);
  const course = await getCourse(row.parcours_slug, user.id);
  const chapter = course?.chapters.find((c) => c.id === row.chapter_id);
  if (course && chapter && isCourseOpen(course.parcours.status, user.role) && chapter.state !== "locked") {
    await query(
      "INSERT INTO section_progress (user_id, section_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [user.id, sectionId],
    );
  }
  redirect(next);
}
