import React, { useEffect } from "react";
import SignInEmail from "@/components/auth/SignInEmail";
import Link from "next/link";
import Button from "@/components/common/Button";

import { useAuth } from "@/providers/authStoreProvider";
import { useRouter } from "next/navigation";
import { TfiNewWindow } from "react-icons/tfi";

const SignInComponent = () => {
  const { user, loginWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.uid) {
      router.push("/home");
    }
  }, [user]);

  const handleGoogleSignInClick = async (event: any) => {
    event.preventDefault();
    await loginWithGoogle().then(() => router.push("/home"));
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    await loginWithEmail(email, password).then(() => router.push("/home"));
  };

  return (
    <div className="flex flex-col items-center w-full space-y-2 mt-2">
      <div className="w-full max-w-screen-sm flex flex-col items-center">
        <SignInEmail handleSignIn={handleEmailSignIn} />
        <div className="mb-4 w-full md:w-3/5">
          <Button
            label={"Sign In with Google"}
            onClick={handleGoogleSignInClick}
            otherStyles="bg-primaryPurple text-white border-2 border-black rounded-md w-full p-1 shadow-xl text-center justify-center"
          />
        </div>
      </div>

      <div className="text-sm">
        By continuing you agree to our{" "}
        <Link
          href="https://www.asknina.ai/terms-and-conditions"
          target="_blank"
          className="inline-flex space-x-4"
        >
          <TfiNewWindow size={16} />
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.asknina.ai/privacy-policy"
          target="_blank"
          className="inline-flex space-x-4"
        >
          {" "}
          <TfiNewWindow size={16} />
          Privacy Policy
        </Link>
        .
      </div>

      <div className="text-normal">
        Don&apos;t have an account? <Link href="/register"> Register here</Link>
      </div>
    </div>
  );
};

export default SignInComponent;
