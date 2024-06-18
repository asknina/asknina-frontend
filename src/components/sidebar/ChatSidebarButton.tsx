"use client";
import React, { MouseEventHandler, useState, useRef } from "react";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { FiEdit3, FiSave } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useConversationStore } from "@/providers/conversationStoreProvider";
import { Conversation } from "@/types/chat";

import useOnClickOutside from "use-onclickoutside";

interface ChatSidebarButtonProps {
  label: string;
  conversation: Conversation;
  onClick: Function;
  onDelete?: Function;
}
const ChatSidebarButton = ({
  label,
  conversation,
  onClick,
  onDelete,
}: ChatSidebarButtonProps) => {
  const ref = useRef(null);

  const { currentConversation, updateConversation } = useConversationStore(
    (state) => state
  );
  const isCurrent =
    (currentConversation && currentConversation?.conversationId) ==
    conversation.conversationId;
  const [editTitle, setEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(label);

  const handleEditClick = () => {
    setEditTitle(!editTitle);
  };

  const saveNewTitle = async () => {
    if (newTitle && newTitle !== label) {
      await updateConversation(conversation.conversationId, {
        title: newTitle,
      });
      setEditTitle(false);
    }
  };

  useOnClickOutside(ref, saveNewTitle);

  return (
    <div
      className={`inline-flex w-full p-2 text-sm flex-row justify-between  shadow-sm rounded-sm overflow-hidden ${
        isCurrent ? "bg-primaryPurple text-white" : "bg-white"
      }`}
    >
      {editTitle ? (
        <div className="flex w-full">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            className="text-primaryPurple px-1 py-0.5 flex-1"
            ref={ref}
          />
          <div className="space-x-2 inline-flex items-center ml-2">
            <button
              onClick={() => saveNewTitle()}
              type="submit"
              className="hover:cursor-pointer"
            >
              <span>
                <FiSave size={18} />
              </span>
            </button>
            <button
              onClick={() => handleEditClick()}
              className="hover:cursor-pointer"
            >
              <span>
                <IoClose size={18} />
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div
          className="space-x-2 inline-flex items-center hover:cursor-pointer w-full h-6 "
          onClick={() => onClick()}
        >
          <span className="self-start truncate flex-1">
            {label?.toString()}
          </span>
          <div className="space-x-2 inline-flex items-center justify-end w-1/6">
            <button onClick={handleEditClick} className="hover:cursor-pointer">
              <span>
                <FiEdit3 />
              </span>
            </button>
            {onDelete ? (
              <span onClick={() => onDelete()} className="hover:cursor-pointer">
                <HiOutlineTrash />
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebarButton;
