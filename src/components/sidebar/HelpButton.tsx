import React from "react";
import AskNinaButton, { Variants } from "../common/Button";

const HelpButton = () => {
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label="Help"
      onClick={() => console.log("helppp")}
      otherStyles="w-full"
    />
  );
};

export default HelpButton;
