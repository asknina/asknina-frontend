"use client";
import React from "react";
import AskNinaButton from "../common/Button";
import { LuRefreshCw } from "react-icons/lu";

const RegenerateResponseButton = () => {
  return (
    <AskNinaButton
      label={"Regenerate response"}
      onClick={() => console.log("regenerate response")}
      otherStyles=" text-center"
      icon={<LuRefreshCw />}
    />
  );
};

export default RegenerateResponseButton;
