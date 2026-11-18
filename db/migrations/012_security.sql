-- Plafond de tentatives partagé entre toutes les instances, confirmation d'adresse
-- exigée avant une attestation, et trace de cette confirmation sur l'attestation.

ALTER TABLE users ADD COLUMN email_verified_at timestamptz;
-- Les comptes déjà créés restent utilisables : leur adresse était le seul moyen de connexion.
UPDATE users SET email_verified_at = created_at WHERE email_verified_at IS NULL;

CREATE TABLE email_verifications (
    id         text PRIMARY KEY,            -- empreinte SHA-256 du jeton envoyé par email
    user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL,
    used_at    timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX email_verifications_user_idx ON email_verifications(user_id);

CREATE TABLE rate_limit_hits (
    bucket     text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rate_limit_hits_bucket_idx ON rate_limit_hits (bucket, created_at);

ALTER TABLE certificates ADD COLUMN email_confirmed boolean NOT NULL DEFAULT false;
