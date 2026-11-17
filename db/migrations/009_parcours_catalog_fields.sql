-- Domaine (filtre du catalogue) et compétences clés (cartes du catalogue) de chaque parcours.
ALTER TABLE parcours ADD COLUMN IF NOT EXISTS domain text NOT NULL DEFAULT '';
ALTER TABLE parcours ADD COLUMN IF NOT EXISTS skills jsonb NOT NULL DEFAULT '[]'::jsonb;
