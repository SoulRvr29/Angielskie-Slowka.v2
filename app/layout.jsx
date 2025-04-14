import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Angielskie-Słówka.v2",
  description: "Strona do nauki angielskich słówek",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen max-w-6xl mx-auto flex flex-col">
        <header>
          <Navbar />
        </header>
        <main className="flex-grow px-4 py-2 ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
