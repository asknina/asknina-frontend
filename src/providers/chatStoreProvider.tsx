"use client";

import { useAtom } from "jotai";
import {
  initialQuestionAtom,
  systemMessageAtom,
  messagesAtom,
  InitialQuestionState,
} from "@/stores/chatStore";

export function useChatStore() {
  const [initialQuestion, setInitialQuestion] = useAtom(initialQuestionAtom);
  const [systemMessage] = useAtom(systemMessageAtom);
  const [messages, setMessages] = useAtom(messagesAtom);

  return {
    initialQuestion,
    systemMessage,
    messages,
    setInitialQuestion,
    setMessages,
  };
}
