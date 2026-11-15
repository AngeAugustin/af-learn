-- Attestations de fin de parcours : une par apprenant et par parcours, avec un identifiant public
-- non séquentiel (ex. CUR-AIE-7K4Q-M29X) utilisé par la page de vérification /verifier/<code>.
-- Les chiffres sont figés au moment de la délivrance pour que la vérification reste stable.
CREATE TABLE certificates (
    code          text PRIMARY KEY,
    user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parcours_id   int  NOT NULL REFERENCES parcours(id) ON DELETE CASCADE,
    holder_name   text NOT NULL,
    module_count  int  NOT NULL,
    chapter_count int  NOT NULL,
    minutes       int  NOT NULL,
    final_score   int  NOT NULL CHECK (final_score BETWEEN 0 AND 100),
    average_score int  NOT NULL CHECK (average_score BETWEEN 0 AND 100),
    issued_at     timestamptz NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, parcours_id)
);
