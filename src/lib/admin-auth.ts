import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET;

export async function encrypt(payload: any) {
  if (!SECRET_KEY) throw new Error("Missing ADMIN_SESSION_SECRET");
  const key = new TextEncoder().encode(SECRET_KEY);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  if (!SECRET_KEY) throw new Error("Missing ADMIN_SESSION_SECRET");
  const key = new TextEncoder().encode(SECRET_KEY);
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function loginAdmin() {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ role: 'admin', expires });

  const cookieStore = await cookies();
  cookieStore.set('admin_session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  if (!session) return false;
  try {
    const parsed = await decrypt(session);
    return parsed.role === 'admin';
  } catch {
    return false;
  }
}
