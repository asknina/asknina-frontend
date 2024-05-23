import React from "react";

interface UserResponseProps {
  message: any;
  index: number;
}
const UserResponse = ({ message, index }: UserResponseProps) => {
  return (
    <div className="w-full flex items-center justify-center text-right p-4">
      <div className="w-4/5 flex text-right break-words justify-end flex-wrap text-wrap">
        {message.content}
      </div>
      <div className="relative w-12 h-12 p-1 ml-4">
        {/* <Image src={AskNinaIcon} alt="ask nina in purple" /> */}
        <div className="w-12 h-12 rounded-full bg-yellowGreen" />
      </div>
    </div>
  );
};

export default UserResponse;
