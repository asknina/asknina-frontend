"use client";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";

interface QuestionQueryProps {
  onEnter: (question: string) => void;
}
const QuestionQuery = ({ onEnter }: QuestionQueryProps) => {
  const [question, setQuestion] = useState("");

  const handleEnter = () => {
    onEnter(question);
    setQuestion("");
  };

  return (
    <div className="rounded-sm w-5/6 p-2 border-2 border-grey-300 bg-grey-100 inline-flex items-center space-x-2">
      <input
        className="bg-grey-100 flex-1 p-1"
        placeholder="Enter your question here"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div className={`${question ? "text-primaryPurple" : "text-grey-300"}`}>
        <button className="flex" disabled={!question} onClick={handleEnter}>
          <IoMdSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuestionQuery;
