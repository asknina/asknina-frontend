"use client";
import React from "react";
import QuestionPill from "./QuestionPill";
import RegenerateResponseButton from "./RegenerateResponseButton";
import QuestionQuery from "./QuestionQuery";

import { BsTextParagraph } from "react-icons/bs";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineTranslate } from "react-icons/md";
import { useRouter } from "next/navigation";
import EnterQuery from "./EnterQuery";

interface MainExploreProps {}

const MainExplore = ({}: MainExploreProps) => {
  const exploreQuestions = [
    "Explain transcription and translation",
    "Why can't we see things in a black hole",
  ];
  const resourceQuestions = [
    "What biology programs are there near me?",
    "Tell me about career paths in engineering",
    "How can I get lab experience nearby?",
  ];
  const connectQuestions = [
    "Can I be paired with a STEM bestie?",
    "Tell me more about the penpal program!",
    "Write a rap song",
  ];

  const router = useRouter();

  const handleEnter = () => router.push(`/chat`);

  return (
    <div className="flex flex-col h-inherit">
      <div className="w-full flex flex-row space-x-4 flex-1">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-start h-20">
            <span>
              <BsTextParagraph size={40} />
            </span>
            <h2 className="font-display">Explain</h2>
          </div>
          <div className="flex flex-col space-y-4">
            {exploreQuestions.map((question) => (
              <QuestionPill
                questionText={question}
                key={question.substring(0, 10)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-start h-20">
            <span>
              <LuPencilLine size={35} />
            </span>
            <h2 className="font-display">Find resources</h2>
          </div>
          <div className="flex flex-col space-y-4">
            {resourceQuestions.map((question) => (
              <QuestionPill
                questionText={question}
                key={question.substring(0, 10)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-start h-20">
            <span>
              <MdOutlineTranslate size={35} />
            </span>
            <h2 className="font-display">Connect with others</h2>
          </div>
          <div className="flex flex-col space-y-4">
            {connectQuestions.map((question) => (
              <QuestionPill
                questionText={question}
                key={question.substring(0, 10)}
              />
            ))}
          </div>
        </div>
      </div>

      <EnterQuery handleEnter={handleEnter} />
    </div>
  );
};

export default MainExplore;
