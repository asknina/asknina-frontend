"use client";
import { MessageType } from "@axflow/models/shared";
import React, { useState } from "react";
import AskNinaIcon from "../../../public/logos/antenna-90x90.png";
import Image from "next/image";
import { Remark } from "react-remark";

import { HiOutlineHandThumbDown, HiOutlineHandThumbUp } from "react-icons/hi2";
import { AdditionalMessageDetails } from "@/types/chat";
import { useConversationStore } from "@/providers/conversationStoreProvider";

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

  const [showResponseBtns, setShowResponseBtns] = useState(true);
  const handleButtonClick = (response: string) => {
    setShowResponseBtns(!showResponseBtns);
  };

  const handleResponse = (response: boolean) => {
    respondToMessage(currentConversation.conversationId, message.id, response);
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
        <div className="flex-1 break-words">
          {/* TODO: decide between these */}
          {/* <div>{message.content}</div> */}
          <Remark>{message.content}</Remark>
        </div>
        {!message.response?.timeResponded && !loading && (
          <div className="w-16 flex flex-row items-center justify-around self-end">
            <button className="" onClick={() => handleResponse(true)}>
              <HiOutlineHandThumbUp />
            </button>
            <button className="" onClick={() => handleResponse(false)}>
              <HiOutlineHandThumbDown />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemResponse;
