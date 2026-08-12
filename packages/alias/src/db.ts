import pg from "pg";
import { generateRandomAlias } from "./generate.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const conn = process.env.DATABASE_URL || process.env.ALIAS_DATABASE_URL;
    if (!conn) {
      throw new Error("DATABASE_URL ou ALIAS_DATABASE_URL requis");
    }
    pool = new Pool({ connectionString: conn });
  }
  return pool;
}

export interface AliasLookup {
  real_destination: string;
  public_key_armored: string | null;
}

export async function lookupRecipient(
localPart: string)
: Promise<AliasLookup | null> {
  const pool = getPool();
  const aliasRes = await pool.query<AliasLookup>(
    `SELECT u.real_destination, u.public_key_armored
     FROM aliases a
     JOIN alias_users u ON a.user_id = u.id
     WHERE a.local_part = $1 AND a.active = true`,
    [localPart]
  );
  if (aliasRes.rows.length > 0) return aliasRes.rows[0];

  const mainRes = await pool.query<AliasLookup>(
    `SELECT real_destination, public_key_armored
     FROM alias_users
     WHERE username = $1 AND main_alias_active = true`,
    [localPart]
  );
  if (mainRes.rows.length > 0) return mainRes.rows[0];

  return null;
}

export interface AliasUserRow {
  id: string;
  wallet_address: string;
  username: string;
  real_destination: string;
  public_key_armored: string | null;
  main_alias_active: boolean;
}

export interface AliasRow {
  id: string;
  user_id: string;
  local_part: string;
  active: boolean;
  site_name: string | null;
  created_at: Date;
}

export async function findUserByWallet(
walletAddress: string)
: Promise<AliasUserRow | null> {
  const res = await getPool().query<AliasUserRow>(
    "SELECT * FROM alias_users WHERE wallet_address = $1",
    [walletAddress.toLowerCase()]
  );
  return res.rows[0] ?? null;
}

export async function createUser(
walletAddress: string,
realDestination: string,
publicKeyArmored: string | null)
: Promise<AliasUserRow> {
  const wallet = walletAddress.toLowerCase();
  let username = generateRandomAlias(10);
  for (let i = 0; i < 10; i++) {
    if (!(await isLocalPartTaken(username))) break;
    username = generateRandomAlias(10);
  }
  const res = await getPool().query<AliasUserRow>(
    `INSERT INTO alias_users (wallet_address, username, real_destination, public_key_armored)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [wallet, username, realDestination, publicKeyArmored]
  );
  return res.rows[0];
}

export async function ensureUser(
walletAddress: string,
realDestination: string,
publicKeyArmored: string | null)
: Promise<AliasUserRow> {
  const existing = await findUserByWallet(walletAddress);
  if (existing) {
    await getPool().query(
      `UPDATE alias_users SET real_destination = $1, public_key_armored = COALESCE($2, public_key_armored) WHERE wallet_address = $3`,
      [realDestination, publicKeyArmored, walletAddress.toLowerCase()]
    );
    return (await findUserByWallet(walletAddress))!;
  }
  return createUser(walletAddress, realDestination, publicKeyArmored);
}

export async function createAlias(
userId: string,
localPart: string,
siteName: string | null)
: Promise<AliasRow> {
  const res = await getPool().query<AliasRow>(
    `INSERT INTO aliases (user_id, local_part, site_name) VALUES ($1, $2, $3) RETURNING *`,
    [userId, localPart, siteName]
  );
  return res.rows[0];
}

export async function listAliasesByUserId(userId: string): Promise<AliasRow[]> {
  const res = await getPool().query<AliasRow>(
    "SELECT * FROM aliases WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return res.rows;
}

export async function setAliasActive(
aliasId: string,
userId: string,
active: boolean)
: Promise<boolean> {
  const res = await getPool().query(
    "UPDATE aliases SET active = $1 WHERE id = $2 AND user_id = $3",
    [active, aliasId, userId]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function setMainAliasActive(
userId: string,
active: boolean)
: Promise<boolean> {
  const res = await getPool().query(
    "UPDATE alias_users SET main_alias_active = $1 WHERE id = $2",
    [active, userId]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function deleteAlias(
aliasId: string,
userId: string)
: Promise<boolean> {
  const res = await getPool().query(
    "DELETE FROM aliases WHERE id = $2 AND user_id = $1",
    [userId, aliasId]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function isLocalPartTaken(localPart: string): Promise<boolean> {
  const pool = getPool();
  const a = await pool.query("SELECT 1 FROM aliases WHERE local_part = $1", [localPart]);
  if (a.rows.length > 0) return true;
  const b = await pool.query("SELECT 1 FROM alias_users WHERE username = $1", [localPart]);
  return b.rows.length > 0;
}