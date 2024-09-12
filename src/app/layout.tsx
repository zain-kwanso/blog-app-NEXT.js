import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Blog App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen h-full justify-between relative">
            <PublicHeader />

            <ToastContainer />
            <main>{children}</main>

            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
