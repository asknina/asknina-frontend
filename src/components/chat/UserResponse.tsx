import { useAuthStore } from "@/providers/authStoreProvider";
import React from "react";

interface UserResponseProps {
  message: any;
  index: number;
}
const UserResponse = ({ message, index }: UserResponseProps) => {
  const { user } = useAuthStore((state) => state);
  const initial = user?.displayName ? user.displayName[0] : user.email[0];
  return (
    <div className="w-full flex items-center justify-center text-right p-4">
      <div className="w-4/5 flex text-right break-words justify-end flex-wrap text-wrap">
        {message.content}
      </div>
      <div className="relative w-12 h-12 p-1 ml-4">
        {/* <Image src={AskNinaIcon} alt="ask nina in purple" /> */}
        <div className="w-12 h-12 rounded-full bg-yellowGreen flex items-center justify-center text-white">
          <span>{initial}</span>
        </div>
      </div>
    </div>
  );
};

export default UserResponse;
