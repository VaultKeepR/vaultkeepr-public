import { describe, it, expect } from "vitest";
import { importKeePassXml, isKeePassXml } from "./import-keepass-xml";
import { importVaultText } from "./import";

const KP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<KeePassFile>
  <Meta>
    <Generator>KeePass</Generator>
  </Meta>
  <Root>
    <Group>
      <Name>Banking</Name>
      <Entry>
        <UUID>AAAA</UUID>
        <String>
          <Key>Title</Key>
          <Value>GitHub Login</Value>
        </String>
        <String>
          <Key>UserName</Key>
          <Value>alice</Value>
        </String>
        <String>
          <Key>Password</Key>
          <Value Protected="True">super-secret</Value>
        </String>
        <String>
          <Key>URL</Key>
          <Value>https://github.com</Value>
        </String>
        <String>
          <Key>Notes</Key>
          <Value>2FA enabled</Value>
        </String>
        <String>
          <Key>otp</Key>
          <Value>otpauth://totp/GitHub?secret=JBSWY3DPEHPK3PXP&issuer=GitHub</Value>
        </String>
      </Entry>
      <Group>
        <Name>Personal</Name>
        <Entry>
          <String>
            <Key>Title</Key>
            <Value>WiFi</Value>
          </String>
          <String>
            <Key>UserName</Key>
            <Value></Value>
          </String>
          <String>
            <Key>Password</Key>
            <Value Protected="True">wifipass</Value>
          </String>
          <String>
            <Key>Notes</Key>
            <Value>Home network</Value>
          </String>
          <String>
            <Key>SSID</Key>
            <Value>HomeNet</Value>
          </String>
        </Entry>
      </Group>
    </Group>
    <Group>
      <Name>Cards</Name>
      <Entry>
        <String>
          <Key>Title</Key>
          <Value>My Visa</Value>
        </String>
        <String>
          <Key>Card Number</Key>
          <Value Protected="True">4111111111111111</Value>
        </String>
        <String>
          <Key>CVV</Key>
          <Value Protected="True">123</Value>
        </String>
        <String>
          <Key>Holder</Key>
          <Value>John Doe</Value>
        </String>
      </Entry>
    </Group>
  </Root>
</KeePassFile>`;

describe("isKeePassXml", () => {
  it("detects a KeePass XML export", () => {
    expect(isKeePassXml(KP_XML)).toBe(true);
    expect(isKeePassXml('<?xml version="1.0"?>\n<KeePassFile></KeePassFile>')).toBe(true);
  });

  it("rejects non-XML and other formats", () => {
    expect(isKeePassXml("name,url,username")).toBe(false);
    expect(isKeePassXml('{"items":[]}')).toBe(false);
    expect(isKeePassXml("plain text")).toBe(false);
  });
});

describe("importKeePassXml", () => {
  const v = importKeePassXml(KP_XML);

  it("imports all entries", () => {
    expect(v.entries).toHaveLength(3);
  });

  it("maps a login with TOTP from the `otp` key", () => {
    const login = v.entries.find((e) => e.url === "https://github.com")!;
    expect(login.username).toBe("alice");
    expect(login.password).toBe("super-secret");
    expect(login.notes).toBe("2FA enabled");
    expect(login.title).toBe("GitHub Login");
    expect(login.totpSecret).toBe("JBSWY3DPEHPK3PXP");
    expect(login.folder).toBe("identifiants");
    expect(login.customGroup).toBe("Banking");
  });

  it("preserves custom fields (e.g. SSID) on an entry", () => {
    const wifi = v.entries.find((e) => e.title === "WiFi")!;
    expect(wifi.password).toBe("wifipass");
    expect(wifi.notes).toBe("Home network");
    expect(wifi.customFields).toEqual([
    { name: "SSID", value: "HomeNet", type: "text" }]
    );
    expect(wifi.customGroup).toBe("Banking / Personal");
  });

  it("detects a credit card from a long digit custom field", () => {
    const card = v.entries.find((e) => e.folder === "cartes")!;
    expect(card.password).toBe("4111111111111111");
    expect(card.username).toContain("Visa");
    expect(card.username).toContain("1111");
    expect(card.notesMasked).toBe(true);
    expect(card.title).toBe("My Visa");
    expect(card.customGroup).toBe("Cards");

    expect(card.customFields!.find((f) => f.name === "CVV")).toEqual({
      name: "CVV",
      value: "123",
      type: "hidden"
    });
    expect(card.customFields!.find((f) => f.name === "Holder")).toEqual({
      name: "Holder",
      value: "John Doe",
      type: "text"
    });
  });

  it("rejects non-KeePass XML", () => {
    expect(() => importKeePassXml("<html></html>")).toThrow(/KeePassFile/);
  });
});

describe("importVaultText routes KeePass XML", () => {
  it("imports a KeePass XML via the unified importer", async () => {
    const { vault } = await importVaultText(KP_XML);
    expect(vault.entries).toHaveLength(3);
    expect(vault.entries[0].folder).toBe("identifiants");
    expect(vault.entries[0].customGroup).toBe("Banking");
  });
});

describe("importKeePassXml edge cases", () => {
  it("handles a raw base32 TOTP in the `otp` key", () => {
    const xml = `<?xml version="1.0"?>
<KeePassFile><Root><Group><Name>G</Name><Entry>
<String><Key>Title</Key><Value>T</Value></String>
<String><Key>URL</Key><Value>https://t.com</Value></String>
<String><Key>otp</Key><Value>JBSWY3DPEHPK3PXP</Value></String>
</Entry></Group></Root></KeePassFile>`;
    const v = importKeePassXml(xml);
    expect(v.entries[0].totpSecret).toBe("JBSWY3DPEHPK3PXP");
  });

  it("skips empty entries", () => {
    const xml = `<?xml version="1.0"?>
<KeePassFile><Root><Group><Name>G</Name>
<Entry><String><Key>Title</Key><Value></Value></String></Entry>
</Group></Root></KeePassFile>`;
    const v = importKeePassXml(xml);
    expect(v.entries).toHaveLength(0);
  });

  it("preserves hidden custom fields with Protected=True", () => {
    const xml = `<?xml version="1.0"?>
<KeePassFile><Root><Group><Name>G</Name><Entry>
<String><Key>Title</Key><Value>X</Value></String>
<String><Key>URL</Key><Value>https://x.com</Value></String>
<String><Key>Recovery Code</Key><Value Protected="True">rec-hidden</Value></String>
</Entry></Group></Root></KeePassFile>`;
    const v = importKeePassXml(xml);
    expect(v.entries[0].customFields).toEqual([
    { name: "Recovery Code", value: "rec-hidden", type: "hidden" }]
    );
  });
});