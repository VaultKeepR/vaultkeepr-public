import { generateBlurredThumbnailCanvas } from "@vault-keeper/core";






export async function generateCloudThumbnail(
imageBase64: string,
targetWidth: number = 64)
: Promise<string> {

  return generateBlurredThumbnailCanvas(imageBase64, targetWidth);
}




export function shouldHaveThumbnail(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}