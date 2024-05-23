"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type ConversationStore,
  createConversationStore,
} from "@/stores/conversationStore";

export type ConversationStoreApi = ReturnType<typeof createConversationStore>;

export const ConversationStoreContext = createContext<
  ConversationStoreApi | undefined
>(undefined);

export interface ConversationStoreProviderProps {
  children: ReactNode;
}

export const ConversationStoreProvider = ({
  children,
}: ConversationStoreProviderProps) => {
  const storeRef = useRef<ConversationStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createConversationStore();
  }

  return (
    <ConversationStoreContext.Provider value={storeRef.current}>
      {children}
    </ConversationStoreContext.Provider>
  );
};

export const useConversationStore = <T,>(
  selector: (store: ConversationStore) => T
): T => {
  const conversationStoreContext = useContext(ConversationStoreContext);

  if (!conversationStoreContext) {
    throw new Error(
      `useConversationStore must be used within conversationStoreProvider`
    );
  }

  return useStore(conversationStoreContext, selector);
};
