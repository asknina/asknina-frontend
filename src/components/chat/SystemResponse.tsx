"use client";
import { MessageType } from "@axflow/models/shared";
import React, { useState } from "react";
import AskNinaIcon from "@public/logos/antenna-90x90.png";
import Image from "next/image";
import { Remark } from "react-remark";

import { HiOutlineHandThumbDown, HiOutlineHandThumbUp } from "react-icons/hi2";
import { AdditionalMessageDetails } from "@/types/chat";
import { useConversationStore } from "@/providers/conversationStoreProvider";

import { AiFillLike, AiFillDislike } from "react-icons/ai";
interface SystemResponseProps {
  message: MessageType & AdditionalMessageDetails;
  isCurrentChat: boolean;
  loading: boolean;
  isResponded: boolean;
}
const SystemResponse = ({
  message,
  isCurrentChat,
  loading,
  isResponded,
}: SystemResponseProps) => {
  const { respondToMessage, currentConversation } = useConversationStore(
    (state) => state
  );

  const [response, setResponse] = useState(message.response);

  const handleResponse = (response: boolean, index: number) => {
    setResponse({ liked: response, timeResponded: new Date().toDateString() });
    respondToMessage(message.id, response, index);
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
          {response?.timeResponded ? (
            response.liked ? (
              <div>
                <AiFillLike />
              </div>
            ) : (
              <div>
                <AiFillDislike />
              </div>
            )
          ) : !loading ? (
            <>
              <button className="" onClick={() => handleResponse(true, 1)}>
                <HiOutlineHandThumbUp />
              </button>
              <button className="" onClick={() => handleResponse(false, 1)}>
                <HiOutlineHandThumbDown />
              </button>
            </>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemResponse;
