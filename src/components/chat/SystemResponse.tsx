"use client";
import { MessageType } from "@axflow/models/shared";
import React, { useState } from "react";
import AskNinaIcon from "@public/logos/antenna-90x90.png";
import Image from "next/image";
import { Remark } from "react-remark";

import {
  BsFillHandThumbsUpFill,
  BsHandThumbsUp,
  BsHandThumbsDown,
  BsHandThumbsDownFill,
} from "react-icons/bs";
import { AdditionalMessageDetails } from "@/types/chat";
import { useConversationStore } from "@/providers/conversationStoreProvider";

interface SystemResponseProps {
  message: MessageType & AdditionalMessageDetails;
  isCurrentChat: boolean;
  loading: boolean;
  isResponded: boolean;
}
const SystemResponse = ({ message }: SystemResponseProps) => {
  const { respondToMessage } = useConversationStore((state) => state);

  const [response, setResponse] = useState(message.response);

  const handleResponse = (response: boolean) => {
    setResponse({ liked: response, timeResponded: new Date().toDateString() });
    respondToMessage(message.id, response);
  };

  return (
    <div className="w-full flex flex-row justify-center bg-grey-100 border border-grey-300 p-4">
      <div className="flex flex-row max-w-screen-lg">
        <div className="relative w-12 h-12 p-1 mr-4 self-start">
          <Image
            src={AskNinaIcon}
            alt="ask nina in purple"
            className="shadow-md"
          />
        </div>
        <div className="flex-1 break-words space-y-2">
          <Remark>{message.content}</Remark>
        </div>
        <div className="w-16 flex flex-row items-center justify-around self-end">
          {response?.liked ? (
            <div>
              <BsFillHandThumbsUpFill />
            </div>
          ) : (
            <button className="" onClick={() => handleResponse(true)}>
              <BsHandThumbsUp />
            </button>
          )}
          {response?.liked ? (
            <button
              className="scale-x-[-1]"
              onClick={() => handleResponse(false)}
            >
              <BsHandThumbsDown />
            </button>
          ) : (
            <div className="scale-x-[-1]">
              <BsHandThumbsDownFill />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemResponse;
