"use client";

import Link from "next/link";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import ThemeChange from "./ThemeChange";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className=" flex justify-between w-full max-md:flex-col bg-base-300 border-b-2 border-b-primary/50 z-10">
      <Link href="/">
        <h1 className="absolute top-1 max-md:top-0 max-md:pb-2 max-md:relative text-center left-1/2 transform -translate-x-1/2 text-2xl font-bold mt-1">
          Angielskie Słówka<span className="text-sm text-primary">.v2</span>
        </h1>
      </Link>
      {/* Hamburger button */}

      <label className="btn btn-circle swap swap-rotate hidden max-sm:grid absolute right-1 top-1">
        {/* this hidden checkbox controls the state */}
        <input type="checkbox" onClick={() => setIsMenuOpen((prev) => !prev)} />

        {/* hamburger icon */}
        <svg
          className="swap-off fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
        </svg>

        {/* close icon */}
        <svg
          className="swap-on fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
        </svg>
      </label>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed top-11 left-0 bg-black/50 w-screen h-screen z-10">
          <div
            className="flex-col bg-base-100 text-center hidden max-sm:flex text-xl border-y-2 border-secondary"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link
              className={`${
                pathname === "/zestawy" && "btn-success"
              } border-b-2  border-b-secondary py-2`}
              href="/zestawy"
            >
              zestawy
            </Link>
            <Link
              className={`${
                pathname === "/ustawienia" && "btn-success"
              } border-b-2  border-b-secondary py-2`}
              href="/ustawienia"
            >
              ustawienia
            </Link>
            <Link href="/about" className=" py-2">
              o stronie
            </Link>
          </div>
        </div>
      )}
      {/* Desktop menu */}
      <div className="flex justify-between items-center w-full p-3 max-md:p-2 max-sm:hidden">
        <div className="flex gap-4 items-center font-semibold ">
          <Link href="/" className="flex items-center gap-2">
            <FaHome className={`${pathname === "/" ? "fill-success" : ""}`} />
          </Link>
          <Link
            className={`${
              pathname === "/zestawy" && "btn-success"
            } btn btn-xs btn-soft`}
            href="/zestawy"
          >
            zestawy
          </Link>
          <Link
            className={`${
              pathname === "/ustawienia" && "btn-success"
            } btn btn-xs btn-soft`}
            href="/ustawienia"
          >
            ustawienia
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeChange />
          <Link href="/about">
            <FaInfoCircle
              className={`${pathname === "/about" ? "fill-success" : ""}`}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
