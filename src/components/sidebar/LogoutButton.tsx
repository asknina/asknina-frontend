"use client";
import React from "react";
import AskNinaButton, { Variants } from "../common/Button";
import { LuLogOut } from "react-icons/lu";
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
