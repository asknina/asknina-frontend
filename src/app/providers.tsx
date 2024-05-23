"use client";
import React from "react";

import { AuthStoreProvider } from "@/providers/authStoreProvider";
import { ChatStoreProvider } from "@/providers/chatStoreProvider";
import { ConversationStoreProvider } from "@/providers/conversationStoreProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthStoreProvider>
      <ChatStoreProvider>
        <ConversationStoreProvider>{children}</ConversationStoreProvider>
      </ChatStoreProvider>
    </AuthStoreProvider>
  );
}
