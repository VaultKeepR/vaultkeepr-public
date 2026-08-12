export interface AliasUser {
  id: string;
  wallet_address: string;
  real_destination: string;
  public_key_armored: string | null;
  created_at: Date;
}

export interface Alias {
  id: string;
  user_id: string;
  local_part: string;
  active: boolean;
  site_name: string | null;
  created_at: Date;
}