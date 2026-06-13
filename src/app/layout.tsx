import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | NexGuild",
    default: "NexGuild — Earn by Contributing. Grow by Participating.",
  },
  description:
    "NexGuild is a community-driven contributor platform connecting skilled individuals with paid micro-tasks, surveys, content work, and managed projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
