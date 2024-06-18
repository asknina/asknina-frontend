"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import PulseLoader from "react-spinners/PulseLoader";

import AskNinaIcon from "@public/logos/antenna-90x90.png";
import EnterQuery from "../explore/EnterQuery";
import RenderMessages from "./RenderMessages";
import InitialChat from "./InitialChat";

import { useChat } from "@axflow/models/react";
import { MessageType } from "@axflow/models/shared";
import { useChatStore } from "@/providers/chatStoreProvider";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useConversationStore } from "@/providers/conversationStoreProvider";
import { addMessageToConversation } from "@/lib/firebase/data/chats";
import { mapCurrentConvoMsgToMessage } from "@/lib/util/utilities";
import { SystemRoles } from "@/types/chat";

const localPort = "8000";
const baseUrl =
  process.env.NODE_ENV !== "production"
    ? `http://localhost:${localPort}`
    : `https://${process.env.BACKEND_API}`;

const Chat = () => {
  const [cleanedMessages, setCleanedMessages] = useState<MessageType[]>([]);
  const [numberReload, setNumberReload] = useState(0);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();

  const { initialQuestion, setInitialQuestion } = useChatStore(
    (state) => state
  );
  const { currentConversation, currentConvoMessages, setCurrentConversation } =
    useConversationStore((state) => state);
  const { user } = useAuthStore((state) => state);

  const { messages, setMessages, loading, reload, onSubmit, input, onChange } =
    useChat({
      url: `${baseUrl}/api/chat/`,
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      onError: (error) => console.error(error),
      onNewMessage: () => scrollToBottom(),
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load initial conversation messages
  useEffect(() => {
    if (currentConvoMessages) {
      const savedMessages = mapCurrentConvoMsgToMessage(
        currentConvoMessages
      ).map((msg) => ({
        ...msg,
        saved: true,
      }));
      setMessages(savedMessages);
    }
  }, [currentConvoMessages, setMessages]);

  // Submit initial question if present
  useEffect(() => {
    if (initialQuestion?.question && user.accessToken) {
      onSubmit();
      return () => setInitialQuestion({ promptNumber: 0, question: "" });
    }
  }, [initialQuestion, setInitialQuestion, user, onSubmit]);

  // Handle new messages and save unsaved ones
  useEffect(() => {
    if (!loading && messages.length) {
      addUnsavedMessages(messages);
    }
  }, [messages, loading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setCleanedMessages(
      messages.filter(
        (message) => message.role !== SystemRoles.SYSTEM && message.content
      )
    );
  }, [messages]);

  const addUnsavedMessages = async (
    messages: (MessageType & { saved?: boolean })[]
  ) => {
    await messages.reduce(
      async (
        previousPromise,
        message: MessageType & { saved?: boolean },
        index: number
      ) => {
        await previousPromise;
        if (!message.saved) {
          await addMessageToConversation(
            currentConversation.conversationId,
            message,
            index
          );
          message.saved = true;
        }
      },
      Promise.resolve()
    );
  };

  const regenerate = () => {
    const lastSystemMessageIndex = messages.findLastIndex(
      (message) => message.role === SystemRoles.ASSISTANT
    );
    setMessages([
      ...messages.slice(0, lastSystemMessageIndex),
      ...messages.slice(lastSystemMessageIndex + 1),
    ]);
    setNumberReload((prev) => prev + 1);
    reload();
  };

  const handleCloseButton = async () => {
    setCurrentConversation("");
    router.push("/home");
  };

  return (
    <div className="h-screen relative flex flex-col overflow-y-auto">
      <div className="sticky top-0 w-full flex justify-end p-2">
        <button onClick={handleCloseButton}>
          <IoClose size={20} />
        </button>
      </div>
      <div className="w-full flex flex-col pb-16 flex-1 justify-start">
        <div className="w-full flex flex-row justify-center p-4">
          <div className="flex flex-row max-w-screen-lg items-center w-full">
            <div className="relative w-12 h-12 p-1 mr-4 self-start">
              <Image src={AskNinaIcon} alt="ask nina in purple" />
            </div>
            <div className="flex-1">Hi, I&apos;m Nina!</div>
          </div>
        </div>
        <div>
          <InitialChat />
          <RenderMessages loading={loading} messages={cleanedMessages} />
        </div>
        {loading && (
          <div className="p-8 flex items-center justify-center">
            <PulseLoader color="#423EEE" size={12} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 w-full bg-white">
        <EnterQuery
          onSubmit={onSubmit}
          input={input}
          onChange={onChange}
          reload={regenerate}
          showReload
        />
      </div>
    </div>
  );
};

export default Chat;
