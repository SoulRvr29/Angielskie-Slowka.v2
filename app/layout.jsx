import "./globals.css";
import "@/assets/styles/spinner.css";
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
        <main className="flex-grow flex flex-col px-4 py-2">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
