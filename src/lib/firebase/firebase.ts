import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase only on client-side
let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== "undefined") {
  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);
}

// Export with null checks
export { firebaseApp, auth, db, storage };

export async function getAuthenticatedAppForUser(session = null) {
  if (typeof window !== "undefined") {
    return { app: firebaseApp, user: auth?.currentUser?.toJSON() };
  }

  const noSessionReturn = { app: null, currentUser: null };

  if (!session) {
    return noSessionReturn;
  }

  // Remove server-side Firebase initialization
  return noSessionReturn;
}

// Remove these server-side functions or make them no-ops
async function getAppRouterSession() {
  return undefined;
}

function initializeAuthenticatedApp(uid: string) {
  // This won't work on Cloudflare Workers anyway
  return null;
}