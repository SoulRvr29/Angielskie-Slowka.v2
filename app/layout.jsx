import "./globals.css";
import "@/assets/styles/spinner.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";

export const metadata = {
  title: "Angielskie-Słówka.v2",
  description: "Strona do nauki angielskich słówek",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en" data-theme="dark" className="bg-base-200">
        <body className=" max-w-6xl mx-auto flex flex-col bg-base-100">
          <header>
            <Navbar />
          </header>
          <main className="flex-grow flex flex-col px-4 py-2 max-sm:px-0">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
