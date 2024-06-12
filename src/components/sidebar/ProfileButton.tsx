import React from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { TfiNewWindow } from "react-icons/tfi";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
  const router = useRouter();
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label="Profile"
      onClick={() => router.push("/profile")}
      otherStyles="w-full"
      icon={<TfiNewWindow />}
    />
  );
};

export default ProfileButton;
