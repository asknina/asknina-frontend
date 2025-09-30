"use client";
import React from "react";
import { useAuth } from "@/providers/authStoreProvider";
import LoggedInHomePage from "./LoggedInHomePage";
import LoadingComp from "./common/LoadingComp";

const HomePage = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <LoggedInHomePage /> : <LoadingComp />;
};

export default HomePage;
