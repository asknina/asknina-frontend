"use client";
import React, { useState } from "react";
import Button from "@/components/common/Button";
import { createUser } from "@/lib/firebase/auth";

const SignInEmail = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleSignInClick = () => {
    if (email && password) {
      // TODO: validate email
      createUser(email, password);
    }
  };

  return (
    <div className="w-full p-4 space-y-2 flex flex-col items-center">
      <div className="flex flex-col items-center space-y-2 mb-6  w-full md:w-3/5">
        <div className="flex flex-row w-full">
          <div className="w-1/3">Email:</div>
          <input
            className="border rounded-sm border-primaryPurple flex-1 p-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-row w-full">
          <div className="w-1/3">Password:</div>
          <input
            className="border rounded-sm border-primaryPurple flex-1 p-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="">
        <Button
          label={"Sign In"}
          onClick={handleSignInClick}
          otherStyles="shadow-md w-40 text-center justify-center"
        />
      </div>
    </div>
  );
};

export default SignInEmail;
