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

  const handleEnter = async (e: any) => {
    e.preventDefault();
    await handleCreateNewChat(
      initialQuestion.question,
      initialQuestion.promptNumber
    );
    router.push(`/chat`);
  };

  const handleCreateNewChat = async (
    question: string,
    promptNumber: number
  ) => {
    setInitialQuestion({ question, promptNumber });
    const initialMessages = [
      createMessage({
        role: SystemRoles.SYSTEM,
        content: systemPrompts[promptNumber],
      }),
      createMessage({ role: SystemRoles.USER, content: question }),
    ];
    await createConversation(user.uid, initialMessages, question);
  };

  const handleQuestionTextClick = async (question: any) => {
    const matchedConvo = findPromptConversation(question.question);
    if (matchedConvo) {
      setCurrentConversation(matchedConvo.conversationId);
    } else {
      await handleCreateNewChat(question.question, question.promptNumber);
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

  const questionList = [
    {
      title: "Discover",
      icon: <FaRegLightbulb size={30} />,
      questions: discoverQuestions,
    },
    {
      title: "Brainstorm",
      icon: <LiaConnectdevelop size={35} />,
      questions: brainstormQuestions,
    },
    {
      title: "Connect",
      icon: <SiNextcloud size={35} />,
      questions: connectQuestions,
    },
  ];
  return (
    <div className="flex flex-col h-inherit overflow-y-auto relative pb-36 md:pb-0">
      <div className="w-full flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-1">
        {questionList.map(({ title, icon, questions }) => {
          return (
            <div
              className="flex flex-col items-center w-full md:w-1/3 px-0.5"
              key={title}
            >
              <div className="flex flex-col items-center justify-center h-20">
                <span>{icon}</span>
                <h2 className="font-display">{title}</h2>
              </div>
              <div className="flex flex-col space-y-4 w-full">
                {questions.map((question) => (
                  <QuestionPill
                    key={question.question.substring(0, 10)}
                    question={question}
                    handleQuestionTextClick={handleQuestionTextClick}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:relative bg-white shadow-sm md:shadow-none">
        <EnterQuery
          showReload={false}
          onSubmit={handleEnter}
          input={initialQuestion.question}
          onChange={handleQueryChange}
          otherStyles="px-4"
        />
      </div>
    </div>
  );
};

export default MainExplore;
