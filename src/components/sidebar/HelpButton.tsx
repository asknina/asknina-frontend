import React from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { TfiNewWindow } from "react-icons/tfi";

const HelpButton = ({
  setIsMenuOpen,
}: {
  setIsMenuOpen?: (val: boolean) => void;
}) => {
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label="Help"
      onClick={() => {
        console.log("helppp");
        if (setIsMenuOpen) setIsMenuOpen(false);
      }}
      otherStyles="w-full"
      icon={<TfiNewWindow />}
    />
  );
};

export default HelpButton;
