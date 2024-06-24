"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} />

      <body className={inter.className}>
        <Providers>
          <main className="w-full h-screen flex text-primaryPurple bg-white">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
