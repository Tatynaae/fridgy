import { toByteArray } from 'base64-js';

export function getTokenExpiry(accessToken: string): number | undefined {
  const payload = accessToken.split('.')[1];
  if (!payload) return;

  try {
    // The server validates the signature. The client reads exp only to end the local session.
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const { exp } = JSON.parse(String.fromCharCode(...toByteArray(padded)));
    if (typeof exp === 'number' && Number.isFinite(exp)) return exp * 1000;
  } catch {
    return undefined;
  }
}
