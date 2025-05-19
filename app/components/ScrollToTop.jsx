"use client";
import { FaArrowCircleUp } from "react-icons/fa";

import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed max-sm:scale-90 bottom-6 right-6 max-sm:bottom-3 max-sm:right-3 z-30 text-info hover:text-secondary drop-shadow-lg transition-opacity duration-300 bg-base-content rounded-full p-[2px] ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <FaArrowCircleUp size={32} />
    </button>
  );
};

export default ScrollToTop;
