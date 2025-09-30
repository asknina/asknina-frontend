"use client";

import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/chat/Chat"), {
  ssr: false,
});

const ChatWindow = () => {
  return <Chat />;
};

export default ChatWindow;
