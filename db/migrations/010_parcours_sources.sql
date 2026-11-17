-- Sources et références de chaque parcours (livres, documentation, articles, cours), issues de parcours.yaml.
ALTER TABLE parcours ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb;
