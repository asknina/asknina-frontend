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
import { useChatStore } from "@/providers/chatStoreProvider";
import { createNewConversation } from "@/lib/firebase/data/chats";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useConversationStore } from "@/providers/conversationStoreProvider";
import { MessageType, createMessage } from "@axflow/models/shared";
import { Conversation, SystemRoles } from "@/types/chat";
import { systemPrompts } from "@/lib/util/constants";
import { getRandomInteger } from "@/lib/util/utilities";

interface MainExploreProps {}

const discoverQuestions = [
  {
    question:
      "Are there STEM careers that combine my love for math and soccer?",
    promptNumber: 0,
  },
  {
    question:
      "What are the different career paths within the field of quantum computing?",
    promptNumber: 0,
  },
  {
    question: "A rap song that explains where can I explore STEM careers",
    promptNumber: 0,
  },
];
const brainstormQuestions = [
  {
    question: "How can I use STEM to help my neighborhood?",
    promptNumber: 1,
  },
  {
    question: "What is a good passion project for dance and STEM?",
    promptNumber: 1,
  },
  { question: "Tips to stay motivated ", promptNumber: 1 },
];
const connectQuestions = [
  { question: "What biology programs are there near me?", promptNumber: 2 },
  {
    question:
      "What kinds of STEM extracurriculars are good for high schoolers?",
    promptNumber: 2,
  },
  {
    question: "How can I get a summer internship in STEM?",
    promptNumber: 2,
  },
];
const MainExplore = ({}: MainExploreProps) => {
  const router = useRouter();
  const { user } = useAuthStore((state) => state);
  const { initialQuestion, setInitialQuestion } = useChatStore(
    (state) => state
  );
  const { createConversation, conversations, setCurrentConversation } =
    useConversationStore((state) => state);

  const handleEnter = (e: any) => {
    e.preventDefault();
    router.push(`/chat`);
  };

  const handleQuestionTextClick = async (question: any) => {
    const matchedConvo = findPromptConversation(question.question);
    if (matchedConvo) {
      setCurrentConversation(matchedConvo.conversationId);
    } else {
      setInitialQuestion(question);
      const { promptNumber } = question;
      const initialMessages = [
        createMessage({
          role: SystemRoles.SYSTEM,
          content: systemPrompts[promptNumber],
        }),
        createMessage({ role: SystemRoles.USER, content: question.question }),
      ];
      await createConversation(user.uid, initialMessages, question.question);
    }
    router.push("/chat");
  };

  const findPromptConversation = (
    questionText: string
  ): Conversation | undefined => {
    return conversations.find((convo) => convo.promptQuestion == questionText);
  };

  const handleQueryChange = (e: any) => {
    e.preventDefault();
    setInitialQuestion({
      promptNumber: getRandomInteger(systemPrompts.length),
      question: e.target.value,
    });
  };

  return (
    <div className="flex flex-col h-inherit">
      <div className="w-full flex flex-row space-x-4 flex-1">
        <div className="flex flex-col items-center w-1/3">
          <div className="flex flex-col items-center justify-center h-20">
            <span>
              <FaRegLightbulb size={30} />
            </span>
            <h2 className="font-display">Discover</h2>
          </div>
          <div className="flex flex-col space-y-4">
            {discoverQuestions.map((question) => (
              <QuestionPill
                key={question.question.substring(0, 10)}
                question={question}
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
                key={question.question.substring(0, 10)}
                question={question}
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
                key={question.question.substring(0, 10)}
                question={question}
                handleQuestionTextClick={handleQuestionTextClick}
              />
            ))}
          </div>
        </div>
      </div>

      <EnterQuery
        showReload={false}
        onSubmit={handleEnter}
        input={initialQuestion.question}
        onChange={handleQueryChange}
      />
    </div>
  );
};

export default MainExplore;
