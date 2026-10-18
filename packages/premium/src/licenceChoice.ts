// Choix de la licence d'un appareil. Règle validée le 2026-10-17 :
// - pour une clé enregistrée, la date renvoyée par le serveur fait foi ; la date mémorisée sur l'appareil
//   n'entre pas dans le choix (elle ne sert qu'en repli hors ligne) ;
// - l'achat App Store reste une source à part : la date retenue est la plus tardive des deux ;
// - une clé refusée par le serveur (expirée ou inconnue) passe sur la licence du compte, si elle est valide.
// Partagé par iOS, Android et l'extension : une seule règle, testée ici.
import type { DeviceInfo, PremiumTier } from "./index";

export type StoredKeyStatus =
  | { ok: true; premiumUntil: string | null; tier: PremiumTier; devices: DeviceInfo[] }
  | { ok: false; httpStatus: number };

export type IdentityLicence = {
  premiumUntil: string | null;
  tier: PremiumTier;
  licenseKey?: string;
  devices?: DeviceInfo[];
} | null;

export type LicenceChoice = {
  /** Clé à garder sur cet appareil (null si aucune). */
  key: string | null;
  /** Vrai si la clé vient d'être remplacée par la licence du compte : à enregistrer et à rattacher à l'appareil. */
  adoptedKey: boolean;
  /** Date d'expiration retenue. */
  until: string | null;
  tier: PremiumTier;
  devices: DeviceInfo[];
};

function isValidUntil(until: string | null | undefined): boolean {
  if (!until) return false;
  try {
    return new Date() < new Date(until);
  } catch {
    return false;
  }
}

function laterOf(a: string | null | undefined, b: string | null | undefined): string | null {
  if (!a) return b || null;
  if (!b) return a;
  return new Date(a) > new Date(b) ? a : b;
}

/** Faut-il interroger la licence du compte ? Oui si la clé manque, est expirée ou est refusée par le serveur. */
export function needsIdentityLicence(storedKey: string | null, keyStatus: StoredKeyStatus | null): boolean {
  if (!storedKey) return true;
  if (!keyStatus) return false; // pas de réponse : on garde la clé telle quelle
  if (keyStatus.ok) return !isValidUntil(keyStatus.premiumUntil);
  return keyStatus.httpStatus >= 400 && keyStatus.httpStatus < 500;
}

export function chooseLicence(input: {
  storedKey: string | null;
  keyStatus: StoredKeyStatus | null;
  identity: IdentityLicence;
  iapUntil: string | null;
  localUntil: string | null;
}): LicenceChoice {
  const { storedKey, keyStatus, identity, iapUntil, localUntil } = input;

  // 1. Clé enregistrée reconnue et valide : le serveur fait foi pour sa date.
  if (storedKey && keyStatus?.ok && isValidUntil(keyStatus.premiumUntil)) {
    return { key: storedKey, adoptedKey: false, until: laterOf(iapUntil, keyStatus.premiumUntil), tier: keyStatus.tier, devices: keyStatus.devices };
  }

  // 2. Licence valide du compte : elle remplace une clé absente, expirée ou refusée.
  if (identity?.licenseKey && isValidUntil(identity.premiumUntil)) {
    return {
      key: identity.licenseKey,
      adoptedKey: identity.licenseKey !== storedKey,
      until: laterOf(iapUntil, identity.premiumUntil),
      tier: identity.tier,
      devices: identity.devices ?? [],
    };
  }

  // 3. Rien de valide côté serveur.
  if (storedKey && keyStatus?.ok) {
    // Clé connue mais expirée : la date du serveur, jamais la date mémorisée.
    return { key: storedKey, adoptedKey: false, until: laterOf(iapUntil, keyStatus.premiumUntil), tier: keyStatus.tier, devices: keyStatus.devices };
  }
  if (storedKey && keyStatus && !keyStatus.ok && keyStatus.httpStatus >= 400 && keyStatus.httpStatus < 500) {
    // Clé refusée par le serveur : aucune date mémorisée ne la remplace.
    return { key: storedKey, adoptedKey: false, until: iapUntil, tier: "free", devices: [] };
  }
  if (storedKey) {
    // Pas de réponse exploitable (hors ligne, erreur serveur) : dernière date connue.
    return { key: storedKey, adoptedKey: false, until: laterOf(iapUntil, localUntil), tier: "free", devices: [] };
  }
  // Ni clé ni licence valide du compte.
  return {
    key: null,
    adoptedKey: false,
    until: laterOf(iapUntil, identity?.premiumUntil ?? null),
    tier: identity?.tier ?? "free",
    devices: identity?.devices ?? [],
  };
}
