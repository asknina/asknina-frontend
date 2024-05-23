import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getIdToken,
  getAuth,
  UserCredential,
} from "firebase/auth";

import { auth } from "@/lib/firebase/firebase";

export function onAuthStateChanged(cb: any) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}

export async function createUser(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password).catch(e => { return e })
}

export async function signInWithEmail(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password).catch(e => { return e })
}

export async function getUser() {
  return await auth.currentUser
}

export async function getFirebaseToken() {
  return await auth.currentUser?.getIdToken()
}

export async function getFirebaseAuth() {
  return await getAuth()
}