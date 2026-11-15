-- Gestion du catalogue depuis le back office.
--
-- Le contenu vient des fichiers de content/ et `npm run db:seed` le recharge. Pour que les
-- modifications faites dans le back office survivent à un rechargement, chaque ligne garde dans
-- `overrides` les champs modifiés à la main : le chargement du contenu applique d'abord ces
-- valeurs, puis celles des fichiers pour tout le reste.

-- Nouveau statut « hidden » : le parcours n'apparaît plus nulle part pour le public.
ALTER TABLE parcours DROP CONSTRAINT IF EXISTS parcours_status_check;
ALTER TABLE parcours ADD CONSTRAINT parcours_status_check CHECK (status IN ('published', 'coming_soon', 'hidden'));

ALTER TABLE parcours ADD COLUMN overrides jsonb NOT NULL DEFAULT '{}';
ALTER TABLE parcours ADD COLUMN updated_at timestamptz;
ALTER TABLE modules  ADD COLUMN overrides jsonb NOT NULL DEFAULT '{}';
ALTER TABLE chapters ADD COLUMN overrides jsonb NOT NULL DEFAULT '{}';
ALTER TABLE sections ADD COLUMN overrides jsonb NOT NULL DEFAULT '{}';
