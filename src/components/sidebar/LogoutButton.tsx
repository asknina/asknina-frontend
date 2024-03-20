import React from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { LuLogOut } from "react-icons/lu";

const LogoutButton = () => {
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label="Log out"
      onClick={() => console.log("logout duh")}
      otherStyles="w-full"
      icon={<LuLogOut />}
    />
  );
};

export default LogoutButton;
