import { initializeApp, getApps } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyALZ8QGEqo7E8pNkttHZhoz5Ns24jP4ris",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "expalapp-a6422.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "expalapp-a6422",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:666367961302:web:1dcd5d077c8782ba934177",
};

export function isGoogleAuthConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

export function getFirebaseAuth() {
  if (!isGoogleAuthConfigured()) return null;
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
  return { auth, googleProvider };
}

export function formatGoogleSignInError(err: unknown): string {
  const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
  const message =
    typeof err === "object" && err && "message" in err
      ? String((err as { message?: string }).message)
      : String(err || "");

  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "";
  }
  if (code === "auth/popup-blocked") {
    return "Popup blocked. Allow popups for this site and try again.";
  }
  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized in Firebase. Add it under Authentication → Settings → Authorized domains.";
  }
  if (/network|unavailable/i.test(`${code} ${message}`)) {
    return "Network error during Google sign-in. Check your connection and try again.";
  }
  return message || "Google sign-in failed.";
}
