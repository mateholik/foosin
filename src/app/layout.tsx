import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foosball Tracker",
  description: "Track 2v2 foosball matches, standings, and recent games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
