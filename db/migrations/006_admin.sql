-- Back office : rôles, suspension, dernière activité, révocation des attestations,
-- journal d'audit et mesure d'audience interne (sans cookie, sans IP conservée).

ALTER TABLE users
    ADD COLUMN role         text NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'admin')),
    ADD COLUMN suspended_at timestamptz,
    ADD COLUMN last_seen_at timestamptz;
CREATE INDEX users_created_idx ON users(created_at DESC);

ALTER TABLE certificates
    ADD COLUMN revoked_at     timestamptz,
    ADD COLUMN revoked_reason text;

-- Journal des actions d'administration. Les cibles ne sont pas des clés étrangères :
-- l'entrée reste lisible après la suppression du compte concerné.
CREATE TABLE audit_log (
    id             serial PRIMARY KEY,
    actor_id       uuid REFERENCES users(id) ON DELETE SET NULL,
    actor_email    text NOT NULL,
    action         text NOT NULL,
    target_user_id uuid,
    target_label   text,
    details        jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_log_created_idx ON audit_log(created_at DESC);
CREATE INDEX audit_log_target_idx ON audit_log(target_user_id, created_at DESC);

-- Pages vues. « visitor » est une empreinte quotidienne (IP + navigateur + sel du jour) :
-- l'IP n'est jamais stockée et le sel est effacé après 2 jours, l'empreinte devient alors anonyme.
CREATE TABLE page_views (
    id            bigserial PRIMARY KEY,
    day           date NOT NULL DEFAULT current_date,
    created_at    timestamptz NOT NULL DEFAULT now(),
    path          text NOT NULL,
    referrer_host text,
    utm_source    text,
    device        text NOT NULL CHECK (device IN ('mobile', 'tablet', 'desktop')),
    visitor       text NOT NULL
);
CREATE INDEX page_views_day_idx ON page_views(day);
CREATE INDEX page_views_path_idx ON page_views(path, day);

CREATE TABLE analytics_salts (
    day  date PRIMARY KEY,
    salt text NOT NULL
);
