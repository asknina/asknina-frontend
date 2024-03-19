"use client";
import React, { MouseEventHandler } from "react";

interface ChatSidebarButtonProps {
  label: string;
  onClick: MouseEventHandler;
  onDelete?: Function;
}
const ChatSidebarButton = ({
  label,
  onClick,
  onDelete,
}: ChatSidebarButtonProps) => {
  return (
    <div className="flex p-2 text-sm flex-row justify-between bg-white shadow-sm rounded-sm">
      <div className="space-x-2">
        <span>Chat</span>
        <span>{label}</span>
      </div>
      <div className="space-x-2">
        <span>Edit</span>
        {onDelete && <span onClick={() => onDelete()}>Trash</span>}
      </div>
    </div>
  );
};

export default ChatSidebarButton;
