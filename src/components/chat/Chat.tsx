"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import AskNinaIcon from "../../../public/logos/antenna-inverted-90x90.png";
import Image from "next/image";
import EnterQuery from "../explore/EnterQuery";
import { QuestionContext } from "@/app/providers";
import { getMessageResponse } from "@/routes/openai";

import PulseLoader from "react-spinners/PulseLoader";

interface ChatProps {}

export interface DialogProps {
  role: SystemRoles;
  content: string;
}

enum SystemRoles {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

const initialChat = {
  role: SystemRoles.SYSTEM,
  content:
    "With Ask Nina, you can pose questions and browse resources to expand your knowledge of STEM and entrepreuneurship.What would you like to know? Ask away!",
};

const returnNinaResponse = (message: MessageType, index: number) => {
  return (
    <div
      key={`dialog-${message.role}-${index}`}
      className="w-full flex items-start justify-center bg-grey-100 border border-grey-300 p-4"
    >
      <div className="relative w-12 h-12 p-1 mr-4">
        <Image src={AskNinaIcon} alt="ask nina in purple" />
      </div>
      <div className="w-4/5 break-words">{message.content}</div>
    </div>
  );
};

const returnUserResponse = (message: MessageType, index: number) => {
  return (
    <div
      key={`message-${message.role}-${index}`}
      className="w-full flex items-center justify-center text-right p-4"
    >
      <div className="w-4/5 flex text-right break-words justify-end flex-wrap text-wrap">
        {message.content}
      </div>
      <div className="relative w-12 h-12 p-1 ml-4">
        {/* <Image src={AskNinaIcon} alt="ask nina in purple" /> */}
        <div className="w-12 h-12 rounded-full bg-yellowGreen" />
      </div>
    </div>
  );
};

import { useChat } from "@axflow/models/react";
import { MessageType } from "@axflow/models/shared";

const localPort = "8000";
const baseUrl =
  process.env.NODE_ENV !== "production"
    ? `localhost:${localPort}`
    : `localhost:${localPort}`;

const Chat = ({}: ChatProps) => {
  const { initialQuestion, setInitialQuestion } = useContext(QuestionContext);
  const { input, messages, onChange, onSubmit } = useChat({
    url: `http://${baseUrl}/open-ai/api/chat`,
  });

  // const [conversation, setConversation] = useState<DialogProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // useEffect(() => {
  //   if (initialQuestion) {
  //     addToConversation(SystemRoles.USER, initialQuestion);

  //     return function cleanup() {
  //       setInitialQuestion("");
  //     };
  //   }
  // }, [initialQuestion, setInitialQuestion]);

  // useEffect(() => {
  //   if (conversation && conversation.length) {
  //     const isLastUser =
  //       conversation[conversation?.length - 1].role == SystemRoles.USER;
  //     if (isLastUser) {
  //       getResponse();
  //     }
  //   }
  // }, [conversation]);

  // const addToConversation = (role: SystemRoles, content: string) => {
  //   // setConversation([...conversation, { role, content }]);
  //   onSubmit();
  // };

  const handleEnter = async (question: string) => {
    // await addToConversation(SystemRoles.USER, question);
    console.log("handle enter");
    onSubmit();
  };

  const getResponse = async () => {
    setIsLoading(true);
    // const response = await getMessageResponse(conversation);
    // const message = response?.message;
    // addToConversation(SystemRoles.ASSISTANT, message);
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col h-[92vH]">
      <div className="flex-1 pb-16">
        <div className="w-full flex items-center justify-center p-4 flex-1">
          <div className="relative w-12 h-12 p-1 mr-4">
            <Image src={AskNinaIcon} alt="ask nina in purple" />
          </div>
          <div className="w-4/5">Nina</div>
        </div>
        <div>
          {/* {returnNinaResponse(initialChat, Math.random())} */}
          {messages?.length ? (
            messages.map((dialog, index) => {
              if (dialog.role !== SystemRoles.USER) {
                return returnNinaResponse(dialog, index);
              } else {
                return returnUserResponse(dialog, index);
              }
            })
          ) : (
            <div />
          )}
        </div>
        <div className="p-8 flex items-center justify-center">
          {isLoading ? <PulseLoader color={"#423EEE"} size={12} /> : <div />}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 w-full bg-white">
        <EnterQuery handleEnter={handleEnter} otherStyles={""} />
      </div>{" "}
    </div>
  );
};

export default Chat;
