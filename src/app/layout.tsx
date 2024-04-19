"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { useAuth } from "@/components/auth/useAuth";
import Sidebar from "../components/common/Sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingComp from "@/components/common/LoadingComp";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn, isLoadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn]);
  return (
    <html lang="en">
      <body className={inter.className}>
        {isLoadingAuth ? (
          <LoadingComp />
        ) : (
          <div className="w-full h-screen flex text-primaryPurple bg-white">
            {isLoggedIn && <Sidebar />}
            <Providers>
              <main className="flex-1">{children}</main>
            </Providers>
          </div>
        )}
      </body>
    </html>
  );
};

export default RootLayout;
