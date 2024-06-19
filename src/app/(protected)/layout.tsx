"use client";

import { useAuthStore } from "@/providers/authStoreProvider";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DesktopLayout from "@/components/layout/DesktopLayout";
import MobileLayout from "@/components/layout/MobileLayout";

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
      <>
        <div className="hidden md:block">
          <DesktopLayout>{children}</DesktopLayout>
        </div>
        <div className="block md:hidden">
          <MobileLayout>{children}</MobileLayout>
        </div>
      </>
    );
  }
}
