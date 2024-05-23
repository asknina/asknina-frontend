"use client";
import React, {
  ButtonHTMLAttributes,
  Component,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";

interface AskNinaButtonProps {
  label: string;
  onClick: MouseEventHandler;
  variant?: Variants;
  icon?: ReactElement;
  otherStyles?: string;
  args?: ButtonHTMLAttributes<any>;
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
  args,
}: AskNinaButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={` ${
        variant == Variants.withBorder ? "border border-primaryPurple" : ""
      } text-sm text-left rounded-md p-2 inline-flex items-center space-x-2 ${otherStyles}`}
      {...args}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default AskNinaButton;
