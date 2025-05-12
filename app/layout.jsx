import "./globals.css";
import "@/assets/styles/spinner.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";
import { Suspense } from "react";

export const metadata = {
  title: "Angielskie-Słówka.v2",
  description: "Strona do nauki angielskich słówek",
};

export default function RootLayout({ children }) {
  return (
    <Suspense>
      <AuthProvider>
        <html lang="en" data-theme="dark" className="bg-base-200">
          <body className="relative max-w-6xl mx-auto flex flex-col bg-base-100">
            <header className="sticky top-0 ">
              <Navbar />
            </header>
            <main className="flex-grow flex flex-col px-4 py-2 max-sm:px-0">
              {children}
            </main>
            <Footer />
            <div className="absolute w-full h-full top-0 left-0 bg-black -z-10 blur-3xl opacity-30"></div>
          </body>
        </html>
      </AuthProvider>
    </Suspense>
  );
}
