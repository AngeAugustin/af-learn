-- Questions d'évaluation modifiables depuis le back office, comme le reste du catalogue
-- (voir 007_catalog.sql) : les champs modifiés à la main survivent à `npm run db:seed`.
ALTER TABLE questions ADD COLUMN overrides jsonb NOT NULL DEFAULT '{}';
