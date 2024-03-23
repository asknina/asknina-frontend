"use client";
import React, { createContext, useState } from "react";

export const QuestionContext = createContext<any>(null);

interface ProvidersProps {
  children: any;
}
export function Providers({ children }: ProvidersProps) {
  const [initialQuestion, setInitialQuestion] = useState(null);

  return (
    <QuestionContext.Provider value={{ initialQuestion, setInitialQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
}
