import "./globals.css";
import "@/assets/styles/spinner.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";
import { Suspense } from "react";
import Head from "next/head";

export const metadata = {
  title: "Angielskie-Słówka.v2",
  description: "Strona do nauki angielskich słówek",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className="bg-base-200">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon1.png" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="relative max-w-6xl mx-auto flex flex-col bg-base-100">
        <AuthProvider>
          <Suspense>
            <header className="sticky top-0 z-20">
              <Navbar />
            </header>
            <main className="flex-grow flex flex-col px-4 py-2 max-sm:px-0">
              {children}
            </main>
            <Footer />
            <div className="absolute w-full h-full top-0 left-0 bg-black -z-10 blur-3xl opacity-30"></div>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
