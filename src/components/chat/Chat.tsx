"use client";
import React, { useEffect, useRef, useState } from "react";
import AskNinaIcon from "@public/logos/antenna-90x90.png";
import Image from "next/image";
import EnterQuery from "../explore/EnterQuery";

import { useChat } from "@axflow/models/react";
import { MessageType } from "@axflow/models/shared";

import PulseLoader from "react-spinners/PulseLoader";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { useChatStore } from "@/providers/chatStoreProvider";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useConversationStore } from "@/providers/conversationStoreProvider";
import { MessageObj, SystemRoles } from "@/types/chat";

import RenderMessages from "./RenderMessages";
import InitialChat from "./InitialChat";
import { addMessageToConversation } from "@/lib/firebase/data/chats";
import { mapCurrentConvoMsgToMessage } from "@/lib/util/utilities";

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

  const { currentConversation, currentConvoMessages, setCurrentConversation } =
    useConversationStore((state) => state);

  const { user } = useAuthStore((state) => state);
  const { messages, setMessages, loading, reload, onSubmit, input, onChange } =
    useChat({
      url: `${baseUrl}/api/chat/`,
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      onError: (error) => console.log(error),
      onNewMessage: () => scrollToBottom(),
    });

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (currentConvoMessages) {
      const msgArray = mapCurrentConvoMsgToMessage(currentConvoMessages);
      const savedMessages = msgArray.map((msg) => {
        return { ...msg, saved: true };
      });
      setMessages(savedMessages);
    }
  }, [currentConvoMessages]);

  useEffect(() => {
    if (initialQuestion?.question?.length && user.accessToken) {
      onSubmit();

      return function cleanup() {
        setInitialQuestion({ promptNumber: 0, question: "" });
      };
    }
  }, [initialQuestion, setInitialQuestion, user]);

  useEffect(() => {
    if (!loading) {
      if (messages?.length) {
        // @ts-ignore
        addUnsavedMessages(messages);
      }
    }
  }, [messages, loading]);

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
          // @ts-ignore message includes the saved field
          message.saved = true;
        }
      },
      Promise.resolve()
    );
  };

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

  const regenerate = () => {
    // TODO: Fix this
    setNumberReload(numberReload + 1);
    const lastSystemMessageIndex = messages.findLastIndex(
      (message) => message.role == SystemRoles.ASSISTANT
    );
    setMessages([
      ...messages.slice(0, lastSystemMessageIndex),
      ...messages.slice(lastSystemMessageIndex + 1, messages.length),
    ]);
    reload();
  };
  const router = useRouter();

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
          showReload={true}
        />
      </div>
    </div>
  );
};

export default Chat;
