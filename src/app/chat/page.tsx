import Chat from "@/components/chat/Chat";
import React from "react";

import Link from "next/link";
import { IoClose } from "react-icons/io5";

const ChatWindow = () => {
  return (
    <div className="h-screen w-full overflow-y-auto relative">
      <div className="w-full flex justify-end p-2">
        <Link href={"/"}>
          <IoClose size={20} />
        </Link>
      </div>
      <Chat />
    </div>
  );
};

export default ChatWindow;
