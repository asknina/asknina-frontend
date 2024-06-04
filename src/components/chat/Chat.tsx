"use client";
import React, { useEffect, useRef, useState } from "react";
import AskNinaIcon from "@public/logos/antenna-90x90.png";
import Image from "next/image";
import EnterQuery from "../explore/EnterQuery";

import { useChat } from "@axflow/models/react";
import { MessageType, createMessage } from "@axflow/models/shared";

import PulseLoader from "react-spinners/PulseLoader";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { useChatStore } from "@/providers/chatStoreProvider";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useConversationStore } from "@/providers/conversationStoreProvider";
import { SystemRoles } from "@/types/chat";

import RenderMessages from "./RenderMessages";
import InitialChat from "./InitialChat";
import { systemPrompts } from "@/lib/util/constants";

const localPort = "8000";
const baseUrl =
  process.env.NODE_ENV !== "production"
    ? `http://localhost:${localPort}`
    : `https://${process.env.BACKEND_API}`;

const Chat = () => {
  const [numberReload, setNumberReload] = useState(0);
  const [cleanedMessages, setCleanedMessages] = useState<any[]>([]);

  const { initialQuestion, setInitialQuestion } = useChatStore(
    (state) => state
  );

  const {
    currentConversation,
    currentConvoMessages,
    setCurrentConversation,
    updateConversationMessages,
  } = useConversationStore((state) => state);

  const { user } = useAuthStore((state) => state);
  const { messages, setMessages, loading, reload, onSubmit, input, onChange } =
    useChat({
      url: `${baseUrl}/api/chat/`,
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      onNewMessage: async (message: MessageType) => {
        return await updateConversationMessages(
          currentConversation.conversationId,
          [message]
        );
      },
      onError: (error) => console.log(error),
    });

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const sortedMessages = [...currentConvoMessages].sort((msgA, msgB) =>
      msgB.created > msgA.created ? -1 : 1
    );
    setMessages(sortedMessages);
  }, [currentConvoMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages?.length) {
      setCleanedMessages(
        messages.filter(
          (message) => message.role !== SystemRoles.SYSTEM && !!message.content
        )
      );
    } else {
      setCleanedMessages([]);
    }
  }, [messages]);

  useEffect(() => {
    if (initialQuestion?.question?.length && user.accessToken) {
      const newMessages = [
        createMessage({
          role: SystemRoles.SYSTEM,
          content: systemPrompts[initialQuestion.promptNumber],
        }),
        createMessage({
          role: SystemRoles.USER,
          content: initialQuestion.question,
        }),
      ];
      setMessages(newMessages);
      onSubmit();

      return function cleanup() {
        setInitialQuestion({ promptNumber: 0, question: "" });
      };
    }
  }, [initialQuestion, setInitialQuestion, user]);

  const regenerate = () => {
    setNumberReload(numberReload + 1);
    const lastSystemMessageIndex = messages.findLastIndex(
      (message) => message.role == SystemRoles.ASSISTANT
    );
    setMessages(messages.slice(0, lastSystemMessageIndex));
    reload();
  };
  const router = useRouter();

  const handleCloseButton = async () => {
    setCurrentConversation("");
    router.push("/");
  };

  return (
    <div className="h-screen relative flex flex-col overflow-y-auto">
      <div className="sticky top-0 w-full flex justify-end p-2">
        <button onClick={handleCloseButton}>
          <IoClose size={20} />
        </button>
      </div>
      <div className="w-full flex flex-col pb-16 flex-1 justify-start">
        <div className="w-full flex items-center justify-center p-4">
          <div className="relative w-12 h-12 p-1 mr-4">
            <Image src={AskNinaIcon} alt="ask nina in purple" />
          </div>
          <div className="w-4/5">Nina</div>
        </div>
        <div>
          <InitialChat />
          <RenderMessages loading={loading} messages={cleanedMessages} />
        </div>
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <PulseLoader color={"#423EEE"} size={12} />
          </div>
        ) : (
          <div />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 w-full bg-white">
        <EnterQuery
          onSubmit={onSubmit}
          input={input}
          onChange={onChange}
          reload={regenerate}
          showReload={false}
        />
      </div>
    </div>
  );
};

export default Chat;
