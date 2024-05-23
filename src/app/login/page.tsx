"use client";
import React from "react";
import "firebaseui/dist/firebaseui.css";

import MainContainer from "@/components/common/MainContainer";
import Image from "next/image";
import askNinaLogo from "@public/logos/ask-nina-logo-400x400.png";
import SignInComponent from "@/components/auth/SignInComponent";

const Login = () => {
  return (
    <MainContainer styles="login-background">
      <div className="mb-4">
        <div className="flex relative">
          <Image src={askNinaLogo} alt={"ask-nina"} priority />
        </div>
        <div className="text-center font-display text-2xl">Welcome back!</div>
      </div>

      <SignInComponent />
    </MainContainer>
  );
};

export default Login;
