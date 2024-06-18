import { SystemRoles } from "@/types/chat";
import React from "react";
import SystemResponse from "./SystemResponse";
import UserResponse from "./UserResponse";

interface RenderMessagesProps {
  loading: boolean;
  messages: any[];
}
const RenderMessages = ({ loading, messages }: RenderMessagesProps) => {
  return messages?.map((message, index) => {
    if (message.role !== SystemRoles.USER) {
      return (
        <SystemResponse
          message={message}
          isCurrentChat={index == messages.length - 1}
          isLoading={loading}
          isResponded={false}
          key={`dialog-${message.role}-${index}`}
        />
      );
    } else {
      return (
        <UserResponse
          key={`message-${message.role}-${index}`}
          message={message}
          index={index}
        />
      );
    }
  });
};

export default RenderMessages;
