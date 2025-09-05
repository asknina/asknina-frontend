"use client";

import { useAuthStore } from "@/providers/authStoreProvider";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DesktopLayout from "@/components/layout/DesktopLayout";
import MobileLayout from "@/components/layout/MobileLayout";

import { GoogleTagManager } from "@next/third-parties/google";
export const runtime = "edge";
export const dynamic = "force-dynamic";

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
        <GoogleTagManager gtmId={process.env.NEXT_GTM_ID || ""} />
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
