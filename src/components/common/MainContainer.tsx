import React from "react";

const MainContainer = ({
  styles = "",
  children,
}: {
  styles?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full ${styles}`}
    >
      {children}
    </div>
  );
};

export default MainContainer;
