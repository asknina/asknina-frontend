"use client";
import React from "react";

interface QuestionType {
  question: string;
  promptNumber: number;
}
interface QuestionPillProps {
  question: QuestionType;
  handleQuestionTextClick: Function;
}
const QuestionPill = ({
  question,
  handleQuestionTextClick,
}: QuestionPillProps) => {
  return (
    <div
      className="bg-grey-100 text-sm w-full h-16 flex items-center justify-center rounded-full text-center p-2 hover:cursor-pointer"
      onClick={() => handleQuestionTextClick(question)}
    >
      {question.question}
    </div>
  );
};

export default QuestionPill;
