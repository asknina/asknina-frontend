"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import DropdownComp from "../common/Dropdown";
import { Option } from "react-dropdown";
import validator from "validator";
import Link from "next/link";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useRouter } from "next/navigation";

interface SignUpEmailProps {}

const ageOptions: Option[] = [];

const addGradYears = () => {
  const currentYear = new Date().getFullYear();
  const allYears = new Array(8).fill(1).map((_, i) => i + currentYear);
  allYears.forEach((year) => {
    const value = `Class of ${year.toString()}`;
    ageOptions.push({ label: value, value });
  });
};

addGradYears();
ageOptions.push(
  { label: "None, I'm in College", value: "College" },
  { label: "None, I'm an Educator", value: "Educator" },
  { label: "None, I'm a Parent", value: "Parent" }
);

const SignUpEmail = ({}: SignUpEmailProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState(ageOptions[0]);
  const [pronouns, setPronouns] = useState<string>("");

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showBoxErrorMessage, setShowBoxErrorMessage] = useState(false);

  const { createUser } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (showErrorMessage) {
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  }, [showErrorMessage]);

  useEffect(() => {
    if (showBoxErrorMessage) {
      setTimeout(() => {
        setShowBoxErrorMessage(false);
      }, 3000);
    }
  }, [showBoxErrorMessage]);

  const handleSignInClick = () => {
    if (agreed) {
      if (validator.isEmail(email)) {
        if (email && password && username && pronouns && dateOfBirth) {
          handleSignUp();
        } else {
          setError("Please fill out all of the fields above.");
          setShowErrorMessage(true);
        }
      } else {
        setError("Please enter a valid email");
        setShowErrorMessage(true);
      }
    } else {
      setShowBoxErrorMessage(true);
    }
  };

  const handleAgeSelect = (value: any) => {
    setDateOfBirth(value);
  };

  const signUpValues = [
    {
      value: email,
      onChange: (e: any) => setEmail(e.target.value),
      label: "Email:",
      type: "email",
    },
    {
      value: username,
      onChange: (e: any) => setUsername(e.target.value),
      label: "Username:",
      type: "text",
    },
    {
      value: password,
      onChange: (e: any) => setPassword(e.target.value),
      label: "Password:",
      type: "current-password",
    },
    {
      value: pronouns,
      onChange: (e: any) => setPronouns(e.target.value),
      label: "Pronouns:",
      type: "text",
    },
  ];

  const handleSignUp = async () => {
    await createUser(email, password, username, dateOfBirth.value, pronouns)
      .then(() => router.push("/home"))
      .catch((e) => {
        setError(e);
      });
  };

  return (
    <div className="w-full md:w-3/5 p-4 md:p-0 flex flex-col items-center">
      <form className="flex flex-col items-center space-y-4 w-full p-2 md:w-3/5">
        {signUpValues.map((param) => (
          <div className="flex flex-row w-full items-end" key={param.label}>
            <div className="w-1/3">{param.label}</div>
            <input
              className="border-b rounded-sm border-primaryPurple flex-1 p-1"
              value={param.value}
              onChange={param.onChange}
              type={param.type}
            />
          </div>
        ))}

        <div className="flex flex-row w-full items-end">
          <div className="w-1/3">I&apos;m in the:</div>
          <DropdownComp
            options={ageOptions}
            onSelect={handleAgeSelect}
            style="flex-1 p-0"
          />
        </div>
        {showErrorMessage && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="my-6 flex flex-row">
          <div className="m-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
          </div>
          <p className="text-sm">
            By checking this box and clicking on &quot;Sign Up&quot; you agree
            that you are 13 years or older, and you agree to the{" "}
            <Link href="https://www.asknina.ai/terms-and-conditions">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="https://www.asknina.ai/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </form>

      {showBoxErrorMessage && (
        <div className="text-red-500 text-sm">
          Please check the required box
        </div>
      )}

      <div className="">
        <Button
          label={"Sign Up"}
          onClick={handleSignInClick}
          otherStyles="bg-primaryPurple text-white border-2 border-black rounded-md w-40 p-1 shadow-xl text-center justify-center"
        />
      </div>
    </div>
  );
};

export default SignUpEmail;
