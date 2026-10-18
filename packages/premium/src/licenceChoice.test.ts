import { describe, it, expect } from "vitest";
import { chooseLicence, needsIdentityLicence, type StoredKeyStatus, type IdentityLicence } from "./licenceChoice";

const future = () => new Date(Date.now() + 365 * 86400000).toISOString();
const past = () => new Date(Date.now() - 30 * 86400000).toISOString();
const ok = (premiumUntil: string | null, tier: "ultimate" | "premium" | "cloud_pro" | "free" = "ultimate"): StoredKeyStatus =>
  ({ ok: true, premiumUntil, tier, devices: [] });
const idLicence = (licenseKey: string, premiumUntil: string | null): IdentityLicence =>
  ({ licenseKey, premiumUntil, tier: "ultimate", devices: [] });

describe("needsIdentityLicence", () => {
  it("demande la licence du compte si aucune clé n'est enregistrée", () => {
    expect(needsIdentityLicence(null, null)).toBe(true);
  });
  it("ne la demande pas si la clé est valide", () => {
    expect(needsIdentityLicence("K1", ok(future()))).toBe(false);
  });
  it("la demande si la clé est expirée côté serveur", () => {
    expect(needsIdentityLicence("K1", ok(past()))).toBe(true);
  });
  it("la demande si le serveur refuse la clé (4xx)", () => {
    expect(needsIdentityLicence("K1", { ok: false, httpStatus: 404 })).toBe(true);
  });
  it("ne la demande pas en cas d'erreur serveur (repli hors ligne)", () => {
    expect(needsIdentityLicence("K1", { ok: false, httpStatus: 500 })).toBe(false);
  });
  it("ne la demande pas sans réponse du serveur", () => {
    expect(needsIdentityLicence("K1", null)).toBe(false);
  });
});

describe("chooseLicence", () => {
  it("garde une clé valide et prend la date du serveur", () => {
    const until = future();
    const c = chooseLicence({ storedKey: "K1", keyStatus: ok(until), identity: null, iapUntil: null, localUntil: null });
    expect(c).toMatchObject({ key: "K1", adoptedKey: false, until, tier: "ultimate" });
  });

  it("garde la date App Store si elle est plus tardive que celle du serveur", () => {
    const iap = future();
    const c = chooseLicence({ storedKey: "K1", keyStatus: ok(past()), identity: null, iapUntil: iap, localUntil: null });
    expect(c.until).toBe(iap);
  });

  it("une clé expirée ne garde pas la date mémorisée sur l'appareil", () => {
    const expired = past();
    const c = chooseLicence({ storedKey: "K1", keyStatus: ok(expired), identity: null, iapUntil: null, localUntil: future() });
    expect(c.until).toBe(expired);
  });

  it("une clé expirée passe sur la licence valide du compte", () => {
    const newUntil = future();
    const c = chooseLicence({ storedKey: "OLD", keyStatus: ok(past()), identity: idLicence("NEW", newUntil), iapUntil: null, localUntil: null });
    expect(c).toMatchObject({ key: "NEW", adoptedKey: true, until: newUntil });
  });

  it("une clé expirée reste si la licence du compte est aussi expirée", () => {
    const expired = past();
    const c = chooseLicence({ storedKey: "OLD", keyStatus: ok(expired), identity: idLicence("NEW", past()), iapUntil: null, localUntil: null });
    expect(c).toMatchObject({ key: "OLD", adoptedKey: false, until: expired });
  });

  it("une clé refusée (inconnue) passe sur la licence valide du compte", () => {
    const c = chooseLicence({ storedKey: "GONE", keyStatus: { ok: false, httpStatus: 404 }, identity: idLicence("NEW", future()), iapUntil: null, localUntil: future() });
    expect(c).toMatchObject({ key: "NEW", adoptedKey: true });
  });

  it("une clé refusée sans licence du compte n'utilise pas la date mémorisée", () => {
    const c = chooseLicence({ storedKey: "GONE", keyStatus: { ok: false, httpStatus: 404 }, identity: null, iapUntil: null, localUntil: future() });
    expect(c.until).toBeNull();
  });

  it("hors ligne, la dernière date connue sert de repli", () => {
    const local = future();
    const c = chooseLicence({ storedKey: "K1", keyStatus: { ok: false, httpStatus: 500 }, identity: null, iapUntil: null, localUntil: local });
    expect(c).toMatchObject({ key: "K1", adoptedKey: false, until: local });
  });

  it("sans clé, la licence valide du compte est adoptée", () => {
    const until = future();
    const c = chooseLicence({ storedKey: null, keyStatus: null, identity: idLicence("NEW", until), iapUntil: null, localUntil: null });
    expect(c).toMatchObject({ key: "NEW", adoptedKey: true, until });
  });

  it("sans clé ni licence du compte, rien n'est adopté", () => {
    const c = chooseLicence({ storedKey: null, keyStatus: null, identity: null, iapUntil: null, localUntil: future() });
    expect(c).toMatchObject({ key: null, adoptedKey: false, until: null, tier: "free" });
  });

  it("une licence du compte expirée n'est pas adoptée", () => {
    const c = chooseLicence({ storedKey: null, keyStatus: null, identity: idLicence("NEW", past()), iapUntil: null, localUntil: null });
    expect(c.adoptedKey).toBe(false);
    expect(c.key).toBeNull();
  });

  it("une clé expirée et une licence du compte identique ne sont pas une adoption", () => {
    const until = future();
    const c = chooseLicence({ storedKey: "K1", keyStatus: ok(past()), identity: idLicence("K1", until), iapUntil: null, localUntil: null });
    expect(c).toMatchObject({ key: "K1", adoptedKey: false, until });
  });

  it("un achat App Store valide couvre une clé expirée", () => {
    const iap = future();
    const c = chooseLicence({ storedKey: "K1", keyStatus: ok(past()), identity: null, iapUntil: iap, localUntil: null });
    expect(c.until).toBe(iap);
  });
});
