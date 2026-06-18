import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth API Playground",
  description: "A simple frontend for learning authentication API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
