"use client";
import React, { useState, useEffect } from "react";
import AskNinaButton from "./Button";
import ChatSidebarButton from "../sidebar/ChatSidebarButton";
import ClearConversationsButton from "../sidebar/ClearConversationsButton";
import HelpButton from "../sidebar/HelpButton";
import LogoutButton from "../sidebar/LogoutButton";

import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";
import { DialogProps, Conversation } from "@/types/chat";
import { getAllUserConversations } from "@/lib/firebase/data/chats";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useConversationStore } from "@/providers/conversationStoreProvider";

const Sidebar = ({}) => {
  const [chats, setChats] = useState<Conversation[]>([]);
  const { isLoggedIn, user } = useAuthStore((state) => state);
  const {
    conversations,
    setConversations,
    setCurrentConversation,
    createConversation,
  } = useConversationStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (user && user.uid) {
      getConversations();
    }
  }, [user]);

  const getConversations = async () => {
    await getAllUserConversations(user.uid).then((convos: Conversation[]) => {
      setConversations(convos);
    });
  };

  const handleCreateNewChat = async () => {
    const conversation = await createConversation(user.uid, []);
    // setCurrentChat as the newly created conversation
    router.push("/chat");
  };

  const handleSelectChat = (conversationId: string) => {
    setCurrentConversation(conversationId);
    router.push("/chat");
  };

  const handleDeleteChat = (chatIndex: number) => {
    const remainingChats = [
      ...chats.slice(0, chatIndex),
      ...chats.slice(chatIndex + 1),
    ];
    setChats(remainingChats);
  };

  return (
    <div className="p-2 w-1/5 flex flex-col text-primaryPurple h-screen login-background">
      <div className="flex-1">
        <AskNinaButton
          label={"New chat"}
          onClick={() => handleCreateNewChat()}
          otherStyles="w-full"
          icon={<IoMdAdd />}
        />
        <div className="flex flex-col my-2 space-y-2">
          {/* Nina discovery page */}
          <button
            onClick={() => {
              setCurrentConversation("");
              router.push("/");
            }}
            className="px-2 text-left"
          >
            <span className="text-sm text-left underline">
              Nina discovery page
            </span>
          </button>
          {conversations?.length
            ? conversations.map((chat, index) => (
                <ChatSidebarButton
                  key={chat.conversationId}
                  label={chat.title}
                  conversation={chat}
                  onClick={() => handleSelectChat(chat.conversationId)}
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
