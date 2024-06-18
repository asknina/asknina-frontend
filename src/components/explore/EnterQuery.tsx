import React, { MouseEventHandler } from "react";
import RegenerateResponseButton from "./RegenerateResponseButton";
import QuestionQuery from "./QuestionQuery";

interface EnterQueryProps {
  onSubmit: any;
  input: any;
  onChange: any;
  reload?: any;
  showReload?: boolean;
  otherStyles?: string;
}
const EnterQuery = ({
  onSubmit,
  input,
  onChange,
  reload,
  showReload = true,
  otherStyles = "",
}: EnterQueryProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-2 p-2 ${otherStyles}`}
    >
      {showReload && <RegenerateResponseButton reload={reload} />}
      <QuestionQuery onSubmit={onSubmit} input={input} onChange={onChange} />

      <p className="text-xs text-grey-200">
        Ask Nina AI. Our mission to empower teen girls to explore STEM careers.
        Your feedback will help us improve.
      </p>
    </div>
  );
};

export default EnterQuery;
