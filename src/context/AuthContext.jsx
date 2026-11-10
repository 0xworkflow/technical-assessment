import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const refresh = async () => {
    const data = await api("/api/auth/me");
    setUser(data.user);
    return data.user;
  };

  useEffect(() => {
    refresh()
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      refresh,
      async register(payload) {
        const data = await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setUser(data.user);
        return data.user;
      },
      async login(payload) {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setUser(data.user);
        return data.user;
      },
      async logout() {
        await api("/api/auth/logout", { method: "POST" });
        setUser(null);
      },
      async updateProfile(payload) {
        const data = await api("/api/profile", {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setUser(data.user);
        return data.user;
      },
      async changePassword(payload) {
        const data = await api("/api/profile/password", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setUser(data.user);
        return data.user;
      },
      async becomeHost() {
        const data = await api("/api/profile/host", { method: "POST" });
        setUser(data.user);
        return data.user;
      },
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
