"use client";

import Sidebar from "@/components/common/Sidebar";
import { useAuthStore } from "@/providers/authStoreProvider";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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
      <PanelGroup autoSaveId="example" direction="horizontal">
        <Panel defaultSize={30} maxSize={40} minSize={20}>
          <Sidebar />
        </Panel>
        <PanelResizeHandle />
        <Panel>{children}</Panel>
      </PanelGroup>
    );
  }
}
