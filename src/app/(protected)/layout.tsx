"use client";

import Sidebar from "@/components/common/Sidebar";
import { useAuthStore } from "@/providers/authStoreProvider";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, user } = useAuthStore((state) => state);

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn]);

  if (user && user.uid) {
    return (
      <div className="flex h-screen w-full">
        <Sidebar />

        <div className="h-screen flex-1 flex flex-col relative">{children}</div>
      </div>
    );
  }
}
