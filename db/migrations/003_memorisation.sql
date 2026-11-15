-- Mémorisation : révisions espacées, examens de module et examen final

-- Une carte de révision par question et par apprenant, créée quand le chapitre est validé.
-- box : 1 → révision à J+1, 2 → J+7, 3 → J+30, 4 → J+90 (question maîtrisée).
CREATE TABLE review_cards (
    user_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id      int  NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    box              smallint NOT NULL DEFAULT 1 CHECK (box BETWEEN 1 AND 4),
    due_at           timestamptz NOT NULL,
    reviews          int NOT NULL DEFAULT 0,
    lapses           int NOT NULL DEFAULT 0,
    last_reviewed_at timestamptz,
    created_at       timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, question_id)
);
CREATE INDEX review_cards_due_idx ON review_cards(user_id, due_at);

-- Séances de révision (pour afficher la correction après l'envoi)
CREATE TABLE review_sessions (
    id         serial PRIMARY KEY,
    user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answers    jsonb NOT NULL,   -- [{ questionId, selected, isCorrect, box, dueAt }]
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX review_sessions_user_idx ON review_sessions(user_id, created_at DESC);

-- Examens : module_id renseigné pour un examen de module, NULL pour l'examen final du parcours
CREATE TABLE exam_attempts (
    id            serial PRIMARY KEY,
    user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parcours_id   int  NOT NULL REFERENCES parcours(id) ON DELETE CASCADE,
    module_id     int  REFERENCES modules(id) ON DELETE CASCADE,
    score         int  NOT NULL CHECK (score BETWEEN 0 AND 100),
    correct_count int  NOT NULL,
    total         int  NOT NULL,
    passed        boolean NOT NULL,
    answers       jsonb NOT NULL,   -- [{ questionId, selected, isCorrect }]
    created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX exam_attempts_user_idx ON exam_attempts(user_id, parcours_id, module_id, created_at DESC);

-- Les chapitres déjà validés entrent immédiatement dans les révisions
INSERT INTO review_cards (user_id, question_id, box, due_at)
SELECT DISTINCT a.user_id, q.id, 1::smallint, now()
FROM quiz_attempts a
JOIN questions q ON q.chapter_id = a.chapter_id
WHERE a.passed
ON CONFLICT DO NOTHING;
