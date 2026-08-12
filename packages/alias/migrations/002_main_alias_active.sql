-- Désactivation du forward pour l'adresse principale (username@domaine)
ALTER TABLE alias_users ADD COLUMN IF NOT EXISTS main_alias_active BOOLEAN NOT NULL DEFAULT true;
