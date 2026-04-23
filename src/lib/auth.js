import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/env";

export const AUTH_COOKIE_NAME = "fashion_mart_auth";
export const GUEST_COOKIE_NAME = "fashion_mart_guest";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret() {
  return new TextEncoder().encode(serverEnv.authJwtSecret);
}

function getCookieConfig(maxAge = SESSION_DURATION_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.VERCEL_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export async function createAuthToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload;
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function createAuthCookieValue(user) {
  return createAuthToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
}

export async function setAuthCookie(response, user) {
  const token = await createAuthCookieValue(user);
  response.cookies.set(AUTH_COOKIE_NAME, token, getCookieConfig());
}

export function clearAuthCookie(response) {
  response.cookies.set(AUTH_COOKIE_NAME, "", getCookieConfig(0));
}

export async function getOrCreateGuestSession(request) {
  const existing = request.cookies.get(GUEST_COOKIE_NAME)?.value;

  if (existing) {
    return { sessionId: existing, shouldSetCookie: false };
  }

  return {
    sessionId: crypto.randomUUID(),
    shouldSetCookie: true,
  };
}

export function attachGuestCookie(response, sessionId) {
  response.cookies.set(GUEST_COOKIE_NAME, sessionId, getCookieConfig(60 * 60 * 24 * 30));
}
