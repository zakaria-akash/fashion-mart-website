"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshSession() {
    try {
      const payload = await requestJson(apiEndpoints.authMe);
      setUser(payload.data?.user ?? null);
      return payload.data?.user ?? null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await requestJson(apiEndpoints.authLogout, {
      method: "POST",
    });
    setUser(null);
  }

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      try {
        const payload = await requestJson(apiEndpoints.authMe);

        if (!ignore) {
          setUser(payload.data?.user ?? null);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
