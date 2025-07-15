import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Netflex",
  description: "A online movie website",
};

export default function RootLayout(
  props: Readonly<{
    modal: React.ReactNode;
    children: React.ReactNode;
  }>
) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable} antialiased dark`}
    >
      <body>
        <Providers>
          <Suspense>{props.modal}</Suspense>
          <Suspense>{props.children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
