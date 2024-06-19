import React from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { IoPersonOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const ProfileButton = ({
  setIsMenuOpen,
}: {
  setIsMenuOpen?: (val: boolean) => void;
}) => {
  const router = useRouter();
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label="Profile"
      onClick={() => {
        if (setIsMenuOpen) setIsMenuOpen(false);
        router.push("/profile");
      }}
      otherStyles="w-full"
      icon={<IoPersonOutline />}
    />
  );
};

export default ProfileButton;
