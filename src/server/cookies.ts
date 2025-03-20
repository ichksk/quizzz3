"use server";
import { cookies } from 'next/headers';

export async function getCookie(name: string): Promise<string | undefined> {
  const cookie = await cookies();
  return cookie.get(name)?.value;
}

export async function setCookie(name: string, value: string, options: { path?: string, maxAge?: number, httpOnly?: boolean, secure?: boolean } = {}) {
  const cookieOptions = {
    path: options.path || '/',
    maxAge: options.maxAge || 60 * 60 * 24 * 7, // default to 1 week
    httpOnly: options.httpOnly !== undefined ? options.httpOnly : true,
    secure: options.secure !== undefined ? options.secure : process.env.NODE_ENV === 'production',
  };

  const cookie = await cookies()
  cookie.set(name, value, cookieOptions);
}
