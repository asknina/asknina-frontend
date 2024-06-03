"use client";
import React, { MouseEventHandler, useState } from "react";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { FiEdit3, FiSave } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useConversationStore } from "@/providers/conversationStoreProvider";
import { Conversation } from "@/types/chat";
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
  const { currentConversation, updateConversation } = useConversationStore(
    (state) => state
  );
  const isCurrent =
    (currentConversation && currentConversation?.conversationId) ==
    conversation.conversationId;
  const [editTitle, setEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");

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
  return (
    <div
      className={`inline-flex p-2 text-sm flex-row justify-between  shadow-sm rounded-sm overflow-hidden ${
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
        <>
          <div
            className="space-x-2 inline-flex items-center hover:cursor-pointer"
            onClick={() => onClick()}
          >
            <span>
              <MdOutlineChatBubbleOutline />
            </span>
            <span>{label?.toString()}</span>
          </div>
          <div className="space-x-2 inline-flex items-center">
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
        </>
      )}
    </div>
  );
};

export default ChatSidebarButton;
