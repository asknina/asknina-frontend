"use client";
import React, { useEffect, useRef } from "react";
import AskNinaButton, { Variants } from "./Button";
import ChatSidebarButton from "../sidebar/ChatSidebarButton";
import HelpButton from "../sidebar/HelpButton";
import LogoutButton from "../sidebar/LogoutButton";

import { IoMdAdd, IoIosHome } from "react-icons/io";
import { useRouter } from "next/navigation";
import { DialogProps, Conversation, SystemRoles } from "@/types/chat";
import { getAllUserConversations } from "@/lib/firebase/data/chats";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useConversationStore } from "@/providers/conversationStoreProvider";
import ProfileButton from "../sidebar/ProfileButton";
import { getRandomInteger } from "@/lib/util/utilities";
import { systemPrompts } from "@/lib/util/constants";
import { createMessage } from "@axflow/models/shared";

const Sidebar = ({}) => {
  const { isLoggedIn, user } = useAuthStore((state) => state);
  const {
    conversations,
    setConversations,
    setCurrentConversation,
    createConversation,
    deleteConversation,
    currentConversation,
  } = useConversationStore((state) => state);
  const router = useRouter();
  const convosEndRef = useRef<null | HTMLDivElement>(null);

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
    const initialPromptRandomIdx = getRandomInteger(systemPrompts.length);
    const prompt = systemPrompts[initialPromptRandomIdx];
    const message = createMessage({
      content: prompt,
      role: SystemRoles.SYSTEM,
    });
    const conversation = await createConversation(user.uid, [message]);
    // setCurrentChat as the newly created conversation
    scrollToBottom();
    router.push("/chat");
  };

  const handleSelectChat = (conversationId: string) => {
    setCurrentConversation(conversationId);
    router.push("/chat");
  };

  const handleDeleteChat = (conversationId: string) => {
    if (currentConversation.conversationId == conversationId) {
      router.push("/home");
    }
    deleteConversation(user.uid, conversationId);
  };

  const scrollToBottom = () => {
    convosEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className=" w-full flex flex-col text-primaryPurple h-screen login-background max-h-screen">
      <div className=" h-content p-2">
        <AskNinaButton
          label={"Home"}
          onClick={() => {
            setCurrentConversation("");
            router.push("/");
          }}
          otherStyles="w-full"
          icon={<IoIosHome />}
          variant={Variants.withoutBorder}
        />
        <AskNinaButton
          label={"Start a new conversation"}
          onClick={() => handleCreateNewChat()}
          otherStyles="w-full"
          icon={<IoMdAdd />}
        />
      </div>
      <div className="flex-1 my-2 space-y-2 overflow-y-auto p-2">
        {/* Nina discovery page */}
        {conversations?.length
          ? conversations.map((chat) => (
              <ChatSidebarButton
                key={chat.conversationId}
                label={chat.title}
                conversation={chat}
                onClick={() => handleSelectChat(chat.conversationId)}
                onDelete={() => handleDeleteChat(chat.conversationId)}
              />
            ))
          : null}
        <div ref={convosEndRef} />
      </div>

      <div className="flex flex-col space-y-2 p-2">
        <hr className="border-grey-400 border" />
        {isLoggedIn ? (
          <>
            {/* <ClearConversationsButton /> */}
            <ProfileButton />
            <HelpButton />
          </>
        ) : null}
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
