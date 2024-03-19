"use client";
import React, { MouseEventHandler } from "react";

interface AskNinaButtonProps {
  label: string;
  onClick: MouseEventHandler;
  variant?: Variants;
  icon?: any;
  otherStyles?: string;
}

export enum Variants {
  withBorder = "withBorder",
  withoutBorder = "withoutBorder",
}
const AskNinaButton = ({
  label,
  onClick,
  variant = Variants.withBorder,
  icon,
  otherStyles,
}: AskNinaButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={` ${
        variant == Variants.withBorder ? "border border-primaryPurple" : ""
      } text-sm text-left rounded-md p-2 ${otherStyles}`}
    >
      {label}
    </button>
  );
};

export default AskNinaButton;
