import React from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { TfiNewWindow } from "react-icons/tfi";

const HelpButton = () => {
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label="Help"
      onClick={() => console.log("helppp")}
      otherStyles="w-full"
      icon={<TfiNewWindow />}
    />
  );
};

export default HelpButton;
