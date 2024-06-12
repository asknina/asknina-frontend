"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import validator from "validator";
import { sendResetPasswordEmail } from "@/lib/firebase/auth";
import { useAuthStore } from "@/providers/authStoreProvider";

interface SignInEmailProps {
  handleSignIn: Function;
}

const SignInEmail = ({ handleSignIn }: SignInEmailProps) => {
  const { loginError } = useAuthStore((state) => state);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (email && password) {
      if (validator.isEmail(email)) {
        handleSignIn(email, password);
      } else {
        setError("Please enter a valid email address!");
        setShowErrorMessage(true);
      }
    }
  };

  const handlePasswordReset = async (e: any) => {
    e.preventDefault();
    if (email) {
      if (validator.isEmail(email)) {
        await sendResetPasswordEmail(email);
        setError(
          "If you input a valid email a password reset email will be sent to you"
        );
        setShowErrorMessage(true);
      }
    }
  };

  useEffect(() => {
    if (loginError) {
      setError(loginError);
      setShowErrorMessage(true);
    }
  }, [loginError]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setShowErrorMessage(false);
        setError("");
      }, 3000);
    }
  }, [error]);

  return (
    <div className="w-full space-y-2 flex flex-col items-center">
      <form className="flex flex-col items-center w-full md:w-3/5">
        <div className="flex flex-row w-full mb-4">
          <div className="w-1/3">Email:</div>
          <input
            className="border rounded-sm border-primaryPurple flex-1 p-1"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-row w-full mb-2">
          <div className="w-1/3">Password:</div>
          <div className="w-2/3 flex flex-col">
            <input
              className="border rounded-sm border-primaryPurple flex-1 p-1"
              value={password}
              type="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* TODO: Forgot password */}
            <button
              className="mt-2 text-xs text-left"
              onClick={handlePasswordReset}
            >
              Forgot password?
            </button>
          </div>
        </div>
        {showErrorMessage && <div className="text-red-500">{error}</div>}
        <div className="flex flex-row w-full justify-center items-center mb-2">
          <Button
            label={"Sign In"}
            onClick={(e) => handleLogin(e)}
            otherStyles="bg-primaryPurple text-white border-2 border-black rounded-md w-full p-1 shadow-xl text-center justify-center"
            args={{ type: "submit" }}
          />
        </div>
      </form>
    </div>
  );
};

export default SignInEmail;
