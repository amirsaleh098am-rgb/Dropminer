import { useState, useEffect } from "react";

const TOKEN_KEY = "auth_token";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(!token);

  useEffect(() => {
    if (!token) {
      autoLogin();
    }
  }, []);

  async function autoLogin() {
    try {
      setIsLoading(true);
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tg_id: 123456789, username: "TestUser" }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      }
    } catch (err) {
      console.error("Auto login failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return { token, isLoading };
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
