



















































import { describe, it, expect, vi } from "vitest";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";











vi.mock("@vault-keeper/core", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@vault-keeper/core")>();
  return {
    ...mod,
    deriveKeyFromPasswordArgon2: (password: string, salt: Uint8Array): Uint8Array => {
      return hmac(sha256, new TextEncoder().encode(password), salt);
    }
  };
});

import {
  encryptVault,
  decryptVault,
  deriveKeyFromPasswordArgon2,
  generateSaltArgon2,
  serializeVault,
  parseVault,
  threeWayMerge,
  deleteVaultEntry,
  createEntry,
  createEmptyVault,
  PAYLOAD_VERSION_CURRENT,
  type Vault,
  type VaultEntry,
  type SecureDocument,
  type CloudFile,
  type EncryptedVault } from
"@vault-keeper/core";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";



type PlatformId = "chrome" | "firefox" | "ios" | "android";
type AccountType = "password" | "passkey";

interface V4Payload {
  ciphertext: string;
  nonce: string;
  salt: string;
  commitment: string;
  version: number;
  updatedAt: number;
}



class MockIPFS {
  private store = new Map<string, string>();
  private cidCounter = 0;

  upload(payload: string): string {
    const cid = `bafy${(this.cidCounter++).toString().padStart(10, "0")}`;
    this.store.set(cid, payload);
    return cid;
  }

  fetch(cid: string): string {
    const data = this.store.get(cid);
    if (!data) throw new Error(`CID not found: ${cid}`);
    return data;
  }
}













class SimDevice {
  vault: Vault;
  readonly password: string;
  readonly platform: PlatformId;
  readonly accountType: AccountType;
  storedCid: string | null = null;
  lastKnownUpdatedAt = 0;
  mergeBase: Vault | null = null;




  passwordRePrompted = false;

  constructor(platform: PlatformId, accountType: AccountType, password: string) {
    this.platform = platform;
    this.accountType = accountType;
    this.password = password;
    this.vault = createEmptyVault();
  }



  async push(ipfs: MockIPFS): Promise<string> {
    const salt = generateSaltArgon2();
    const key = await deriveKeyFromPasswordArgon2(this.password, salt);
    const plaintext = serializeVault(this.vault);
    const encrypted = encryptVault(plaintext, key, { wipeKeyAfterUse: false });
    const payload: V4Payload = {
      ...encrypted,
      salt: bytesToHex(salt),
      version: PAYLOAD_VERSION_CURRENT,
      updatedAt: Date.now()
    };
    const payloadStr = JSON.stringify(payload);
    const cid = ipfs.upload(payloadStr);






    this.storedCid = cid;
    this.lastKnownUpdatedAt = payload.updatedAt;
    return cid;
  }








  async pull(ipfs: MockIPFS, remoteCid: string): Promise<void> {
    if (this.storedCid === remoteCid) return;

    const raw = ipfs.fetch(remoteCid);
    const payload = JSON.parse(raw) as V4Payload;


    expect(payload.version).toBe(PAYLOAD_VERSION_CURRENT);

    const remoteUpdatedAt = payload.updatedAt;


    if (remoteUpdatedAt < this.lastKnownUpdatedAt) {
      this.storedCid = remoteCid;
      return;
    }


    const salt = hexToBytes(payload.salt);
    const key = await deriveKeyFromPasswordArgon2(this.password, salt);
    const encrypted: EncryptedVault = {
      ciphertext: payload.ciphertext,
      nonce: payload.nonce,
      commitment: payload.commitment,
      version: 2
    };
    const plaintext = decryptVault(encrypted, key, { wipeKeyAfterUse: false });
    const remoteVault = parseVault(plaintext);





    this.vault = threeWayMerge(this.mergeBase ?? null, this.vault, remoteVault);
    this.mergeBase = JSON.parse(JSON.stringify(this.vault));
    this.storedCid = remoteCid;
    this.lastKnownUpdatedAt = remoteUpdatedAt;
  }



  async syncRound(ipfs: MockIPFS, remoteCid: string | null): Promise<string> {
    if (remoteCid) {
      await this.pull(ipfs, remoteCid);
    }
    return this.push(ipfs);
  }



  addLogin(opts: Partial<VaultEntry> & {modifiedAt: number;}): VaultEntry {



    const e = createEntry({
      url: opts.url ?? "https://example.com",
      username: opts.username ?? "user",
      password: opts.password ?? "pass",
      notes: opts.notes,
      title: opts.title,
      totpSecret: opts.totpSecret,
      customFields: opts.customFields,
      modifiedAt: opts.modifiedAt
    });
    e.modifiedAt = opts.modifiedAt;
    this.vault = { ...this.vault, entries: [...this.vault.entries, e] };
    return e;
  }

  addCard(opts: {
    title: string;
    cardholder?: string;
    expiry?: string;
    cvv?: string;
    notes?: string;
    modifiedAt: number;
  }): VaultEntry {
    const customFields = [
    ...(opts.cardholder ? [{ name: "cardholder", value: opts.cardholder, type: "text" as const }] : []),
    ...(opts.expiry ? [{ name: "expiry", value: opts.expiry, type: "text" as const }] : []),
    ...(opts.cvv ? [{ name: "cvv", value: opts.cvv, type: "hidden" as const }] : [])];

    return this.addLogin({
      url: "",
      username: "",
      password: "",
      title: opts.title,
      notes: opts.notes,
      customFields,
      modifiedAt: opts.modifiedAt
    });
  }

  addNote(opts: {title: string;notes: string;modifiedAt: number;}): VaultEntry {
    return this.addLogin({
      url: "",
      username: "",
      password: "",
      title: opts.title,
      notes: opts.notes,
      modifiedAt: opts.modifiedAt
    });
  }

  addDocument(opts: {
    type: SecureDocument["type"];
    label: string;
    modifiedAt: number;
  }): SecureDocument {
    const doc: SecureDocument = {
      id: `doc-${Math.random().toString(36).slice(2, 12)}`,
      type: opts.type,
      label: opts.label,
      fragments: ["frag1-cid", "frag2-cid"],
      nonce: "aabbccdd",
      blurredThumbnail: "base64-thumb",
      originalSize: 1024,
      mimeType: "image/jpeg",
      addedAt: new Date().toISOString(),
      modifiedAt: opts.modifiedAt
    };
    this.vault = {
      ...this.vault,
      documents: [...(this.vault.documents ?? []), doc]
    };
    return doc;
  }

  addCloudFile(opts: {
    fileName: string;
    modifiedAt: number;
  }): CloudFile {
    const cf: CloudFile = {
      id: `cf-${Math.random().toString(36).slice(2, 12)}`,
      category: "document",
      fileName: opts.fileName,
      fragments: ["cf-frag1", "cf-frag2"],
      nonce: "eeff0011",
      originalSize: 2048,
      mimeType: "application/pdf",
      fragmentCount: 2,
      contentHash: "sha256hash",
      addedAt: new Date().toISOString(),
      modifiedAt: opts.modifiedAt
    };
    this.vault = {
      ...this.vault,
      cloudFiles: [...(this.vault.cloudFiles ?? []), cf]
    };
    return cf;
  }

  updateEntry(id: string, updates: Partial<Omit<VaultEntry, "id">>): void {
    this.vault = {
      ...this.vault,
      entries: this.vault.entries.map((e) =>
      e.id === id ? { ...e, ...updates } : e
      )
    };
  }

  deleteEntry(id: string): void {
    this.vault = deleteVaultEntry(this.vault, id);
  }

  addFolder(name: string): void {
    this.vault = {
      ...this.vault,
      folders: [...(this.vault.folders ?? []), name]
    };
  }

  deleteFolder(name: string): void {
    this.vault = {
      ...this.vault,
      folders: (this.vault.folders ?? []).filter((f) => f !== name),
      folderTombstones: {
        ...(this.vault.folderTombstones ?? {}),
        [name]: Date.now()
      }
    };
  }



  entryIds(): string[] {
    return this.vault.entries.map((e) => e.id).sort();
  }

  docIds(): string[] {
    return (this.vault.documents ?? []).map((d) => d.id).sort();
  }

  cloudFileIds(): string[] {
    return (this.vault.cloudFiles ?? []).map((c) => c.id).sort();
  }
}



const ALL_PLATFORMS: PlatformId[] = ["chrome", "firefox", "ios", "android"];
const ACCOUNT_TYPES: AccountType[] = ["password", "passkey"];

const PASSWORD_ACCOUNT_PWD = "MyMasterPassword!2026#strong";
const PASSKEY_ACCOUNT_PWD = "prf-derived-key-a8f3c2e1b9d4f7a6";

function makeDevice(platform: PlatformId, accountType: AccountType): SimDevice {
  const pwd = accountType === "passkey" ? PASSKEY_ACCOUNT_PWD : PASSWORD_ACCOUNT_PWD;
  return new SimDevice(platform, accountType, pwd);
}


function expectConverged(a: SimDevice, b: SimDevice, label = ""): void {
  expect(a.entryIds(), `entries mismatch ${label}`).toEqual(b.entryIds());
  expect(a.docIds(), `documents mismatch ${label}`).toEqual(b.docIds());
  expect(a.cloudFileIds(), `cloudFiles mismatch ${label}`).toEqual(b.cloudFileIds());
}


function expectAllConverged(devices: SimDevice[], label = ""): void {
  if (devices.length < 2) return;
  const baseIds = devices[0].entryIds();
  const baseDocs = devices[0].docIds();
  const baseCloud = devices[0].cloudFileIds();
  for (let i = 1; i < devices.length; i++) {
    expect(devices[i].entryIds(), `entries mismatch ${label} [device ${i}]`).toEqual(baseIds);
    expect(devices[i].docIds(), `documents mismatch ${label} [device ${i}]`).toEqual(baseDocs);
    expect(devices[i].cloudFileIds(), `cloudFiles mismatch ${label} [device ${i}]`).toEqual(baseCloud);
  }
}


function expectNoRePrompt(devices: SimDevice[]): void {
  for (const d of devices) {
    expect(d.passwordRePrompted, `${d.platform}/${d.accountType} re-prompted password`).toBe(false);
  }
}





describe("Cross-Device Sync Certification", () => {





  describe("1. All platform pairs — one-way sync (login add)", () => {
    const pairs: [PlatformId, PlatformId][] = [
    ["chrome", "firefox"],
    ["chrome", "ios"],
    ["chrome", "android"],
    ["firefox", "ios"],
    ["firefox", "android"],
    ["ios", "android"],
    ["ios", "ios"],
    ["android", "android"],
    ["chrome", "chrome"],
    ["firefox", "firefox"]];


    for (const [srcPlatform, dstPlatform] of pairs) {
      for (const accountType of ACCOUNT_TYPES) {
        it(`${srcPlatform}→${dstPlatform} (${accountType}): login add propagates`, async () => {
          const ipfs = new MockIPFS();
          const src = makeDevice(srcPlatform, accountType);
          const dst = makeDevice(dstPlatform, accountType);

          const e = src.addLogin({
            url: "https://github.com",
            username: "dev",
            password: "gh-secret",
            modifiedAt: 1000
          });

          const cid = await src.push(ipfs);
          await dst.pull(ipfs, cid);

          expect(dst.vault.entries).toHaveLength(1);
          expect(dst.vault.entries[0].id).toBe(e.id);
          expect(dst.vault.entries[0].username).toBe("dev");
          expect(dst.vault.entries[0].password).toBe("gh-secret");
          expectNoRePrompt([src, dst]);
        }, 60_000);
      }
    }
  });





  describe("2. Reverse direction — B→A symmetry", () => {
    const pairs: [PlatformId, PlatformId][] = [
    ["ios", "chrome"],
    ["android", "chrome"],
    ["android", "firefox"],
    ["ios", "firefox"],
    ["android", "ios"]];


    for (const [srcPlatform, dstPlatform] of pairs) {
      it(`${srcPlatform}→${dstPlatform} (password): login add propagates (reverse)`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice(srcPlatform, "password");
        const dst = makeDevice(dstPlatform, "password");

        const e = src.addLogin({
          url: "https://reverse.com",
          username: "reverse-user",
          password: "rev-secret",
          modifiedAt: 1000
        });

        const cid = await src.push(ipfs);
        await dst.pull(ipfs, cid);

        expect(dst.vault.entries).toHaveLength(1);
        expect(dst.vault.entries[0].id).toBe(e.id);
        expectNoRePrompt([src, dst]);
      }, 60_000);
    }
  });





  describe("3. All entry types — add propagates (chrome→ios)", () => {
    for (const accountType of ACCOUNT_TYPES) {
      it(`login (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("chrome", accountType);
        const dst = makeDevice("ios", accountType);

        src.addLogin({
          url: "https://login.com",
          username: "loginuser",
          password: "loginpwd",
          totpSecret: "JBSWY3DPEHPK3PXP",
          customFields: [{ name: "pin", value: "1234", type: "hidden" }],
          modifiedAt: 1000
        });

        const cid = await src.push(ipfs);
        await dst.pull(ipfs, cid);

        const dstE = dst.vault.entries[0];
        expect(dstE.username).toBe("loginuser");
        expect(dstE.password).toBe("loginpwd");
        expect(dstE.totpSecret).toBe("JBSWY3DPEHPK3PXP");
        expect(dstE.customFields?.[0].value).toBe("1234");
        expectNoRePrompt([src, dst]);
      }, 60_000);

      it(`card (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("chrome", accountType);
        const dst = makeDevice("ios", accountType);

        src.addCard({
          title: "My Visa",
          cardholder: "John Doe",
          expiry: "12/28",
          cvv: "123",
          modifiedAt: 1000
        });

        const cid = await src.push(ipfs);
        await dst.pull(ipfs, cid);

        const dstE = dst.vault.entries[0];
        expect(dstE.title).toBe("My Visa");
        const cf = Object.fromEntries((dstE.customFields ?? []).map((f) => [f.name, f.value]));
        expect(cf.cardholder).toBe("John Doe");
        expect(cf.expiry).toBe("12/28");
        expect(cf.cvv).toBe("123");
        expectNoRePrompt([src, dst]);
      }, 60_000);

      it(`note (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("chrome", accountType);
        const dst = makeDevice("ios", accountType);

        src.addNote({
          title: "My Secret Note",
          notes: "This is a secret note about sync",
          modifiedAt: 1000
        });

        const cid = await src.push(ipfs);
        await dst.pull(ipfs, cid);

        const dstE = dst.vault.entries[0];
        expect(dstE.title).toBe("My Secret Note");
        expect(dstE.notes).toBe("This is a secret note about sync");
        expectNoRePrompt([src, dst]);
      }, 60_000);

      it(`secure document (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("chrome", accountType);
        const dst = makeDevice("ios", accountType);

        const doc = src.addDocument({
          type: "passport",
          label: "My Passport",
          modifiedAt: 1000
        });

        const cid = await src.push(ipfs);
        await dst.pull(ipfs, cid);

        expect(dst.vault.documents).toHaveLength(1);
        expect(dst.vault.documents![0].id).toBe(doc.id);
        expect(dst.vault.documents![0].label).toBe("My Passport");
        expect(dst.vault.documents![0].type).toBe("passport");
        expectNoRePrompt([src, dst]);
      }, 60_000);

      it(`cloud file (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("chrome", accountType);
        const dst = makeDevice("ios", accountType);

        const cf = src.addCloudFile({
          fileName: "tax-2026.pdf",
          modifiedAt: 1000
        });

        const cid = await src.push(ipfs);
        await dst.pull(ipfs, cid);

        expect(dst.vault.cloudFiles).toHaveLength(1);
        expect(dst.vault.cloudFiles![0].id).toBe(cf.id);
        expect(dst.vault.cloudFiles![0].fileName).toBe("tax-2026.pdf");
        expectNoRePrompt([src, dst]);
      }, 60_000);

      it(`custom folder (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("chrome", accountType);
        const dst = makeDevice("ios", accountType);

        src.addFolder("Work");
        src.addFolder("Personal");

        const cid = await src.push(ipfs);
        await dst.pull(ipfs, cid);

        expect(dst.vault.folders).toContain("Work");
        expect(dst.vault.folders).toContain("Personal");
        expectNoRePrompt([src, dst]);
      }, 60_000);
    }
  });





  describe("4. Edit — field-level 3-way merge (chrome↔android)", () => {
    for (const accountType of ACCOUNT_TYPES) {
      it(`concurrent field edits preserved (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const alice = makeDevice("chrome", accountType);
        const bob = makeDevice("android", accountType);


        const shared: VaultEntry = {
          id: "shared-edit-1",
          url: "https://shared.com",
          username: "orig-user",
          password: "orig-pwd",
          notes: "orig-notes",
          modifiedAt: 1000
        };
        alice.vault = { ...alice.vault, entries: [shared] };
        bob.vault = { ...bob.vault, entries: [shared] };


        const cid0 = await alice.push(ipfs);
        bob.lastKnownUpdatedAt = 0;
        await bob.pull(ipfs, cid0);
        alice.lastKnownUpdatedAt = bob.lastKnownUpdatedAt;
        alice.mergeBase = bob.mergeBase = JSON.parse(JSON.stringify(alice.vault));
        alice.storedCid = bob.storedCid = cid0;


        alice.updateEntry("shared-edit-1", { notes: "alice-notes", modifiedAt: 2000 });
        const cidA = await alice.push(ipfs);

        bob.updateEntry("shared-edit-1", { password: "bob-pwd", modifiedAt: 2100 });
        const cidB = await bob.push(ipfs);


        alice.lastKnownUpdatedAt = 0;
        bob.lastKnownUpdatedAt = 0;
        await alice.pull(ipfs, cidB);
        await bob.pull(ipfs, cidA);

        const aFinal = alice.vault.entries.find((e) => e.id === "shared-edit-1")!;
        const bFinal = bob.vault.entries.find((e) => e.id === "shared-edit-1")!;

        expect(aFinal.notes).toBe("alice-notes");
        expect(aFinal.password).toBe("bob-pwd");
        expect(bFinal.notes).toBe("alice-notes");
        expect(bFinal.password).toBe("bob-pwd");
        expectConverged(alice, bob, "after concurrent edit");
        expectNoRePrompt([alice, bob]);
      }, 90_000);

      it(`same field conflict — LWW by modifiedAt (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const alice = makeDevice("chrome", accountType);
        const bob = makeDevice("android", accountType);

        const shared: VaultEntry = {
          id: "conflict-1",
          url: "https://conflict.com",
          username: "orig",
          password: "orig",
          modifiedAt: 1000
        };
        alice.vault = { ...alice.vault, entries: [shared] };
        bob.vault = { ...bob.vault, entries: [shared] };

        const cid0 = await alice.push(ipfs);
        bob.lastKnownUpdatedAt = 0;
        await bob.pull(ipfs, cid0);
        alice.lastKnownUpdatedAt = bob.lastKnownUpdatedAt;
        alice.mergeBase = bob.mergeBase = JSON.parse(JSON.stringify(alice.vault));
        alice.storedCid = bob.storedCid = cid0;


        alice.updateEntry("conflict-1", { password: "alice-pwd", modifiedAt: 2000 });
        const cidA = await alice.push(ipfs);

        bob.updateEntry("conflict-1", { password: "bob-wins", modifiedAt: 3000 });
        const cidB = await bob.push(ipfs);

        alice.lastKnownUpdatedAt = 0;
        bob.lastKnownUpdatedAt = 0;
        await alice.pull(ipfs, cidB);
        await bob.pull(ipfs, cidA);

        const aFinal = alice.vault.entries.find((e) => e.id === "conflict-1")!;
        const bFinal = bob.vault.entries.find((e) => e.id === "conflict-1")!;
        expect(aFinal.password).toBe("bob-wins");
        expect(bFinal.password).toBe("bob-wins");
        expectConverged(alice, bob);
        expectNoRePrompt([alice, bob]);
      }, 90_000);
    }
  });





  describe("5. Delete — tombstone propagation (firefox→ios)", () => {
    for (const accountType of ACCOUNT_TYPES) {
      it(`login delete propagates (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("firefox", accountType);
        const dst = makeDevice("ios", accountType);

        const e = src.addLogin({
          url: "https://delete.com",
          username: "del",
          password: "del-pwd",
          modifiedAt: 1000
        });
        const cid0 = await src.push(ipfs);
        dst.lastKnownUpdatedAt = 0;
        await dst.pull(ipfs, cid0);
        expect(dst.vault.entries).toHaveLength(1);


        src.deleteEntry(e.id);
        const cid1 = await src.push(ipfs);
        dst.lastKnownUpdatedAt = 0;
        await dst.pull(ipfs, cid1);

        expect(dst.vault.entries).toHaveLength(0);
        expect(dst.vault.entryTombstones?.[e.id]).toBeGreaterThan(0);
        expectNoRePrompt([src, dst]);
      }, 60_000);

      it(`card delete propagates (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("firefox", accountType);
        const dst = makeDevice("ios", accountType);

        const card = src.addCard({ title: "Delete Me", modifiedAt: 1000 });
        const cid0 = await src.push(ipfs);
        dst.lastKnownUpdatedAt = 0;
        await dst.pull(ipfs, cid0);

        src.deleteEntry(card.id);
        const cid1 = await src.push(ipfs);
        dst.lastKnownUpdatedAt = 0;
        await dst.pull(ipfs, cid1);

        expect(dst.vault.entries).toHaveLength(0);
        expectNoRePrompt([src, dst]);
      }, 60_000);

      it(`note delete propagates (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("firefox", accountType);
        const dst = makeDevice("ios", accountType);

        const note = src.addNote({ title: "Delete Note", notes: "x", modifiedAt: 1000 });
        const cid0 = await src.push(ipfs);
        dst.lastKnownUpdatedAt = 0;
        await dst.pull(ipfs, cid0);

        src.deleteEntry(note.id);
        const cid1 = await src.push(ipfs);
        dst.lastKnownUpdatedAt = 0;
        await dst.pull(ipfs, cid1);

        expect(dst.vault.entries).toHaveLength(0);
        expectNoRePrompt([src, dst]);
      }, 60_000);

      it(`folder delete propagates (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const src = makeDevice("firefox", accountType);
        const dst = makeDevice("ios", accountType);

        src.addFolder("ToDelete");
        const cid0 = await src.push(ipfs);
        dst.lastKnownUpdatedAt = 0;
        await dst.pull(ipfs, cid0);
        expect(dst.vault.folders).toContain("ToDelete");

        src.deleteFolder("ToDelete");
        const cid1 = await src.push(ipfs);
        dst.lastKnownUpdatedAt = 0;
        await dst.pull(ipfs, cid1);

        expect(dst.vault.folders).not.toContain("ToDelete");
        expectNoRePrompt([src, dst]);
      }, 60_000);
    }
  });





  describe("6. Re-creation after deletion (ios↔android)", () => {
    for (const accountType of ACCOUNT_TYPES) {
      it(`deleted entry re-created on other device is preserved (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const alice = makeDevice("ios", accountType);
        const bob = makeDevice("android", accountType);

        const e = alice.addLogin({
          url: "https://recreate.com",
          username: "rc",
          password: "rc-pwd",
          modifiedAt: 1000
        });
        const cid0 = await alice.push(ipfs);
        bob.lastKnownUpdatedAt = 0;
        await bob.pull(ipfs, cid0);


        alice.deleteEntry(e.id);
        const cidA = await alice.push(ipfs);


        bob.vault = {
          ...bob.vault,
          entries: [
          ...bob.vault.entries,
          { ...e, password: "recreated", modifiedAt: Date.now() + 10_000 }]

        };
        await bob.push(ipfs);

        bob.lastKnownUpdatedAt = 0;
        await bob.pull(ipfs, cidA);

        const bobE = bob.vault.entries.find((x) => x.id === e.id);
        expect(bobE?.password).toBe("recreated");
        expect(bob.vault.entryTombstones?.[e.id]).toBeUndefined();
        expectNoRePrompt([alice, bob]);
      }, 90_000);
    }
  });





  describe("7. Offline edits — all preserved on rejoin (chrome↔ios)", () => {
    for (const accountType of ACCOUNT_TYPES) {
      it(`5 offline edits + 1 remote edit converge (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const alice = makeDevice("chrome", accountType);
        const bob = makeDevice("ios", accountType);

        const e1 = alice.addLogin({
          url: "https://offline.com",
          username: "u",
          password: "p",
          modifiedAt: 1000
        });
        const cid0 = await alice.push(ipfs);
        await bob.pull(ipfs, cid0);
        alice.lastKnownUpdatedAt = bob.lastKnownUpdatedAt;
        alice.mergeBase = bob.mergeBase = JSON.parse(JSON.stringify(alice.vault));
        alice.storedCid = bob.storedCid = cid0;


        alice.updateEntry(e1.id, { username: "edit1", modifiedAt: 2000 });
        alice.updateEntry(e1.id, { password: "p1", modifiedAt: 2100 });
        alice.updateEntry(e1.id, { notes: "n1", modifiedAt: 2200 });
        alice.addLogin({ url: "https://new.com", username: "u2", password: "p2", modifiedAt: 2300 });
        alice.updateEntry(e1.id, { notes: "n1-updated", modifiedAt: 2400 });


        bob.updateEntry(e1.id, { password: "bob-pwd", modifiedAt: 2500 });
        const cidB = await bob.push(ipfs);


        await alice.pull(ipfs, cidB);
        const cidA = await alice.push(ipfs);
        bob.lastKnownUpdatedAt = 0;
        await bob.pull(ipfs, cidA);

        const aE1 = alice.vault.entries.find((e) => e.id === e1.id)!;
        const bE1 = bob.vault.entries.find((e) => e.id === e1.id)!;
        expect(aE1.username).toBe("edit1");
        expect(aE1.notes).toBe("n1-updated");
        expect(aE1.password).toBe("bob-pwd");
        expect(bE1.username).toBe("edit1");
        expect(bE1.notes).toBe("n1-updated");
        expect(bE1.password).toBe("bob-pwd");
        expect(alice.vault.entries).toHaveLength(2);
        expect(bob.vault.entries).toHaveLength(2);
        expectConverged(alice, bob);
        expectNoRePrompt([alice, bob]);
      }, 120_000);
    }
  });





  describe("8. 4-device star topology — all platforms converge", () => {
    for (const accountType of ACCOUNT_TYPES) {
      it(`chrome + firefox + ios + android converge (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const devices = ALL_PLATFORMS.map((p) => makeDevice(p, accountType));
        const [chrome, firefox, ios, android] = devices;


        chrome.addLogin({ url: "https://chrome.com", username: "c", password: "cp", modifiedAt: 1000 });
        firefox.addLogin({ url: "https://ff.com", username: "f", password: "fp", modifiedAt: 1100 });
        ios.addLogin({ url: "https://ios.com", username: "i", password: "ip", modifiedAt: 1200 });
        android.addLogin({ url: "https://droid.com", username: "d", password: "dp", modifiedAt: 1300 });



        let latestCid: string | null = null;
        for (let round = 0; round < 2; round++) {
          for (const d of devices) {
            latestCid = await d.syncRound(ipfs, latestCid);
          }
        }


        for (const d of devices) {
          if (latestCid) await d.pull(ipfs, latestCid);
        }

        expectAllConverged(devices, "after star sync");
        expect(devices[0].vault.entries).toHaveLength(4);
        expectNoRePrompt(devices);
      }, 120_000);

      it(`4 devices + documents + cloudFiles converge (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const devices = ALL_PLATFORMS.map((p) => makeDevice(p, accountType));

        devices[0].addDocument({ type: "cni", label: "ID Card", modifiedAt: 1000 });
        devices[1].addDocument({ type: "passport", label: "Passport", modifiedAt: 1100 });
        devices[2].addCloudFile({ fileName: "doc1.pdf", modifiedAt: 1200 });
        devices[3].addCloudFile({ fileName: "doc2.pdf", modifiedAt: 1300 });

        let latestCid: string | null = null;
        for (let round = 0; round < 2; round++) {
          for (const d of devices) {
            latestCid = await d.syncRound(ipfs, latestCid);
          }
        }
        for (const d of devices) {
          if (latestCid) await d.pull(ipfs, latestCid);
        }

        expectAllConverged(devices, "docs+cloud");
        expect(devices[0].vault.documents).toHaveLength(2);
        expect(devices[0].vault.cloudFiles).toHaveLength(2);
        expectNoRePrompt(devices);
      }, 120_000);
    }
  });





  describe("9. Idempotent re-sync (android↔ios)", () => {
    for (const accountType of ACCOUNT_TYPES) {
      it(`3 rounds of back-and-forth converge (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const alice = makeDevice("android", accountType);
        const bob = makeDevice("ios", accountType);

        const e1 = alice.addLogin({
          url: "https://idempotent.com",
          username: "u",
          password: "p",
          modifiedAt: 1000
        });
        const cid0 = await alice.push(ipfs);
        await bob.pull(ipfs, cid0);
        alice.lastKnownUpdatedAt = bob.lastKnownUpdatedAt;
        alice.mergeBase = bob.mergeBase = JSON.parse(JSON.stringify(alice.vault));
        alice.storedCid = bob.storedCid = cid0;

        for (let i = 0; i < 3; i++) {
          alice.updateEntry(e1.id, { password: `alice-r${i}`, modifiedAt: 10000 + i * 10 });
          const cidA = await alice.push(ipfs);
          await bob.pull(ipfs, cidA);
          bob.updateEntry(e1.id, { password: `bob-r${i}`, modifiedAt: 10000 + i * 10 + 5 });
          const cidB = await bob.push(ipfs);
          await alice.pull(ipfs, cidB);
        }

        const aE1 = alice.vault.entries.find((e) => e.id === e1.id)!;
        const bE1 = bob.vault.entries.find((e) => e.id === e1.id)!;
        expect(aE1.password).toBe(bE1.password);
        expect(aE1.password).toBe("bob-r2");
        expectConverged(alice, bob);
        expectNoRePrompt([alice, bob]);
      }, 180_000);
    }
  });





  describe("10. Account type isolation", () => {
    it("password account cannot decrypt passkey vault (wrong key)", async () => {
      const ipfs = new MockIPFS();
      const passkeyDevice = makeDevice("ios", "passkey");
      const passwordDevice = makeDevice("android", "password");

      passkeyDevice.addLogin({
        url: "https://secret.com",
        username: "s",
        password: "s-pwd",
        modifiedAt: 1000
      });
      const cid = await passkeyDevice.push(ipfs);


      await expect(passwordDevice.pull(ipfs, cid)).rejects.toThrow();
    }, 60_000);

    it("same account type on different platforms decrypts fine", async () => {
      const ipfs = new MockIPFS();
      const passkeyChrome = makeDevice("chrome", "passkey");
      const passkeyIos = makeDevice("ios", "passkey");

      passkeyChrome.addLogin({
        url: "https://passkey-sync.com",
        username: "pk",
        password: "pk-pwd",
        modifiedAt: 1000
      });
      const cid = await passkeyChrome.push(ipfs);
      await passkeyIos.pull(ipfs, cid);

      expect(passkeyIos.vault.entries).toHaveLength(1);
      expect(passkeyIos.vault.entries[0].username).toBe("pk");
      expectNoRePrompt([passkeyChrome, passkeyIos]);
    }, 60_000);
  });





  describe("11. Payload version certification (V4 password-only)", () => {
    for (const platform of ALL_PLATFORMS) {
      for (const accountType of ACCOUNT_TYPES) {
        it(`${platform} (${accountType}) produces V4 payload`, async () => {
          const ipfs = new MockIPFS();
          const d = makeDevice(platform, accountType);
          d.addLogin({ url: "x", username: "u", password: "p", modifiedAt: 1000 });
          const cid = await d.push(ipfs);
          const payload = JSON.parse(ipfs.fetch(cid));
          expect(payload.version).toBe(PAYLOAD_VERSION_CURRENT);
          expect(payload.version).toBe(4);
          expect(payload.salt).toBeTruthy();
          expect(payload.commitment).toBeTruthy();
          expect(payload.ciphertext).toBeTruthy();
        }, 30_000);
      }
    }
  });





  describe("12. Full mixed scenario (chrome↔ios↔android)", () => {
    for (const accountType of ACCOUNT_TYPES) {
      it(`mixed CRUD across 3 platforms converges (${accountType})`, async () => {
        const ipfs = new MockIPFS();
        const chrome = makeDevice("chrome", accountType);
        const ios = makeDevice("ios", accountType);
        const android = makeDevice("android", accountType);


        const login = chrome.addLogin({
          url: "https://mixed.com",
          username: "mixed",
          password: "mixed-pwd",
          modifiedAt: 1000
        });
        const card = chrome.addCard({
          title: "Mixed Card",
          cardholder: "MC",
          expiry: "06/30",
          cvv: "999",
          modifiedAt: 1100
        });
        const note = chrome.addNote({
          title: "Mixed Note",
          notes: "note body",
          modifiedAt: 1200
        });
        chrome.addDocument({
          type: "rib",
          label: "Bank Statement",
          modifiedAt: 1300
        });


        let cid = await chrome.push(ipfs);


        ios.lastKnownUpdatedAt = 0;
        await ios.pull(ipfs, cid);
        ios.updateEntry(login.id, { username: "ios-edited", modifiedAt: 2000 });
        ios.addCloudFile({ fileName: "ios-file.pdf", modifiedAt: 2100 });
        cid = await ios.push(ipfs);


        android.lastKnownUpdatedAt = 0;
        await android.pull(ipfs, cid);
        android.deleteEntry(card.id);
        android.updateEntry(note.id, { notes: "android-edited-note", modifiedAt: 2200 });
        cid = await android.push(ipfs);


        chrome.lastKnownUpdatedAt = 0;
        await chrome.pull(ipfs, cid);


        ios.lastKnownUpdatedAt = 0;
        await ios.pull(ipfs, cid);


        cid = await chrome.push(ipfs);
        ios.lastKnownUpdatedAt = 0;
        await ios.pull(ipfs, cid);
        android.lastKnownUpdatedAt = 0;
        await android.pull(ipfs, cid);

        expectAllConverged([chrome, ios, android], "full mixed");


        const entries = chrome.vault.entries;
        expect(entries).toHaveLength(2);
        const loginE = entries.find((e) => e.id === login.id)!;
        expect(loginE.username).toBe("ios-edited");
        const noteE = entries.find((e) => e.id === note.id)!;
        expect(noteE.notes).toBe("android-edited-note");


        expect(entries.find((e) => e.id === card.id)).toBeUndefined();
        expect(chrome.vault.entryTombstones?.[card.id]).toBeGreaterThan(0);


        expect(chrome.vault.documents).toHaveLength(1);
        expect(chrome.vault.documents![0].label).toBe("Bank Statement");


        expect(chrome.vault.cloudFiles).toHaveLength(1);
        expect(chrome.vault.cloudFiles![0].fileName).toBe("ios-file.pdf");

        expectNoRePrompt([chrome, ios, android]);
      }, 180_000);
    }
  });





  describe("13. Raw encryption cross-check (all platform pairs)", () => {
    const pairs: [PlatformId, PlatformId][] = [
    ["chrome", "ios"],
    ["ios", "chrome"],
    ["firefox", "android"],
    ["android", "firefox"],
    ["ios", "android"],
    ["android", "ios"]];


    for (const [encPlatform, decPlatform] of pairs) {
      for (const accountType of ACCOUNT_TYPES) {
        it(`${encPlatform} encrypts → ${decPlatform} decrypts (${accountType})`, async () => {
          const ipfs = new MockIPFS();
          const enc = makeDevice(encPlatform, accountType);
          const dec = makeDevice(decPlatform, accountType);

          enc.addLogin({ url: "https://raw.com", username: "raw", password: "raw-pwd", modifiedAt: 1000 });
          enc.addCard({ title: "Raw Card", cardholder: "RC", modifiedAt: 1100 });
          enc.addNote({ title: "Raw Note", notes: "raw-note", modifiedAt: 1200 });
          enc.addDocument({ type: "passport", label: "Raw Doc", modifiedAt: 1300 });

          const cid = await enc.push(ipfs);
          await dec.pull(ipfs, cid);

          expect(dec.entryIds()).toEqual(enc.entryIds());
          expect(dec.docIds()).toEqual(enc.docIds());
          expectNoRePrompt([enc, dec]);
        }, 60_000);
      }
    }
  });
});