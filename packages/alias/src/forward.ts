




import { appendFileSync } from "fs";
import { simpleParser } from "mailparser";
import * as openpgp from "openpgp";
import nodemailer from "nodemailer";
import { lookupRecipient } from "./db.js";
import { getDomain } from "./config.js";

const DEBUG = process.env.VAULTKEEPER_FORWARD_DEBUG === "1";
const LOG = "/tmp/vaultkeeper-forward.log";
const ERR_LOG = "/tmp/vaultkeeper-forward-err.log";

function errLog(msg: string): void {
  try {
    appendFileSync(ERR_LOG, `[${new Date().toISOString()}] ${msg}\n`);
  } catch {}
}

function log(msg: string): void {
  if (!DEBUG) return;
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try {
    appendFileSync(LOG, line);
  } catch {}
}

async function main(): Promise<void> {
  errLog("main started");
  const rawBuffer = await readStdinBuffer();
  if (!rawBuffer || rawBuffer.length === 0) {
    errLog("stdin vide");
    log("exit: stdin vide");
    console.error("[vaultkeeper-forward] stdin vide");
    process.exit(1);
  }
  log(`reçu ${rawBuffer.length} octets`);

  const domain = getDomain();
  const raw = rawBuffer.toString("utf-8");
  const parsed = await simpleParser(rawBuffer);
  const envelopeRecipient = process.argv[2];
  let toHeader: string | undefined = envelopeRecipient;

  if (!toHeader || !toHeader.includes("@")) {
    const toObj = Array.isArray(parsed.to) ? parsed.to[0] : parsed.to;
    toHeader = (toObj as {value?: {address?: string;}[];})?.value?.[0]?.address;
    if (!toHeader && toObj) {
      const t = toObj as {address?: string;text?: string;};
      toHeader = t.address || t.text;
    }
    if (!toHeader && parsed.to) {
      toHeader = (parsed.to as {text?: string;}).text;
    }
  }

  if (!toHeader) {
    errLog("pas de To header ni enveloppe");
    log("exit: pas de To header");
    console.error("[vaultkeeper-forward] pas de To header ni enveloppe", JSON.stringify(parsed.to));
    process.exit(1);
  }
  log(`To: ${toHeader}, domain attendu: ${domain}`);

  const [localPart, addrDomain] = toHeader.split("@");
  if (!localPart || addrDomain?.toLowerCase() !== domain) {
    errLog(`domaine mismatch localPart=${localPart} addrDomain=${addrDomain} domain=${domain}`);
    log(`exit: domaine mismatch localPart=${localPart} addrDomain=${addrDomain}`);
    console.error(`[vaultkeeper-forward] domaine mismatch localPart=${localPart} addrDomain=${addrDomain} domain=${domain}`);
    process.exit(1);
  }

  const recipient = await lookupRecipient(localPart);
  if (!recipient) {
    errLog(`alias inconnu: ${localPart}`);
    log(`exit: lookupRecipient null pour ${localPart}`);
    console.error(`[vaultkeeper-forward] alias inconnu: ${localPart}`);
    process.exit(1);
  }
  log(`forward vers ${recipient.real_destination}`);

  const smtpHost = (process.env.SMTP_HOST || "127.0.0.1").trim();
  const smtpLower = smtpHost.toLowerCase();
  const isLoopback =
  smtpLower === "127.0.0.1" ||
  smtpLower === "localhost" ||
  smtpLower === "::1" ||
  smtpLower === "[::1]";

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || "25", 10),
    secure: false,
    ignoreTLS: isLoopback,
    tls: {
      rejectUnauthorized: isLoopback ? false : true
    }
  });

  const fromStr = parsed.from?.text || "Expéditeur Inconnu";
  const replyToAddr = parsed.from?.value?.[0]?.address || `no-reply@${domain}`;
  const subjectStr = parsed.subject ? `[Fwd] ${parsed.subject}` : `[VaultKeepR] Nouveau message`;

  if (recipient.public_key_armored) {
    const publicKey = await openpgp.readKey({
      armoredKey: recipient.public_key_armored
    });
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: raw }),
      encryptionKeys: publicKey
    });
    await transporter.sendMail({
      from: `VaultKeepR <no-reply@${domain}>`,
      replyTo: replyToAddr,
      to: recipient.real_destination,
      subject: subjectStr,
      text: `Message chiffré. Déchiffrez avec votre clé privée.\n\n${encrypted}`
    });
  } else {

    await transporter.sendMail({
      from: `VaultKeepR <no-reply@${domain}>`,
      replyTo: replyToAddr,
      to: recipient.real_destination,
      subject: subjectStr,
      text: `--- Transféré par VaultKeepR ---\nExpéditeur : ${fromStr}\nVers l'alias : ${localPart}@${domain}\n--------------------------------\n\n${parsed.text || ""}`,
      html: `
        <div style="background: #f9f9f9; border-bottom: 2px solid #eaeaea; padding: 12px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #444;">
          <strong style="display: flex; align-items: center; margin-bottom: 6px;">
            <img src="https://app.vaultkeepr.xyz/logos/vaultkeepr-shield-og.png" width="16" height="16" style="vertical-align: middle; margin-right: 8px;" alt="VaultKeepR">
            Transféré par VaultKeepR
          </strong>
          <strong>De :</strong> ${fromStr}<br/>
          <strong>Alias :</strong> ${localPart}@${domain}
        </div>
        ${parsed.html ? parsed.html : `<div style="white-space: pre-wrap;">${parsed.text || ""}</div>`}
      `,
      attachments: parsed.attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType
      })) || []
    });
  }
  log("ok envoyé");
}

function readStdinBuffer(): Promise<Buffer> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : "";
  errLog(`erreur: ${msg}\n${stack}`);
  log(`erreur: ${msg}`);
  console.error("[vaultkeeper-forward] erreur:", msg);
  if (stack) console.error(stack);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  try {
    appendFileSync(ERR_LOG, `[${new Date().toISOString()}] uncaughtException: ${err.message}\n${err.stack}\n\n`);
  } catch {}
  process.exit(1);
});