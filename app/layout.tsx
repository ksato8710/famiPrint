import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/Notification";

// Load the Noto Sans JP font with specified subsets and weights
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Regular, Medium, Bold
  display: "swap",
});

export const metadata: Metadata = {
  title: "FamiPrint",
  description: "家族のプリントを、いつでも、どこでも。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
