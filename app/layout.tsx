import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamiPrint",
  description: "Family photo printing management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}