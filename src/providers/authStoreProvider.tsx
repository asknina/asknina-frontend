"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect,
} from "react";
import { useStore } from "zustand";

import {
  type AuthStore,
  createAuthStore,
  defaultInitState,
} from "@/stores/authStore";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/firebase/data/users";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined
);

export interface AuthStoreProviderProps {
  children: ReactNode;
}

export const AuthStoreProvider = ({
  children,
}: AuthStoreProviderProps): JSX.Element => {
  const storeRef = useRef<AuthStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: any) => {
      authStoreContext?.setState({ isLoadingAuth: true });
      if (authUser && authUser?.email) {
        authStoreContext?.setState({ user: authUser, isLoggedIn: true });
      } else {
        authStoreContext?.setState(defaultInitState);
      }
      authStoreContext?.setState({ isLoadingAuth: false });
    });

    return () => unsubscribe();
  }, []);

  if (!authStoreContext) {
    throw new Error(`useAuthStore must be used within AuthStoreProvider`);
  }

  return useStore(authStoreContext, selector);
};
