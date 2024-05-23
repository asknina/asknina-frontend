"use client";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import SignUpEmail from "./SignUpEmail";

const RegisterComponent = () => {
  const { user } = useAuthStore((state) => state);
  const router = useRouter();
  // useEffect(() => {
  //   if (user) {
  //     router.push("/");
  //   }
  // }, [user]);
  return <SignUpEmail />;
};

export default RegisterComponent;
