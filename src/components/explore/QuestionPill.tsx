"use client";
import React from "react";

interface QuestionPillProps {
  questionText: string;
  handleQuestionTextClick: Function;
}
const QuestionPill = ({
  questionText,
  handleQuestionTextClick,
}: QuestionPillProps) => {
  return (
    <div
      className="bg-grey-100 text-sm w-full h-16 flex items-center justify-center rounded-full text-center p-2 hover:cursor-pointer"
      onClick={() => handleQuestionTextClick(questionText)}
    >
      {questionText}
    </div>
  );
};

export default QuestionPill;
