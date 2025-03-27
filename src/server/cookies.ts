"use server";

import crypto from 'crypto';

import { cookies } from 'next/headers';

// 暗号化の設定
const algorithm = 'aes-256-cbc';
const secret = process.env.COOKIE_SECRET!;
// 秘密鍵はsha256でハッシュ化して32バイトに
const key = crypto.createHash('sha256').update(secret).digest();

/**
 * 平文文字列を暗号化
 * @param text 暗号化する文字列
 * @returns ivと暗号文を「iv:encrypted」の形式で返す
 */
function encrypt(text: string): string {
  const iv = crypto.randomBytes(16); // 初期化ベクトル（16バイト）
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // ivも一緒に保存（デコード時に必要）
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * 暗号化された文字列を復号
 * @param encrypted 暗号化された文字列（iv:encrypted形式）
 * @returns 復号後の平文
 */
function decrypt(encrypted: string): string {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts.shift() || '', 'hex');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Cookieからまとめたオブジェクトを取得
 */
export async function getCookieData(): Promise<any | null> {
  const cookieHeader = await cookies();
  const encryptedData = cookieHeader.get(process.env.COOKIE_NAME!)?.value;
  if (!encryptedData) return null;
  try {
    const decryptedData = decrypt(encryptedData);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Cookieの復号に失敗:', error);
    return null;
  }
}

/**
 * オブジェクトをまとめたCookieを設定
 * @param data 保存したいオブジェクト
 * @param options オプション（path, maxAge, httpOnly, secureなど）
 */
export async function setCookieData(
  data: object,
  options: { path?: string; maxAge?: number; httpOnly?: boolean; secure?: boolean } = {}
) {
  const cookieOptions = {
    path: options.path || '/',
    maxAge: options.maxAge || 60 * 60 * 24 * 7, // デフォルト1週間
    httpOnly: options.httpOnly !== undefined ? options.httpOnly : true,
    secure: options.secure !== undefined ? options.secure : process.env.NODE_ENV === 'production',
  };

  // オブジェクトをJSONに変換し暗号化
  const encryptedData = encrypt(JSON.stringify(data));
  const cookieHeader = await cookies();
  cookieHeader.set(process.env.COOKIE_NAME!, encryptedData, cookieOptions);
}


export async function getCookie(name?: string): Promise<string | undefined> {
  const cookie = await getCookieData();
  if (!cookie) return undefined;
  if (!name) return cookie
  return cookie[name];
}

export async function setCookie(name: string, value: string, options: { path?: string, maxAge?: number, httpOnly?: boolean, secure?: boolean } = {}) {
  const cookieOptions = {
    path: options.path || '/',
    maxAge: options.maxAge || 60 * 60 * 24 * 7, // default to 1 week
    httpOnly: options.httpOnly !== undefined ? options.httpOnly : true,
    secure: options.secure !== undefined ? options.secure : process.env.NODE_ENV === 'production',
  };

  await getCookieData().then(cookie => {
    if (!cookie) {
      cookie = {};
    }
    cookie[name] = value;
    setCookieData(cookie, cookieOptions);
  });
}

export async function removeCookie(name: string) {
  await getCookieData().then(cookie => {
    if (!cookie) return;
    delete cookie[name];
    setCookieData(cookie);
  });
}