// This is now a SERVER component (no "use client")
import ProtectedLayoutClient from "./ProtectedLayoutClient";
import { GoogleTagManager } from "@next/third-parties/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
    </>
  );
}
