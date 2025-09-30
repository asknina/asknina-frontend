"use client";

import { useAuth } from "@/providers/authStoreProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DesktopLayout from "@/components/layout/DesktopLayout";
import MobileLayout from "@/components/layout/MobileLayout";

export default function ProtectedLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!user || !user.uid) {
    return null;
  }

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
