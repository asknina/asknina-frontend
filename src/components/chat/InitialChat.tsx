"use client";
import React from "react";
import AskNinaIcon from "../../../public/logos/antenna-90x90.png";
import Image from "next/image";
import { Remark } from "react-remark";

const InitialChat = () => {
  return (
    <div className="w-full flex flex-row justify-center bg-grey-100 border border-grey-300 p-4">
      <div className="flex flex-row max-w-screen-lg">
        <div className="relative w-12 h-12 p-1 mr-4 self-start">
          <Image
            src={AskNinaIcon}
            alt="ask nina in purple"
            className="shadow-md"
          />
        </div>
        <div className="flex-1 break-words">
          <Remark>
            With Ask Nina, you can pose questions and browse resources to expand
            your knowledge of STEM careers. What would you like to know? Ask
            away!
          </Remark>
        </div>
      </div>
    </div>
  );
};

export default InitialChat;
