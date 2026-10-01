// Coverage-round: cloud share payload creation/decrypt roundtrips.
import { describe, it, expect } from "vitest";
import { createSecureShare } from "@vaultkeepr/core";
import {
  buildCloudShareUrl,
  createCloudShare,
  createCloudSharePayload,
  decryptCloudShare
} from "./cloud-sharing";

const FILE = {
  fileName: "doc.pdf",
  mimeType: "application/pdf",
  originalSize: 42,
  contentHash: "",
  fragments: ["frag-1"],
  nonce: "00112233445566778899aabbccddeeff"
} as never;

describe("cloud sharing roundtrips", () => {
  it("creates and decrypts a public share payload", () => {
    const res = createCloudSharePayload(FILE, true, "ab".repeat(32), "0xABC");
    expect(res.pin).toBeUndefined();
    const payload = decryptCloudShare(res.payload, res.shareKey);
    expect(payload.fileName).toBe("doc.pdf");
    expect(payload.contentHash).toBe("");
    expect(payload.type).toBe("cloud_file");
  });

  it("creates a pin-protected share with custom pin and normalizes the owner", async () => {
    const res = await createCloudShare(
      FILE,
      { ttl: "24h", isPublic: false, maxViews: 3, message: "coucou", senderLabel: "Alice" },
      "cd".repeat(32),
      "1234",
      " 0xFF "
    );
    const payload = decryptCloudShare(res.encryptedBlob, res.privateKeyHex, "1234");
    expect(payload.ownerWallet).toBe("0xff");
    expect(payload.message).toBe("coucou");
    expect(payload.senderLabel).toBe("Alice");
  });

  it("rejects foreign payload types on decrypt", () => {
    const s = createSecureShare({ type: "other" } as never, "0000");
    expect(() => decryptCloudShare(s.encryptedBlob, s.privateKeyHex, "0000")).toThrow(
      "INVALID_SHARE_TYPE"
    );
  });

  it("builds the share url", () => {
    expect(buildCloudShareUrl("sid", "abc123")).toBe(
      "https://cloud.vaultkeepr.xyz/s/sid#abc123"
    );
  });
});
