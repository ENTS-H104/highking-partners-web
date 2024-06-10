import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Highking Partner",
  description: "Highking Partner Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Highking Partner</title>
        <meta name="description" content="Highking Partner Dashboard" />
        <link rel="icon" href="/logo_highking_fill.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
