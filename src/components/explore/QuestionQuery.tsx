"use client";
import React, { useState } from "react";

const QuestionQuery = () => {
  const [question, setQuestion] = useState("");
  return (
    <div className="rounded-sm w-5/6 p-2 border-2 border-grey-300 bg-grey-100">
      <input
        className="bg-grey-100"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div>{/* {TODO: add icon to click and goooo to new page} */}</div>
    </div>
  );
};

export default QuestionQuery;
