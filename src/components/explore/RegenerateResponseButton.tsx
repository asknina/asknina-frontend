"use client";
import React from "react";
import AskNinaButton from "../common/Button";
import { LuRefreshCw } from "react-icons/lu";

interface RegenerateResponseButtonProps {
  reload: any;
}
const RegenerateResponseButton = ({
  reload,
}: RegenerateResponseButtonProps) => {
  return (
    <AskNinaButton
      label={"Regenerate Response"}
      onClick={() => {
        reload();
      }}
      otherStyles=" text-center"
      icon={<LuRefreshCw />}
    />
  );
};

export default RegenerateResponseButton;
