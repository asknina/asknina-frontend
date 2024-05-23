import MainContainer from "@/components/common/MainContainer";
import Image from "next/image";
import React from "react";
import askNinaLogo from "@public/logos/ask-nina-logo-400x400.png";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import RegisterComponent from "@/components/auth/RegisterComponent";

const SignUp = () => {
  return (
    <MainContainer styles="login-background">
      <div>
        <div className="flex relative h-48 w-48">
          <Image src={askNinaLogo} alt={"ask-nina"} priority />
        </div>
        <div className="flex flex-row items-center space-x-4">
          <Link href="/login">
            <IoArrowBack size={20} />
          </Link>
          <div className="text-center font-display text-2xl">Register</div>
        </div>
      </div>
      <RegisterComponent />
    </MainContainer>
  );
};

export default SignUp;
