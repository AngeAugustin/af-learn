import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Tests d'intégration sur une vraie base PostgreSQL.
 * Ils ne s'exécutent que si TEST_DATABASE_URL est défini, et VIDENT cette base : n'utilisez jamais votre base de travail.
 */
const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("base de données (intégration)", () => {
  let db: typeof import("@/lib/db");
  let queries: typeof import("@/lib/queries");
  let userId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    db = await import("@/lib/db");
    const pool = db.getPool();
    await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
    const { migrate } = await import("../scripts/migrate");
    const { seed } = await import("../scripts/seed");
    await migrate();
    await seed();
    queries = await import("@/lib/queries");
    const user = await db.queryOne<{ id: string }>(
      "INSERT INTO users (email, name, password_hash) VALUES ('test@exemple.com', 'Test', 'x') RETURNING id",
    );
    userId = user!.id;
  });

  afterAll(async () => {
    await db?.getPool().end();
  });

  it("le chargement est idempotent", async () => {
    const before = await db.queryOne<{ n: number }>("SELECT count(*)::int AS n FROM sections");
    const { seed } = await import("../scripts/seed");
    const stats = await seed();
    const after = await db.queryOne<{ n: number }>("SELECT count(*)::int AS n FROM sections");
    expect(after!.n).toBe(before!.n);
    expect(after!.n).toBe(stats.sections);
    const migrations = await db.query("SELECT * FROM schema_migrations");
    const { readdirSync } = await import("node:fs");
    expect(migrations.length).toBe(readdirSync("db/migrations").filter((f) => f.endsWith(".sql")).length);
  });

  it("ouvre le premier chapitre et verrouille les suivants", async () => {
    const course = await queries.getCourse("ai-engineering", userId);
    expect(course).not.toBeNull();
    expect(course!.chapters[0].state).toBe("available");
    expect(course!.chapters[1].state).toBe("locked");
    expect(course!.chapters[0].quizOpen).toBe(false);
  });

  it("ouvre l'évaluation après lecture de toutes les sections, puis débloque le chapitre suivant après réussite", async () => {
    let course = (await queries.getCourse("ai-engineering", userId))!;
    const first = course.chapters[0];
    for (const s of first.sections) {
      await db.query("INSERT INTO section_progress (user_id, section_id) VALUES ($1, $2)", [userId, s.id]);
    }
    course = (await queries.getCourse("ai-engineering", userId))!;
    expect(course.chapters[0].quizOpen).toBe(true);
    expect(course.chapters[1].state).toBe("locked");

    // Un échec ne débloque rien
    await db.query(
      "INSERT INTO quiz_attempts (user_id, chapter_id, score, correct_count, total, passed, answers) VALUES ($1, $2, 70, 7, 10, false, '[]')",
      [userId, first.id],
    );
    course = (await queries.getCourse("ai-engineering", userId))!;
    expect(course.chapters[1].state).toBe("locked");
    expect(course.chapters[0].bestScore).toBe(70);

    // Une réussite débloque le chapitre suivant
    await db.query(
      "INSERT INTO quiz_attempts (user_id, chapter_id, score, correct_count, total, passed, answers) VALUES ($1, $2, 80, 8, 10, true, '[]')",
      [userId, first.id],
    );
    course = (await queries.getCourse("ai-engineering", userId))!;
    expect(course.chapters[0].state).toBe("passed");
    expect(course.chapters[0].bestScore).toBe(80);
    expect(course.chapters[1].state).toBe("available");
    expect(course.chapters[2].state).toBe("locked");
    expect(course.totals.passed).toBe(1);
  });

  it("stocke les questions avec des réponses cohérentes", async () => {
    const course = (await queries.getCourse("ai-engineering", userId))!;
    for (const c of course.chapters) {
      const qs = await queries.getQuestions(c.id);
      expect(qs.length, c.slug).toBe(c.questionCount);
      for (const q of qs) {
        expect(q.correct.length).toBeGreaterThan(0);
        expect(q.correct.every((i) => i < q.options.length)).toBe(true);
        expect(q.multiple ? q.correct.length > 1 : q.correct.length === 1).toBe(true);
      }
    }
  });
});
