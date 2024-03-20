"use client";
import React, { useState } from "react";
import AskNinaIcon from "../../../public/logos/antenna-inverted-90x90.png";
import Image from "next/image";
import QuestionQuery from "../explore/QuestionQuery";
import EnterQuery from "../explore/EnterQuery";
interface ChatProps {}

interface DialogProps {
  id: string;
  user: string;
  dialog: { __html: TrustedHTML };
}

const initialChat = {
  id: "intro",
  user: "nina",
  dialog: {
    __html:
      "<p>With Ask Nina, you can pose questions and browse resources to expand your knowledge of STEM and entrepreuneurship.</p> <p>What would you like to know? Ask away!</p>",
  },
};
const initialChatQuestion = {
  id: "introQuestion",
  user: "user",
  dialog: {
    __html:
      "<p>With Ask Nina, you can pose questions and browse resources to expand your knowledge of STEM and entrepreuneurship.</p> <p>What would you like to know? Ask away!</p>",
  },
};

const returnNinaResponse = (dialog: DialogProps) => {
  return (
    <div
      key={`dialog-${dialog.id}`}
      className="w-full flex items-start justify-center bg-grey-100 border border-grey-300 p-4"
    >
      <div className="relative w-12 h-12 p-1 mr-8">
        <Image src={AskNinaIcon} alt="ask nina in purple" />
      </div>
      <div className="w-4/5" dangerouslySetInnerHTML={dialog.dialog} />
    </div>
  );
};

const returnUserResponse = (dialog: DialogProps) => {
  return (
    <div
      key={`dialog-${dialog.id}`}
      className="w-full flex items-start justify-center text-right p-4"
    >
      <div className="w-4/5" dangerouslySetInnerHTML={dialog.dialog} />
      <div className="relative w-12 h-12 p-1 ml-8">
        {/* <Image src={AskNinaIcon} alt="ask nina in purple" /> */}
        <div className="w-12 h-12 rounded-full bg-yellowGreen" />
      </div>
    </div>
  );
};
const Chat = ({}: ChatProps) => {
  const [conversation, setConversation] = useState<DialogProps[]>([
    initialChat,
    initialChatQuestion,
    initialChat,
    initialChatQuestion,
    initialChat,
    initialChatQuestion,
    initialChat,
    initialChatQuestion,
    initialChat,
    initialChatQuestion,
    initialChat,
  ]);

  const handleEnter = () => {
    console.log("add to conversation");
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex-1 pb-16">
        <div className="w-full flex items-center justify-center p-4 flex-1">
          <div className="relative w-12 h-12 p-1 mr-8">
            <Image src={AskNinaIcon} alt="ask nina in purple" />
          </div>
          <div className="w-4/5">Nina</div>
        </div>
        <div>
          {conversation?.length &&
            conversation.map((dialog) => {
              if (dialog.user == "nina") {
                return returnNinaResponse(dialog);
              } else {
                return returnUserResponse(dialog);
              }
            })}
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-white">
        <EnterQuery handleEnter={handleEnter} otherStyles={""} />
      </div>{" "}
    </div>
  );
};

export default Chat;
