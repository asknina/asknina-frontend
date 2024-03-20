import React from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { HiOutlineTrash } from "react-icons/hi";

const ClearConversationsButton = () => {
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label="Clear conversations"
      onClick={() => console.log("clear conversations duh")}
      otherStyles="w-full"
      icon={<HiOutlineTrash />}
    />
  );
};

export default ClearConversationsButton;
