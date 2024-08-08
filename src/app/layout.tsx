import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>AI Steel Weight Calculator</title>
        <link rel="icon" href="favicon.ico" sizes="any" />
        <meta name="title" content="AI Steel Weight Calculator" />
        <meta
          name="description"
          content="AI powered steel weight calculator by Metal Zone General Trading LLC"
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://calculator.metalzoneuae.com/"
        />
        <meta property="og:title" content="AI Steel Weight Calculator" />
        <meta
          property="og:description"
          content="AI powered steel weight calculator by Metal Zone General Trading LLC"
        />
        <meta
          property="og:image"
          content="https://calculator.metalzoneuae.com/ss.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://calculator.metalzoneuae.com/"
        />
        <meta property="twitter:title" content="AI Steel Weight Calculator" />
        <meta
          property="twitter:description"
          content="AI powered steel weight calculator by Metal Zone General Trading LLC"
        />
        <meta
          property="twitter:image"
          content="https://calculator.metalzoneuae.com/ss.png"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
