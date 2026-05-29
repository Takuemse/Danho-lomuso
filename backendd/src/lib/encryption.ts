// src/lib/encryption.ts
import CryptoJS from "crypto-js";

const KEY = process.env.ENCRYPTION_KEY!;

export function encryptPII(text: string): string {
  return CryptoJS.AES.encrypt(text, KEY).toString();
}

export function decryptPII(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function hashValue(value: string): string {
  return CryptoJS.SHA256(value).toString();
}