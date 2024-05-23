"use client";
import React, { useState, useEffect } from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { LuLogOut } from "react-icons/lu";
import { onAuthStateChanged, signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/authStoreProvider";

const LogoutButton = () => {
  const { isLoggedIn, logout } = useAuthStore((state) => state);
  const router = useRouter();

  const handleLogin = () => {
    // route to login page
    logout();
    router.push("/login");
  };

  const handleLogout = async () => {
    logout();
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
