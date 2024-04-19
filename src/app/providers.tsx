"use client";
import { DialogProps } from "@/components/chat/Chat";
import React, { createContext, useState } from "react";

export const QuestionContext = createContext<any>(null);
export const ChatContext = createContext<any>([]);
export const CurrentChatContext = createContext<any>({
  name: "",
  conversation: [],
});
interface ProvidersProps {
  children: React.ReactNode;
}

interface Chat {
  name: string;
  conversation: DialogProps[];
}

export function Providers({ children }: ProvidersProps) {
  const [initialQuestion, setInitialQuestion] = useState(null);
  const [chats, setChats] = useState([
    {
      name: "",
      conversation: [],
    },
  ]);
  const [currentChat, setCurrentChat] = useState({
    name: "",
    conversation: [],
  });

  return (
    <QuestionContext.Provider value={{ initialQuestion, setInitialQuestion }}>
      <ChatContext.Provider value={{ chats, setChats }}>
        <CurrentChatContext.Provider value={{ currentChat, setCurrentChat }}>
          {children}
        </CurrentChatContext.Provider>
      </ChatContext.Provider>
    </QuestionContext.Provider>
  );
}
