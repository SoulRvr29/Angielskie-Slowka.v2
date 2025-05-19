"use client";

import Link from "next/link";
import {
  FaHome,
  FaInfoCircle,
  FaList,
  FaAdjust,
  FaUser,
  FaGoogle,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import ThemeChange from "./ThemeChange";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, use } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [mobileTheme, setMobileTheme] = useState();
  const [providers, setProviders] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mute, setMute] = useState(false);

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const pathname = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
    const muteCheck = localStorage.getItem("mute");
    if (muteCheck) {
      setMute(JSON.parse(muteCheck));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mute", JSON.stringify(mute));
  }, [mute]);

  useEffect(() => {
    if (!isMobileMenuOpen) setIsChecked(false);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setMobileTheme(document.querySelector("html").getAttribute("data-theme"));
  }, []);

  return (
    <nav className="flex justify-between w-full max-md:flex-col bg-base-300 border-b-2 border-b-primary/50 z-20">
      <Link href="/">
        <h1 className="absolute top-1 max-md:top-0 max-md:pb-2 max-md:relative text-center left-1/2 transform -translate-x-1/2 text-2xl font-bold mt-1">
          Angielskie Słówka<span className="text-sm text-primary">.v2</span>
        </h1>
      </Link>
      {/* <Link href="/" className="absolute left-2 top-[11px]">
        <FaHome
          size={22}
          className={`${pathname === "/" ? "fill-success" : ""}`}
        />
      </Link> */}
      {/* Hamburger button */}
      <label className="btn btn-circle swap swap-rotate hidden max-sm:grid absolute right-1 top-1 scale-90">
        {/* this hidden checkbox controls the state */}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          onClick={() => {
            setIsMobileMenuOpen((prev) => !prev);
          }}
        />

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
      {isMobileMenuOpen && (
        <>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-black/50 backdrop-blur-xs fixed left-0 top-11 w-screen h-screen z-10"
          ></div>
          <div className="fixed top-11 left-0 w-screen z-10 font-semibold ">
            <div
              className="flex-col bg-base-100 text-center hidden max-sm:flex text-xl border-y-2 border-info"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {/* Logowanie Button */}
              {session ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="collapse border-b-2 border-b-info rounded-none "
                >
                  <input type="checkbox" className="" />
                  <div className="collapse-title font-semibold flex justify-center gap-2 ml-2">
                    <Image
                      className="size-7 border-2 border-primary rounded-full"
                      src={profileImage}
                      width={40}
                      height={40}
                      alt="profile image"
                    />

                    {session.user.name}
                  </div>
                  <div className="flex flex-col collapse-content bg-base-100 text-center ">
                    <div className=" py-2">
                      <Link
                        href="/profil"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Mój profil
                      </Link>
                    </div>
                    <div className="border-y border-y-info py-2">
                      <Link
                        href={{
                          pathname: "/zestawy",
                          query: { type: "private" },
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Moje słówka
                      </Link>
                    </div>
                    <div className=" py-2">
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                        }}
                      >
                        Wyloguj
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {providers &&
                    Object.values(providers).map((provider, index) => (
                      <button
                        key={index}
                        className={`${
                          pathname === "/prywatne_zestawy" ? "btn-success" : ""
                        } border-b-2  border-b-info py-4 flex items-center justify-center gap-2 `}
                        onClick={() => {
                          signIn(provider.id);
                        }}
                      >
                        <FaUser />
                        logowanie
                      </button>
                    ))}
                </>
              )}
              {/* Lista słówek Button */}
              <Link
                className={`${
                  pathname === "/zestawy" ? "btn-success" : ""
                } border-b-2  border-b-info py-2 flex items-center justify-center gap-2`}
                href={{ pathname: "/zestawy", query: { type: "public" } }}
              >
                <FaList />
                baza słówek
              </Link>
              {/* Kolorystyka Button */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const newTheme =
                    mobileTheme === "dark" ? "corporate" : "dark";
                  setMobileTheme(newTheme);
                  document
                    .querySelector("html")
                    .setAttribute("data-theme", newTheme);
                  localStorage.setItem("theme", newTheme);
                }}
                className="btn-success border-b-2 border-info py-2 w-screen bg-base-100 text-xl text-center  flex items-center justify-center gap-2"
              >
                <FaAdjust />
                kolorystyka
              </div>
              <button
                className="btn-success border-b-2 border-info py-2 w-screen bg-base-100 text-xl text-center  flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setMute((prev) => !prev);
                }}
              >
                {!mute ? (
                  <div className="flex gap-2 items-center">
                    <FaVolumeUp size={22} />
                    dźwięk
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <FaVolumeMute size={22} />
                    dźwięk
                  </div>
                )}
              </button>

              {/* Ustawienia Button */}
              {/* <Link
                className={`${
                  pathname === "/ustawienia" && "btn-success"
                } border-b-2  border-b-info py-2 flex items-center justify-center gap-2 `}
                href="/ustawienia"
              >
                <FaGear />
                ustawienia
              </Link> */}
              {/* O stronie Button */}
              <Link
                href="/o_stronie"
                className=" py-2  flex items-center justify-center gap-2"
              >
                <FaInfoCircle />o stronie
              </Link>
            </div>
          </div>
        </>
      )}
      {/* Desktop menu */}
      <div className="flex justify-between items-center w-full p-3 max-md:p-2 max-sm:hidden">
        <div className="flex gap-3 items-center font-semibold ">
          <Link href="/" className="flex items-center gap-2">
            <FaHome className={`${pathname === "/" ? "fill-success" : ""}`} />
          </Link>
          <Link
            className={`${
              type === "public" ? "btn-success" : ""
            } btn btn-xs btn-soft`}
            href={{ pathname: "/zestawy", query: { type: "public" } }}
          >
            baza słówek
          </Link>

          {session ? (
            <>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`btn btn-xs btn-soft pl-0 ml-2 ${
                  pathname === "/prywatne_zestawy" ||
                  pathname === "/profil" ||
                  type === "private"
                    ? "btn-success"
                    : ""
                }`}
                popoverTarget="popover-1"
                style={{ anchorName: "--anchor-1" }}
              >
                {profileImage ? (
                  <Image
                    className="size-7 border-2 border-primary rounded-full -ml-2"
                    src={profileImage}
                    width={40}
                    height={40}
                    alt="profile image"
                  />
                ) : (
                  <FaUser className="text-3xl p-1 border-2 border-primary rounded-full bg-base-100 -ml-2" />
                )}
                {session.user.name}
              </button>

              {dropdownOpen && (
                <ul
                  className="dropdown menu border mt-1 border-info rounded-box bg-base-100 shadow-sm"
                  popover="auto"
                  id="popover-1"
                  style={{ positionAnchor: "--anchor-1" }}
                >
                  <li>
                    <Link href="/profil" onClick={() => setDropdownOpen(false)}>
                      Mój profil
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={{
                        pathname: "/zestawy",
                        query: { type: "private" },
                      }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Moje słówka
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      Wyloguj
                    </button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    key={provider.name}
                    className="btn btn-xs btn-soft pl-1"
                    onClick={() => {
                      signIn(provider.id);
                    }}
                  >
                    <FaGoogle size={14} />
                    logowanie
                  </button>
                ))}
            </>
          )}
          {/* <Link
            className={`${
              pathname === "/ustawienia" && "btn-success"
            } btn btn-xs btn-soft`}
            href="/ustawienia"
          >
            ustawienia
          </Link> */}
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              setMute((prev) => !prev);
            }}
          >
            {!mute ? <FaVolumeUp size={18} /> : <FaVolumeMute size={18} />}
          </button>
          <ThemeChange />
          {/* <Link
            href="/ustawienia"
            className={`${pathname === "/ustawienia" && "text-success"} `}
          >
            <FaGear />
          </Link> */}
          <Link href="/o_stronie">
            <FaInfoCircle
              className={`${pathname === "/o_stronie" ? "fill-success" : ""}`}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
