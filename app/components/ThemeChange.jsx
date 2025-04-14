"use client";

import { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import { MdLightMode, MdDarkMode } from "react-icons/md";

function ThemeChange() {
  const [actualTheme, setActualTheme] = useState("dark");

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <button
      className="flex items-center cursor-pointer"
      data-toggle-theme="dark,light"
      data-act-class="ACTIVECLASS"
      onClick={() => {
        setActualTheme(document.documentElement.getAttribute("data-theme"));
      }}
    >
      {actualTheme === "light" ? (
        <MdDarkMode className="text-2xl" />
      ) : (
        <MdLightMode className="text-2xl" />
      )}
    </button>
  );
}
export default ThemeChange;
