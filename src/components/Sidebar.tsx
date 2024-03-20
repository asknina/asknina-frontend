"use client";
import React, { useState } from "react";
import AskNinaButton from "./common/Button";
import ChatSidebarButton from "./sidebar/ChatSidebarButton";
import ClearConversationsButton from "./sidebar/ClearConversationsButton";
import HelpButton from "./sidebar/HelpButton";
import LogoutButton from "./sidebar/LogoutButton";

import { IoMdAdd } from "react-icons/io";
const Sidebar = ({}) => {
  const [chats, setNewChats] = useState(["Nina discovery"]);
  return (
    <div className="p-2 w-1/5 flex flex-col text-primaryPurple bg-grey-100 h-screen">
      <div className="flex-1">
        <AskNinaButton
          label={"New chat"}
          onClick={() => {
            "New chat button clicked";
          }}
          otherStyles="w-full"
          icon={<IoMdAdd />}
        />
        <div className="flex flex-col my-2 space-y-2">
          {/* Nina discovery page */}
          <ChatSidebarButton
            label="Nina discovery page"
            onClick={() => console.log("Go to nina discovery page")}
          />

          {chats?.length &&
            chats.map((chatTitle) => (
              <ChatSidebarButton
                key={chatTitle}
                label={chatTitle}
                onClick={() => console.log("setting current conversation")}
                onDelete={() => console.log("want to delete")}
              />
            ))}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <hr className="border-grey-400 border" />
        <ClearConversationsButton />
        <HelpButton />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
