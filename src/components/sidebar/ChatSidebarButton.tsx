"use client";
import React, { MouseEventHandler } from "react";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
interface ChatSidebarButtonProps {
  label: string;
  onClick: Function;
  onDelete?: Function;
}
const ChatSidebarButton = ({
  label,
  onClick,
  onDelete,
}: ChatSidebarButtonProps) => {
  return (
    <div className="inline-flex p-2 text-sm flex-row justify-between bg-white shadow-sm rounded-sm">
      <div
        className="space-x-2 inline-flex items-center hover:cursor-pointer"
        onClick={() => onClick()}
      >
        <span>
          <MdOutlineChatBubbleOutline />
        </span>
        <span>{label}</span>
      </div>
      <div className="space-x-2 inline-flex items-center">
        <span>
          <FiEdit3 />
        </span>
        {onDelete ? (
          <span onClick={() => onDelete()} className="hover:cursor-pointer">
            <HiOutlineTrash />
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ChatSidebarButton;
