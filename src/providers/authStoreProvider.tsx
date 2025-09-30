"use client";

import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import {
  userAtom,
  isLoggedInAtom,
  isLoadingAuthAtom,
  loginErrorAtom,
  profileAtom,
  loginWithEmailAtom,
  loginWithGoogleAtom,
  createUserAtom,
  logoutAtom,
  getUserProfileAtom,
  updateUserProfileAtom,
  defaultUser,
  defaultProfile,
} from "@/stores/authStore";

export function useAuthInit() {
  const [, setUser] = useAtom(userAtom);
  const [, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [, setIsLoadingAuth] = useAtom(isLoadingAuthAtom);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsLoadingAuth(true);

    const unsubscribe = onAuthStateChanged(async (authUser: any) => {
      if (authUser && authUser.email) {
        const token = await authUser.getIdToken();
        setUser({
          email: authUser.email || "",
          displayName: authUser.displayName || "",
          uid: authUser.uid,
          accessToken: token || "",
        });
        setIsLoggedIn(true);
      } else {
        setUser(defaultUser);
        setIsLoggedIn(false);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsLoggedIn, setIsLoadingAuth]);
}

export function useAuth() {
  const [user] = useAtom(userAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoadingAuth] = useAtom(isLoadingAuthAtom);
  const [loginError] = useAtom(loginErrorAtom);
  const [profile] = useAtom(profileAtom);

  const loginWithEmail = useSetAtom(loginWithEmailAtom);
  const loginWithGoogle = useSetAtom(loginWithGoogleAtom);
  const createUserAction = useSetAtom(createUserAtom);
  const logout = useSetAtom(logoutAtom);
  const getUserProfile = useSetAtom(getUserProfileAtom);
  const updateUserProfile = useSetAtom(updateUserProfileAtom);

  return {
    user,
    isLoggedIn,
    isLoadingAuth,
    loginError,
    profile,
    loginWithEmail: (email: string, password: string) =>
      loginWithEmail({ email, password }),
    loginWithGoogle: () => loginWithGoogle(),
    createUser: (
      email: string,
      password: string,
      username: string,
      dateOfBirth: string,
      pronouns: string
    ) => createUserAction({ email, password, username, dateOfBirth, pronouns }),
    logout: () => logout(),
    getUserProfile: () => getUserProfile(),
    updateUserProfile: (userInfo: any) => updateUserProfile(userInfo),
  };
}
