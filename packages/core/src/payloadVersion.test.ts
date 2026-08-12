






import { describe, it, expect } from "vitest";
import {
  PAYLOAD_VERSION_V1,
  PAYLOAD_VERSION_V2,
  PAYLOAD_VERSION_V3,
  PAYLOAD_VERSION_V4,
  PAYLOAD_VERSION_CURRENT,
  MOBILE_MIN_PAYLOAD_VERSION,
  MOBILE_MAX_PAYLOAD_VERSION,
  EXTENSION_MIN_PAYLOAD_VERSION,
  EXTENSION_MAX_PAYLOAD_VERSION,
  isCurrentPayloadVersion,
  isAcceptablePayloadVersion } from
"./payloadVersion";

describe("payloadVersion — constants", () => {
  it("declares v1..v4 with sequential numbers", () => {
    expect(PAYLOAD_VERSION_V1).toBe(1);
    expect(PAYLOAD_VERSION_V2).toBe(2);
    expect(PAYLOAD_VERSION_V3).toBe(3);
    expect(PAYLOAD_VERSION_V4).toBe(4);
  });

  it("PAYLOAD_VERSION_CURRENT is v4 (current standard)", () => {
    expect(PAYLOAD_VERSION_CURRENT).toBe(PAYLOAD_VERSION_V4);
    expect(PAYLOAD_VERSION_CURRENT).toBe(4);
  });

  it("mobile range is v3..v4 (no v1/v2 support)", () => {
    expect(MOBILE_MIN_PAYLOAD_VERSION).toBe(3);
    expect(MOBILE_MAX_PAYLOAD_VERSION).toBe(4);
  });

  it("extension range is v2..v4 (still reads v2 backups)", () => {
    expect(EXTENSION_MIN_PAYLOAD_VERSION).toBe(2);
    expect(EXTENSION_MAX_PAYLOAD_VERSION).toBe(4);
  });
});

describe("isCurrentPayloadVersion", () => {
  it("returns true only for v4", () => {
    expect(isCurrentPayloadVersion(PAYLOAD_VERSION_V4)).toBe(true);
    expect(isCurrentPayloadVersion(PAYLOAD_VERSION_V1)).toBe(false);
    expect(isCurrentPayloadVersion(PAYLOAD_VERSION_V2)).toBe(false);
    expect(isCurrentPayloadVersion(PAYLOAD_VERSION_V3)).toBe(false);
    expect(isCurrentPayloadVersion(99)).toBe(false);
    expect(isCurrentPayloadVersion(0)).toBe(false);
  });
});

describe("isAcceptablePayloadVersion", () => {
  it("mobile accepts v3 and v4", () => {
    expect(isAcceptablePayloadVersion(PAYLOAD_VERSION_V3, "mobile")).toBe(true);
    expect(isAcceptablePayloadVersion(PAYLOAD_VERSION_V4, "mobile")).toBe(true);
  });

  it("mobile rejects v1 and v2", () => {
    expect(isAcceptablePayloadVersion(PAYLOAD_VERSION_V1, "mobile")).toBe(false);
    expect(isAcceptablePayloadVersion(PAYLOAD_VERSION_V2, "mobile")).toBe(false);
  });

  it("mobile rejects future versions (>= v5)", () => {
    expect(isAcceptablePayloadVersion(5, "mobile")).toBe(false);
    expect(isAcceptablePayloadVersion(99, "mobile")).toBe(false);
  });

  it("extension accepts v2, v3, v4", () => {
    expect(isAcceptablePayloadVersion(PAYLOAD_VERSION_V2, "extension")).toBe(true);
    expect(isAcceptablePayloadVersion(PAYLOAD_VERSION_V3, "extension")).toBe(true);
    expect(isAcceptablePayloadVersion(PAYLOAD_VERSION_V4, "extension")).toBe(true);
  });

  it("extension rejects v1 and future versions", () => {
    expect(isAcceptablePayloadVersion(PAYLOAD_VERSION_V1, "extension")).toBe(false);
    expect(isAcceptablePayloadVersion(5, "extension")).toBe(false);
  });
});