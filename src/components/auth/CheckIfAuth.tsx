"use client";
import { useAuthStore } from "@/providers/authStoreProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LoadingComp from "../common/LoadingComp";

const CheckIfAuth = () => {
  const { user } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (user && user.uid) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, []);
  return <LoadingComp />;
};

export default CheckIfAuth;
