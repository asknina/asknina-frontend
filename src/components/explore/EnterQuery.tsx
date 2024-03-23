import React, { MouseEventHandler } from "react";
import RegenerateResponseButton from "./RegenerateResponseButton";
import QuestionQuery from "./QuestionQuery";

interface EnterQueryProps {
  handleEnter: (question: string) => void;
  otherStyles?: string;
}
const EnterQuery = ({ handleEnter, otherStyles = "" }: EnterQueryProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-2 p-2 ${otherStyles}`}
    >
      <RegenerateResponseButton />
      <QuestionQuery onEnter={handleEnter} />

      <p className="text-xs text-grey-200">
        Ask Nina AI. Our goal is to connect girls with STEM and entrepreneurial
        resources. Your feedback will help us improve.
      </p>
    </div>
  );
};

export default EnterQuery;
