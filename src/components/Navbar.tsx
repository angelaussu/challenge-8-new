"use client";
import Search from "../components/Search/Search";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MENU = [
  { label: "Home", href: "/" },
  { label: "Favorites", href: "/favorites" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Disable scroll body saat search aktif
  useEffect(() => {
    if (isSearchActive) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSearchActive]);

  return (
    <header
      className={`
        fixed top-0 z-50 w-full transition-all duration-300
        ${
          isSearchActive
            ? "bg-black" // Navbar hitam saat search aktif
            : scrolled
            ? "backdrop-blur-xl bg-white/10"
            : "bg-transparent"
        }
      `}
    >
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 py-4.5 md:px-10 lg:px-10 xl:px-35 md:py-5.5">
        {/* LOGO */}
        <div className="flex items-center">
          <Link to="/">
            <img src="/assets/movie-logo.svg" alt="Logo" className="w-32.25" />
          </Link>
          {/* DESKTOP MENU */}
          <div className="hidden lg:flex gap-14 ml-20">
            {MENU.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white font-normal"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="max-lg:flex max-lg:items-center">
          {/* SearchBar */}
          <div className="flex justify-end">
            <Search setIsSearchActive={setIsSearchActive} />
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-[#0A0D12] dark:text-white max-lg:ml-6"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black backdrop-blur-xl h-screen">
          <div className="flex items-center justify-between px-4 py-5">
            <img
              src="/assets/movie-logo.svg"
              alt="Logo"
              className="w-23 h-7 md:w-32.25"
            />

            <button
              onClick={() => setOpen(false)}
              className="text-[#0A0D12] dark:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <div className="px-4 py-6 space-y-5">
            {MENU.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block text-[16px] font-normal text-[#0A0D12] dark:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
