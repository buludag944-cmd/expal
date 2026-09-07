"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { signInWithPopup } from "firebase/auth";
import { nextPathAfterAuth, type ExpalUser } from "@/lib/api";
import { formatGoogleSignInError, getFirebaseAuth } from "@/lib/firebase";
import {
  clearSession,
  exchangeGoogleIdToken,
  fetchProfile,
  readStoredToken,
  readStoredUser,
  submitAccountSetup,
  writeSession,
} from "@/lib/session";

type AuthContextValue = {
  user: ExpalUser | null;
  token: string;
  ready: boolean;
  busy: boolean;
  error: string;
  signInWithGoogle: () => Promise<string | null>;
  completeSetup: (payload: Record<string, unknown>) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExpalUser | null>(null);
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = readStoredToken();
    const storedUser = readStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      fetchProfile(storedToken)
        .then((fresh) => {
          setUser(fresh);
          writeSession(storedToken, fresh);
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : "";
          if (/invalid email or password|unauthorized|401/i.test(message)) {
            clearSession();
            setToken("");
            setUser(null);
          }
        })
        .finally(() => setReady(true));
      return;
    }
    setReady(true);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const fb = getFirebaseAuth();
      if (!fb) {
        setError("Google sign-in is not configured.");
        return null;
      }
      const result = await signInWithPopup(fb.auth, fb.googleProvider);
      const idToken = await result.user.getIdToken();
      const session = await exchangeGoogleIdToken(idToken);
      writeSession(session.token, session.user);
      setToken(session.token);
      setUser(session.user);
      return nextPathAfterAuth(session.user);
    } catch (err) {
      const message = formatGoogleSignInError(err);
      if (message) setError(message);
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const completeSetup = useCallback(
    async (payload: Record<string, unknown>) => {
      if (!token) throw new Error("Sign in first");
      setBusy(true);
      setError("");
      try {
        const nextUser = await submitAccountSetup(token, payload);
        setUser(nextUser);
        writeSession(token, nextUser);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not save setup";
        setError(message);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [token],
  );

  const logout = useCallback(() => {
    clearSession();
    setToken("");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, ready, busy, error, signInWithGoogle, completeSetup, logout }),
    [user, token, ready, busy, error, signInWithGoogle, completeSetup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
