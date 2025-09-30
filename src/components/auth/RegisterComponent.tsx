"use client";
import { useAuth } from "@/providers/authStoreProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import SignUpEmail from "./SignUpEmail";

const RegisterComponent = () => {
  const { user } = useAuth();
  const router = useRouter();
  // useEffect(() => {
  //   if (user) {
  //     router.push("/");
  //   }
  // }, [user]);
  return <SignUpEmail />;
};

export default RegisterComponent;
