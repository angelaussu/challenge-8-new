import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HiHeart, HiPlay } from "react-icons/hi";
import { getTrending } from "../../api/tmdb";
import type { Movie } from "../../api/tmdb";
import { IoArrowBack } from "react-icons/io5";
import { HiXMark } from "react-icons/hi2";

interface SearchProps {
  setIsSearchActive: (active: boolean) => void;
}

const Search: React.FC<SearchProps> = ({ setIsSearchActive }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch favorites dari localStorage
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favs);
  }, []);

  // Fetch data ketika query berubah
  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      try {
        const data = await getTrending(); // sementara pakai trending
        const filtered = data.filter((m) =>
          m.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [query]);

  // Close dropdown ketika klik di luar (desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        if (isDesktop) setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Disable scroll body saat dropdown/overlay terbuka & update parent state
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    setIsSearchActive(isOpen);
  }, [isOpen, setIsSearchActive]);

  // Focus input saat overlay dibuka (mobile) + saat dropdown dibuka (desktop)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Toggle favorite
  const toggleFavorite = (movie: Movie) => {
    const updated = favorites.some((m) => m.id === movie.id)
      ? favorites.filter((m) => m.id !== movie.id)
      : [...favorites, movie];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  // Navigate ke movie detail
  const handleNavigate = (movieId: number) => {
    navigate(`/movie/${movieId}`);
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full" ref={ref}>
      {/* ===== Trigger area ===== */}
      <div className="relative flex items-center">
        {/* Icon Search (mobile) */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(true)}
          aria-label="Open search"
        >
          <FiSearch size={22} className="text-white" />
        </button>

        {/* Desktop input (selalu tampil) */}
        <div className="hidden md:flex w-full ml-2 items-center border rounded-xl px-3 py-2 shadow-sm bg-[#0A0D1299] border-[#252B37]">
          <FiSearch className="text-gray-400 mr-2" size={20} />

          <input
            ref={inputRef}
            type="text"
            placeholder="Search Movie"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            className="flex-1 outline-none text-white placeholder-[#717680] bg-transparent"
          />

          {/* Desktop Clear X */}
          {query.length > 0 && (
            <button
              onClick={clearQuery}
              className="ml-2 h-7 w-7 flex items-center justify-center rounded-full hover:bg-white/10 transition"
              aria-label="Clear search"
              type="button"
            >
              <HiXMark className="text-[#A4A7AE]" size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ===== Mobile overlay (tampilan seperti gambar) ===== */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[999] bg-black">
          {/* Top bar */}
          <div className="px-4 pt-4">
            <div className="flex items-center gap-3">
              {/* Back */}
              <button
                onClick={closeSearch}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Back"
                type="button"
              >
                <IoArrowBack className="text-white" size={22} />
              </button>

              {/* Search bar */}
              <div className="flex-1 h-11 flex items-center rounded-full bg-[#0A0D12] border border-[#252B37] px-4">
                <FiSearch className="text-[#A4A7AE]" size={18} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search Movie"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-[#717680]"
                />

                {/* Clear X (mobile) */}
                {query.length > 0 && (
                  <button
                    onClick={clearQuery}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10"
                    aria-label="Clear"
                    type="button"
                  >
                    <HiXMark className="text-white" size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results area */}
          <div className="mt-4 h-[calc(100vh-88px)] overflow-y-auto">
            {results.length === 0 && query.length > 0 && (
              <div className="px-4 text-[#A4A7AE]">No results</div>
            )}

            {results.map((movie) => {
              const isFav = favorites.some((m) => m.id === movie.id);
              return (
                <div
                  key={movie.id}
                  className="flex gap-4 p-4 items-start border-b border-[#252B37] relative hover:bg-white/10 cursor-pointer"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-20 h-28 rounded-lg object-cover shrink-0"
                    onClick={() => handleNavigate(movie.id)}
                  />

                  <div className="flex-1 flex flex-col gap-1">
                    <span
                      className="text-white font-semibold text-base"
                      onClick={() => handleNavigate(movie.id)}
                    >
                      {movie.title}
                    </span>
                    <span className="text-[#FDFDFD] text-sm flex items-center gap-1">
                      ⭐ {movie.vote_average?.toFixed(1)}/10
                    </span>
                    <p className="text-[#A4A7AE] text-sm line-clamp-3">
                      {movie.overview}
                    </p>
                    <button
                      className="mt-2 px-4 py-1.5 rounded-full bg-[#FF3C3C] text-white text-sm flex items-center gap-2 w-max cursor-pointer"
                      onClick={() => alert("Trailer clicked!")}
                      type="button"
                    >
                      <HiPlay size={16} /> Watch Trailer
                    </button>
                  </div>

                  <button
                    className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/50 rounded-full border border-[#181D27] cursor-pointer"
                    onClick={() => toggleFavorite(movie)}
                    aria-label="Favorite"
                    type="button"
                  >
                    <HiHeart
                      className={`${
                        isFav ? "text-red-500" : "text-white"
                      } w-5 h-5`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== Desktop dropdown results ===== */}
      {isOpen && results.length > 0 && (
        <div className="hidden md:block absolute top-full left-0 w-full overflow-y-auto bg-[#000000] rounded-b-xl shadow-lg z-50 h-screen px-4 md:px-10 xl:px-35">
          {results.map((movie) => {
            const isFav = favorites.some((m) => m.id === movie.id);
            return (
              <div
                key={movie.id}
                className="flex gap-4 p-4 items-start border-b border-[#252B37] relative hover:bg-white/10 cursor-pointer"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-20 h-28 rounded-lg object-cover shrink-0"
                  onClick={() => handleNavigate(movie.id)}
                />

                <div className="flex-1 flex flex-col gap-1">
                  <span
                    className="text-white font-semibold text-base"
                    onClick={() => handleNavigate(movie.id)}
                  >
                    {movie.title}
                  </span>
                  <span className="text-[#FDFDFD] text-sm flex items-center gap-1">
                    ⭐ {movie.vote_average?.toFixed(1)}/10
                  </span>
                  <p className="text-[#A4A7AE] text-sm line-clamp-3">
                    {movie.overview}
                  </p>
                </div>

                <button
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/50 rounded-full border border-[#181D27] cursor-pointer"
                  onClick={() => toggleFavorite(movie)}
                  type="button"
                >
                  <HiHeart
                    className={`${
                      isFav ? "text-red-500" : "text-white"
                    } w-5 h-5`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
