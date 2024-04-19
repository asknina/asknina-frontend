import React from "react";

const MainContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {children}
    </div>
  );
};

export default MainContainer;
