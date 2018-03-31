declare module 'aes256' {
  export function encrypt(secret: string, str: string): string;
  export function decrypt(secret: string, str: string): string;
}