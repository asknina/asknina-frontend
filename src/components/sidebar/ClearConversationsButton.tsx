import React from "react";
import AskNinaButton, { Variants } from "../common/Button";

const ClearConversationsButton = () => {
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label="Clear conversations"
      onClick={() => console.log("clear conversations duh")}
      otherStyles="w-full"
    />
  );
};

export default ClearConversationsButton;
