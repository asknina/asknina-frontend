import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getIdToken,
  getAuth,
  UserCredential,
  sendPasswordResetEmail
} from "firebase/auth";

import { auth } from "@/lib/firebase/firebase";

export function onAuthStateChanged(cb: any) {
  if (!auth) {
    console.error("Firebase auth not initialized");
    return () => { }; // Return empty unsubscribe function
  }
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Firebase auth not initialized");
  }
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

export async function signOut() {
  if (!auth) {
    throw new Error("Firebase auth not initialized");
  }
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}

export async function createUser(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase auth not initialized");
  }
  return await createUserWithEmailAndPassword(auth, email, password).catch(e => { return e })
}

export async function signInWithEmail(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase auth not initialized");
  }
  return await signInWithEmailAndPassword(auth, email, password).catch(e => { return e })
}

export async function getUser() {
  if (!auth) {
    return null;
  }
  return await auth.currentUser
}

export async function getFirebaseToken() {
  if (!auth) {
    return null;
  }
  return await auth.currentUser?.getIdToken()
}

export async function getFirebaseAuth() {
  if (!auth) {
    return null;
  }
  return auth; // Changed from getAuth() to just return auth
}

export async function sendResetPasswordEmail(email: string) {
  if (!auth) {
    throw new Error("Firebase auth not initialized");
  }
  return await sendPasswordResetEmail(auth, email)
}