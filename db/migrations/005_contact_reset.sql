-- Messages reçus via le formulaire de contact
CREATE TABLE contact_messages (
    id         serial PRIMARY KEY,
    user_id    uuid REFERENCES users(id) ON DELETE SET NULL,
    name       text NOT NULL,
    email      text NOT NULL,
    subject    text NOT NULL,
    message    text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    handled_at timestamptz
);
CREATE INDEX contact_messages_created_idx ON contact_messages(created_at DESC);

-- Jetons de réinitialisation du mot de passe : seule l'empreinte SHA-256 est stockée.
CREATE TABLE password_resets (
    id         text PRIMARY KEY,
    user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL,
    used_at    timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX password_resets_user_idx ON password_resets(user_id);
