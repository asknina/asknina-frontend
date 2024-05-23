"use client";
import React from "react";
import { useAuthStore } from "@/providers/authStoreProvider";
import LoggedInHomePage from "./LoggedInHomePage";
import LoadingComp from "./common/LoadingComp";

const HomePage = () => {
  const { isLoggedIn } = useAuthStore((state) => state);

  return isLoggedIn ? <LoggedInHomePage /> : <LoadingComp />;
};

export default HomePage;
