"use client";
import React, { useState, useEffect } from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { LuLogOut } from "react-icons/lu";
import { onAuthStateChanged, signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/useAuth";

const LogoutButton = () => {
  const { isLoggedIn, handleSignOut } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    // route to login page
    router.push("/login");
  };

  const handleLogout = async () => {
    await handleSignOut();
  };
  return (
    <AskNinaButton
      variant={Variants.withoutBorder}
      label={isLoggedIn ? "Log out" : "Login"}
      onClick={isLoggedIn ? handleLogout : handleLogin}
      otherStyles="w-full"
      icon={<LuLogOut />}
    />
  );
};

export default LogoutButton;
