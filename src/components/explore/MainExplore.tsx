import React from "react";
import QuestionPill from "./QuestionPill";
import RegenerateResponseButton from "./RegenerateResponseButton";
import QuestionQuery from "./QuestionQuery";

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
  return (
    <div className="flex flex-col ">
      <div className="w-full flex flex-row space-x-4">
        <div className="flex flex-col items-center">
          {/* TODO: icon here */}
          <h2 className="font-display">Explain</h2>
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
          {/* TODO: icon here */}
          <h2 className="font-display">Find resources</h2>
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
          {/* TODO: icon here */}
          <h2 className="font-display">Connect with others</h2>
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

      <div className="flex-1 flex flex-col items-center justify-center space-y-2 mt-12">
        <RegenerateResponseButton />
        <QuestionQuery />

        <p className="text-xs text-grey-200">
          Ask Nina AI. Our goal is to connect girls with STEM and
          entrepreneurial resources. Your feedback will help us improve.
        </p>
      </div>
    </div>
  );
};

export default MainExplore;
