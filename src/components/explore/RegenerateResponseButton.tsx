"use client";
import React from "react";
import AskNinaButton from "../common/Button";
const RegenerateResponseButton = () => {
  return (
    <AskNinaButton
      label={"Regenerate response"}
      onClick={() => console.log("regenerate response")}
      otherStyles="w-1/5 text-center"
    />
  );
};

export default RegenerateResponseButton;
