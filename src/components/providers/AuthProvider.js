"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages global authentication state, session persistence, and user profiles.
 * Provides hooks for children to access current user data and logout functionality.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Refreshes the session from the backend /me endpoint.
   */
  async function refreshSession() {
    try {
      const payload = await requestJson(apiEndpoints.authMe);
      const nextUser = payload.data?.user ?? null;
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Terminates the current session and clears local user state.
   */
  async function logout() {
    await requestJson(apiEndpoints.authLogout, {
      method: "POST",
    });
    setUser(null);
  }

  // Initial session load on application mount
  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      try {
        const payload = await requestJson(apiEndpoints.authMe);
        if (!ignore) {
          setUser(payload.data?.user ?? null);
        }
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadSession();

    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      refreshSession,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access the authentication context.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
