"use client";
import React, { useState, useEffect } from "react";
import AskNinaButton from "./Button";
import ChatSidebarButton from "../sidebar/ChatSidebarButton";
import ClearConversationsButton from "../sidebar/ClearConversationsButton";
import HelpButton from "../sidebar/HelpButton";
import LogoutButton from "../sidebar/LogoutButton";

import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/useAuth";
import { DialogProps } from "../chat/Chat";

interface Chat {
  name: string;
  conversation: DialogProps[];
}

const Sidebar = ({}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [currentChat, setCurrentChat] = useState(chats[0]);
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged((authUser: any) => {
  //     setUser(authUser);
  //     setIsLoggedIn(true);
  //   });

  //   return () => unsubscribe();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleCreateNewChat = () => {
    const newChat = {
      name: "New Chat",
      conversation: [],
    };
    setChats([...chats, newChat]);
    router.push("/chat");
  };

  const handleSelectChat = (chatIndex: number) => {
    setCurrentChat(chats[chatIndex]);
  };

  const handleDeleteChat = (chatIndex: number) => {
    const remainingChats = [
      ...chats.slice(0, chatIndex),
      ...chats.slice(chatIndex + 1),
    ];
    setChats(remainingChats);
  };
  return (
    <div className="p-2 w-1/5 flex flex-col text-primaryPurple bg-grey-100 h-screen">
      <div className="flex-1">
        <AskNinaButton
          label={"New chat"}
          onClick={() => handleCreateNewChat()}
          otherStyles="w-full"
          icon={<IoMdAdd />}
        />
        <div className="flex flex-col my-2 space-y-2">
          {/* Nina discovery page */}
          <ChatSidebarButton
            label="Nina discovery page"
            onClick={() => router.push("/")}
          />

          {chats?.length
            ? chats.map((chat, index) => (
                <ChatSidebarButton
                  key={chat.name + index}
                  label={chat.name + index}
                  onClick={() => handleSelectChat(index)}
                  onDelete={() => handleDeleteChat(index)}
                />
              ))
            : null}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <hr className="border-grey-400 border" />
        {isLoggedIn ? (
          <>
            {/* <ClearConversationsButton /> */}
            <HelpButton />
          </>
        ) : null}
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
