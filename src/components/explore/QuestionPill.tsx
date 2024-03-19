"use client";
import React from "react";

interface QuestionPillProps {
  questionText: string;
}
const QuestionPill = ({ questionText }: QuestionPillProps) => {
  return (
    <div
      className="bg-grey-100 text-sm w-full h-12 flex items-center justify-center rounded-full text-center p-2 hover:cursor-pointer"
      onClick={() => console.log("clicked question")}
    >
      {questionText}
    </div>
  );
};

export default QuestionPill;
