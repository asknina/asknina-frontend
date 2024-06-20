import React from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { TfiNewWindow } from "react-icons/tfi";
import Link from "next/link";

const HelpButton = ({
  setIsMenuOpen,
}: {
  setIsMenuOpen?: (val: boolean) => void;
}) => {
  return (
    <Link
      href={
        "https://anamita.notion.site/How-do-you-Ask-Nina-ca6fd1d7e252499a8446e46f8ee0918a"
      }
      target="_blank"
    >
      <AskNinaButton
        variant={Variants.withoutBorder}
        label="Help"
        onClick={() => {
          if (setIsMenuOpen) setIsMenuOpen(false);
        }}
        otherStyles="w-full"
        icon={<TfiNewWindow />}
      />
    </Link>
  );
};

export default HelpButton;
