"use client";
import React from "react";
import { IoMdSend } from "react-icons/io";

interface QuestionQueryProps {
  onSubmit: any;
  input: any;
  onChange: any;
}

const QuestionQuery = ({ onSubmit, input, onChange }: QuestionQueryProps) => {
  return (
    <form onSubmit={onSubmit} className="w-5/6">
      <div className="rounded-sm w-full p-2 border-2 border-grey-300 bg-grey-100 inline-flex items-center space-x-2">
        <input
          className="bg-grey-100 flex-1 p-1"
          placeholder="Enter your question here"
          value={input || ""}
          onChange={onChange}
        />
        <div className={`${input ? "text-primaryPurple" : "text-grey-300"}`}>
          <button type="submit" className="flex" disabled={!input}>
            <IoMdSend size={20} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default QuestionQuery;
