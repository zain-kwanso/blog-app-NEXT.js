"use client";

import "./globals.css";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientHeader from "@/components/ClientHeader";
import ClientInterceptorSetup from "@/components/responseInterceptor";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "./lib/apolloClient";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ApolloProvider client={createApolloClient()}>
            <div className="flex flex-col min-h-screen h-full justify-between relative">
              <ClientInterceptorSetup />
              <ClientHeader />

              <ToastContainer />
              <main>{children}</main>

              <Footer />
            </div>
          </ApolloProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
