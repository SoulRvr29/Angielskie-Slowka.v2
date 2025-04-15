"use client";

import { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import { MdLightMode, MdDarkMode } from "react-icons/md";

function ThemeChange() {
  const [actualTheme, setActualTheme] = useState(null);

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setActualTheme(savedTheme);
  }, []);

  return (
    <button
      className="flex items-center cursor-pointer"
      data-toggle-theme="dark,emerald"
      data-act-class="ACTIVECLASS"
      onClick={() => {
        setActualTheme(document.documentElement.getAttribute("data-theme"));
      }}
    >
      {actualTheme !== "dark" ? (
        <MdDarkMode title="włącz tryb ciemny" className="text-2xl" />
      ) : (
        <MdLightMode title="włącz tryb jasny" className="text-2xl" />
      )}
    </button>
  );
}
export default ThemeChange;
