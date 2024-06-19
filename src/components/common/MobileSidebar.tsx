"use client";
import React, { useEffect, useRef } from "react";
import AskNinaButton, { Variants } from "./Button";
import ChatSidebarButton from "../sidebar/ChatSidebarButton";
import HelpButton from "../sidebar/HelpButton";
import LogoutButton from "../sidebar/LogoutButton";
import ProfileButton from "../sidebar/ProfileButton";

import { IoMdAdd, IoIosHome } from "react-icons/io";
import { useRouter } from "next/navigation";
import { Conversation, SystemRoles } from "@/types/chat";
import { getAllUserConversations } from "@/lib/firebase/data/chats";
import { getRandomInteger } from "@/lib/util/utilities";
import { systemPrompts } from "@/lib/util/constants";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useConversationStore } from "@/providers/conversationStoreProvider";
import { createMessage } from "@axflow/models/shared";

interface MobileSidebarProps {
  setIsMenuOpen: (val: boolean) => void;
}

const MobileSidebar = ({ setIsMenuOpen }: MobileSidebarProps) => {
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
    setIsMenuOpen(false);
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
    setIsMenuOpen(false);
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
    <div className=" w-full flex flex-col text-primaryPurple sidebar-background">
      <div className="h-content p-2">
        <AskNinaButton
          label={"Home"}
          onClick={() => {
            setIsMenuOpen(false);
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
      <div className="my-2 space-y-2 p-2">
        {/* Nina discovery page */}
        <div>Conversations</div>
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

      <div className="p-2">
        <div>Other</div>
        {isLoggedIn ? (
          <>
            {/* <ClearConversationsButton /> */}
            <ProfileButton setIsMenuOpen={setIsMenuOpen} />
            <HelpButton setIsMenuOpen={setIsMenuOpen} />
          </>
        ) : null}
        <LogoutButton setIsMenuOpen={setIsMenuOpen} />
      </div>
    </div>
  );
};

export default MobileSidebar;
