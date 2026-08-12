

























export const PAYLOAD_VERSION_V1 = 1;
export const PAYLOAD_VERSION_V2 = 2;
export const PAYLOAD_VERSION_V3 = 3;

export const PAYLOAD_VERSION_V4 = 4;
export const PAYLOAD_VERSION_CURRENT = PAYLOAD_VERSION_V4;


export const MOBILE_MIN_PAYLOAD_VERSION = PAYLOAD_VERSION_V3;

export const MOBILE_MAX_PAYLOAD_VERSION = PAYLOAD_VERSION_V4;


export const EXTENSION_MIN_PAYLOAD_VERSION = PAYLOAD_VERSION_V2;

export const EXTENSION_MAX_PAYLOAD_VERSION = PAYLOAD_VERSION_V4;





export type PayloadVersion =
typeof PAYLOAD_VERSION_V1 |
typeof PAYLOAD_VERSION_V2 |
typeof PAYLOAD_VERSION_V3 |
typeof PAYLOAD_VERSION_V4;






export function isCurrentPayloadVersion(version: number): boolean {
  return version === PAYLOAD_VERSION_CURRENT;
}







export function isAcceptablePayloadVersion(
version: number,
platform: "mobile" | "extension")
: boolean {
  if (platform === "mobile") {
    return version >= MOBILE_MIN_PAYLOAD_VERSION && version <= MOBILE_MAX_PAYLOAD_VERSION;
  }
  return (
    version >= EXTENSION_MIN_PAYLOAD_VERSION && version <= EXTENSION_MAX_PAYLOAD_VERSION);

}