"use client";
import {
  onAuthStateChanged,
  signInWithGoogle,
  signOut,
} from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const noUser = {
  email: null,
};
export function useAuth() {
  // The initialUser comes from the server via a server component
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [user, setUser] = useState(noUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoadingAuth(true);
    const unsubscribe = onAuthStateChanged((authUser: any) => {
      if (authUser) {
        setUser(authUser);
        setIsLoggedIn(true);
        router.push("/");
      } else {
        setUser(noUser);
        router.push("/login");
        setIsLoggedIn(false);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser: any) => {
      if (user === undefined) return;

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSignOut = () => {
    signOut();
  };

  const handleSignInWithGoogle = () => {
    signInWithGoogle();
  };

  return {
    user,
    isLoggedIn,
    handleSignOut,
    handleSignInWithGoogle,
    isLoadingAuth,
  };
}
