-- Photo de couverture des cartes du catalogue (chemin local, texte alternatif et crédit), issue de parcours.yaml.
ALTER TABLE parcours ADD COLUMN IF NOT EXISTS cover jsonb;
