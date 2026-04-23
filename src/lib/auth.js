import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/env";

// Cookie identifiers for auth and guest sessions
export const AUTH_COOKIE_NAME = "fashion_mart_auth";
export const GUEST_COOKIE_NAME = "fashion_mart_guest";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Generates the JWT secret as a Uint8Array for jose compatibility.
 */
function getJwtSecret() {
  return new TextEncoder().encode(serverEnv.authJwtSecret);
}

/**
 * Returns a standard cookie configuration for auth/session cookies.
 * Sets security flags based on the environment.
 */
function getCookieConfig(maxAge = SESSION_DURATION_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.VERCEL_ENV === "production",
    path: "/",
    maxAge,
  };
}

/**
 * Hashes a plaintext password using bcrypt.
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

/**
 * Verifies a plaintext password against a hashed password.
 */
export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

/**
 * Signs a payload into a JWT token for authentication.
 */
export async function createAuthToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getJwtSecret());
}

/**
 * Verifies and decodes a JWT token.
 */
export async function verifyAuthToken(token) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload;
}

/**
 * Retrieves the current session from request cookies.
 * Returns null if the session is missing or invalid.
 */
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

/**
 * Creates the auth token string for a user object.
 */
export async function createAuthCookieValue(user) {
  return createAuthToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
}

/**
 * Attaches an authentication cookie to the response.
 */
export async function setAuthCookie(response, user) {
  const token = await createAuthCookieValue(user);
  response.cookies.set(AUTH_COOKIE_NAME, token, getCookieConfig());
}

/**
 * Clears the authentication cookie from the response (logout).
 */
export function clearAuthCookie(response) {
  response.cookies.set(AUTH_COOKIE_NAME, "", getCookieConfig(0));
}

/**
 * Retrieves or generates a persistent guest session ID from cookies.
 */
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

/**
 * Attaches a guest session cookie to the response.
 */
export function attachGuestCookie(response, sessionId) {
  response.cookies.set(GUEST_COOKIE_NAME, sessionId, getCookieConfig(60 * 60 * 24 * 30)); // 30 days
}
