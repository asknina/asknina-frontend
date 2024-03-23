"use client";
import React, { useContext } from "react";
import QuestionPill from "./QuestionPill";
import RegenerateResponseButton from "./RegenerateResponseButton";
import QuestionQuery from "./QuestionQuery";

import { FaRegLightbulb } from "react-icons/fa6";
import { LiaConnectdevelop } from "react-icons/lia";
import { SiNextcloud } from "react-icons/si";

import { MdOutlineTranslate } from "react-icons/md";
import { useRouter } from "next/navigation";
import EnterQuery from "./EnterQuery";
import { QuestionContext } from "@/app/providers";

interface MainExploreProps {}

const MainExplore = ({}: MainExploreProps) => {
  const discoverQuestions = [
    "Are there STEM careers that combine my love for math and soccer?",
    "What are the different career paths within the field of quantum computing?",
    "A rap song that explains where can I explore STEM careers",
  ];
  const brainstormQuestions = [
    "How can I use STEM to help my neighborhood?",
    "What is a good passion project for dance and STEM?",
    "Tips to stay motivated ",
  ];
  const connectQuestions = [
    "What biology programs are there near me?",
    "What kinds of STEM extracurriculars are good for high schoolers?",
  ];

  const router = useRouter();
  const { setInitialQuestion } = useContext(QuestionContext);

  const handleEnter = (question: string) => {
    setInitialQuestion(question);
    router.push(`/chat`);
  };

  const handleQuestionTextClick = (questionText: string) => {
    setInitialQuestion(questionText);

    router.push("/chat");
  };

  return (
    <div className="flex flex-col h-inherit">
      <div className="w-full flex flex-row space-x-4 flex-1">
        <div className="flex flex-col items-center w-1/3">
          <div className="flex flex-col items-center justify-center h-20">
            <span>
              <FaRegLightbulb size={35} />
            </span>
            <h2 className="font-display">Discover</h2>
          </div>
          <div className="flex flex-col space-y-4">
            {discoverQuestions.map((question) => (
              <QuestionPill
                key={question.substring(0, 10)}
                questionText={question}
                handleQuestionTextClick={handleQuestionTextClick}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center w-1/3">
          <div className="flex flex-col items-center justify-center h-20">
            <span>
              <LiaConnectdevelop size={35} />
            </span>
            <h2 className="font-display">Brainstorm</h2>
          </div>
          <div className="flex flex-col space-y-4">
            {brainstormQuestions.map((question) => (
              <QuestionPill
                key={question.substring(0, 10)}
                questionText={question}
                handleQuestionTextClick={handleQuestionTextClick}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center w-1/3">
          <div className="flex flex-col items-center justify-center h-20">
            <span>
              <SiNextcloud size={35} />
            </span>
            <h2 className="font-display">Connect</h2>
          </div>
          <div className="flex flex-col space-y-4">
            {connectQuestions.map((question) => (
              <QuestionPill
                key={question.substring(0, 10)}
                questionText={question}
                handleQuestionTextClick={handleQuestionTextClick}
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
