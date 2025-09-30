"use client";

import { useAtom, useSetAtom } from "jotai";
import {
  conversationsAtom,
  currentConversationAtom,
  currentConvoMessagesAtom,
  setCurrentConversationAtom,
  createConversationAtom,
  deleteConversationAtom,
  respondToMessageAtom,
  updateConversationAtom,
  updateConversationMessageAtom,
} from "@/stores/conversationStore";
import { Conversation, MessageObj } from "@/types/chat";
import { MessageType } from "@axflow/models/shared";

export function useConversationStore() {
  const [conversations, setConversations] = useAtom(conversationsAtom);
  const [currentConversation] = useAtom(currentConversationAtom);
  const [currentConvoMessages, setCurrentConversationMessages] = useAtom(
    currentConvoMessagesAtom
  );

  const setCurrentConversation = useSetAtom(setCurrentConversationAtom);
  const createConversation = useSetAtom(createConversationAtom);
  const deleteConversation = useSetAtom(deleteConversationAtom);
  const respondToMessage = useSetAtom(respondToMessageAtom);
  const updateConversation = useSetAtom(updateConversationAtom);
  const updateConversationMessage = useSetAtom(updateConversationMessageAtom);

  return {
    conversations,
    currentConversation,
    currentConvoMessages,
    setConversations,
    setCurrentConversation: (conversationId: string) =>
      setCurrentConversation(conversationId),
    setCurrentConversationMessages,
    createConversation: (
      userId: string,
      messages: any[],
      promptQuestion?: string
    ) => createConversation({ userId, messages, promptQuestion }),
    deleteConversation: (userId: string, conversationId: string) =>
      deleteConversation({ userId, conversationId }),
    respondToMessage: (messageId: string, response: boolean) =>
      respondToMessage({ messageId, response }),
    updateConversation: (
      conversationId: string,
      convoDetails: Partial<Conversation>
    ) => updateConversation({ conversationId, convoDetails }),
    updateConversationMessage: (
      conversationId: string,
      message: MessageType,
      index?: number
    ) => updateConversationMessage({ conversationId, message, index }),
  };
}
