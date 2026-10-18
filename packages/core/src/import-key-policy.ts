/**
 * What a device may do with an encrypted export (.vkenc) when it is imported.
 *
 * An export carries the account's secret key only if it was made with one. The import must never
 * change which account a device belongs to, and must never mix a keyless file into a keyed device.
 * Pure decision: the caller applies it, and a refusal changes nothing.
 */
export type EncryptedImportDecision =
  | { action: "import_keyless" }
  | { action: "join_with_file_key" }
  | { action: "keep_device_key" }
  | { action: "refuse"; reason: "keyless_file_on_keyed_device" | "other_account" };

export function decideEncryptedImport(input: {
  deviceKey: string | null;
  fileKey: string | null;
}): EncryptedImportDecision {
  const device = input.deviceKey ? input.deviceKey.toLowerCase() : null;
  const file = input.fileKey ? input.fileKey.toLowerCase() : null;
  if (!device && !file) return { action: "import_keyless" };
  if (!device && file) return { action: "join_with_file_key" };
  if (device && !file) return { action: "refuse", reason: "keyless_file_on_keyed_device" };
  return device === file
    ? { action: "keep_device_key" }
    : { action: "refuse", reason: "other_account" };
}
