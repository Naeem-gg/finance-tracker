import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naeemgg's finance tracker",
  description: "Now tracking the daily personal finance made easy with Naeemgg's finance tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
        {/* <div className="absolute top-2 right-2">
          <ThemeSwitcher />
        </div> */}
        <Navbar />
          {children}
          </Providers>
          </body>
    </html>
  );
}
