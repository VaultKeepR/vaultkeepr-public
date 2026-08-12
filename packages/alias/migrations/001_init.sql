-- alias_users : un utilisateur = wallet + email de destination + clé publique optionnelle
CREATE TABLE IF NOT EXISTS alias_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  username VARCHAR(64) UNIQUE NOT NULL,
  real_destination VARCHAR(255) NOT NULL,
  public_key_armored TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- aliases : alias random par site, forward vers l'utilisateur
CREATE TABLE IF NOT EXISTS aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES alias_users(id) ON DELETE CASCADE,
  local_part VARCHAR(64) UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  site_name VARCHAR(128),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aliases_local_part ON aliases(local_part) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_aliases_user ON aliases(user_id);
