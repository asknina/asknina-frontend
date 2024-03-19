import React from "react";
import AskNinaButton, { Variants } from "../common/Button";

const LogoutButton = () => {
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label="Log out"
      onClick={() => console.log("logout duh")}
      otherStyles="w-full"
    />
  );
};

export default LogoutButton;
