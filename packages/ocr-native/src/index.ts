

export interface NativeFrame {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface OcrTextElement {
  text: string;
  frame?: NativeFrame;
}

export interface OcrTextLine {
  text: string;
  frame?: NativeFrame;
  elements: OcrTextElement[];
}

export interface OcrTextBlock {
  text: string;
  frame?: NativeFrame;
  lines: OcrTextLine[];
}

export interface OcrResult {
  text: string;
  blocks: OcrTextBlock[];
}

import { NativeModules } from 'react-native';

import { logger } from "@vault-keeper/logger";
const NativeOcr = NativeModules.OcrNative;


logger.debug('[OcrNative] Module loaded. NativeModules.OcrNative =', NativeOcr ? 'FOUND' : 'NOT FOUND (undefined)');
if (NativeOcr) {
  logger.debug('[OcrNative] Available methods:', Object.keys(NativeOcr));
}








export async function recognizeDocument(
imageUri: string)
: Promise<OcrResult | null> {
  logger.debug('[OcrNative] recognizeDocument called with:', imageUri);
  if (!NativeOcr) {
    logger.warn("[OcrNative] Module not compiled yet — run expo run:android or expo run:ios");
    return null;
  }
  try {
    logger.debug('[OcrNative] Calling native recognizeDocument...');
    const result = await NativeOcr.recognizeDocument(imageUri);
    logger.debug('[OcrNative] Native result:', JSON.stringify(result)?.substring(0, 500));
    return result;
  } catch (e) {
    logger.error('[OcrNative] Native call FAILED:', e);
    return null;
  }
}





export async function readPassportNfc(
mrzKey: string)
: Promise<any> {
  logger.debug('[OcrNative] readPassportNfc called with:', mrzKey);
  if (!NativeOcr || !NativeOcr.readPassportNfc) {
    logger.warn("[OcrNative] Module or method not available");
    return { success: false, status: "NFC_UNSUPPORTED" };
  }
  try {
    const result = await NativeOcr.readPassportNfc(mrzKey);
    return result;
  } catch (e) {
    logger.error('[OcrNative] readPassportNfc FAILED:', e);
    throw e;
  }
}


export function isOcrNativeAvailable(): boolean {
  const available = NativeOcr != null;
  logger.debug('[OcrNative] isOcrNativeAvailable() =', available);
  return available;
}