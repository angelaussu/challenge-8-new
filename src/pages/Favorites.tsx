import { useEffect, useState } from "react";
import type { Movie, MovieVideo } from "../api/tmdb";
import { getMovieVideos } from "../api/tmdb";
import { HiHeart, HiPlay } from "react-icons/hi";
import { Link } from "react-router-dom";
import Button from "../components/Button/Button";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Modal Trailer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrailerKey, setCurrentTrailerKey] = useState<string | null>(
    null
  );

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favs);
  }, []);

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((m) => m.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  const handleWatchTrailer = async (movieId: number) => {
    try {
      const videos: MovieVideo[] = await getMovieVideos(movieId);
      const trailer = videos.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      if (trailer) {
        setCurrentTrailerKey(trailer.key);
        setIsModalOpen(true);
      } else {
        alert("Trailer not available");
      }
    } catch (err) {
      console.error("Failed to fetch trailer", err);
      alert("Failed to fetch trailer");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTrailerKey(null);
  };

  return (
    <section className="text-white px-4 md:px-10 xl:px-35 md:pt-30 pt-25 md:pb-41.5 pb-11.25">
      <h1 className="lg:text-[32px] md:text-3xl text-2xl font-bold md:mb-12 mb-0">
        Favorites
      </h1>

      {/* EMPTY STATE */}
      {favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center pt-26 pb-60">
          <img src="/assets/empty.svg" alt="Star" className="w-50 h-50 mb-4" />
          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold">Data Empty</p>
            <p className="text-sm text-[#A4A7AE]">
              You don't have a favorite movie yet
            </p>
            <Button
              label="Explore Movie"
              variant="primary"
              onClick={() => window.location.replace("/")}
              className="justify-center mt-6"
            />
          </div>
        </div>
      )}

      {/* LIST */}
      {favorites.length > 0 && (
        <div className="grid">
          {favorites.map((movie, i) => (
            <div
              key={movie.id}
              className={`
                relative py-8
                ${i !== favorites.length - 1 ? "border-b border-[#252B37]" : ""}
              `}
            >
              <div
                className={`
                flex gap-6 relative
              `}
              >
                {/* Poster */}
                <Link to={`/movie/${movie.id}`} className="w-45.5 contents">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-26 h-39 md:w-45.5 md:h-67.5 rounded-xl object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex flex-col gap-3 w-full lg:pr-45.5">
                  <h3 className="lg:text-[24px] md:text-[20px] text-base font-bold">
                    {movie.title}
                  </h3>

                  <p className="md:text-[18px] text-[14px] text-[#FDFDFD] flex items-center gap-1">
                    <img
                      src="/assets/star.svg"
                      alt="Star"
                      className="md:w-6 md:h-6 w-4.5 h-4.5"
                    />
                    {movie.vote_average?.toFixed(1)}/10
                  </p>

                  <p
                    className="text-sm text-[#A4A7AE] leading-6 overflow-hidden sm:overflow-visible
          text-ellipsis sm:text-clip
          line-clamp-2 sm:line-clamp-none"
                  >
                    {movie.overview?.slice(0, 200)}...
                  </p>

                  <div className="hidden md:flex gap-3 mt-6">
                    <Button
                      label="Watch Trailer"
                      variant="primary"
                      icon={<HiPlay size={20} />}
                      onClick={() => handleWatchTrailer(movie.id)}
                    />
                  </div>
                </div>

                {/* Remove Favorite */}
                <button
                  onClick={() => removeFavorite(movie.id)}
                  className="hidden md:flex absolute top-3 right-3 bg-black/70 rounded-full p-2 border border-[#181D27] w-14 h-14 items-center justify-center cursor-pointer"
                >
                  <HiHeart className="text-red-500 w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-3 md:hidden mt-6">
                {/* Watch Trailer */}
                <Button
                  label="Watch Trailer"
                  variant="primary"
                  icon={<HiPlay size={16} />}
                  className="flex-1 h-10 text-sm md:text-base rounded-full justify-center"
                  onClick={() => handleWatchTrailer(movie.id)}
                />

                {/* Heart / Favorite */}
                <button
                  onClick={() => removeFavorite(movie.id)}
                  className="bg-black/70 rounded-full p-2 w-10 h-10 flex items-center justify-center border border-[#181D27] cursor-pointer"
                >
                  <HiHeart className="text-red-500 w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trailer Modal */}
      {isModalOpen && currentTrailerKey && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative w-[90%] max-w-4xl h-[60%] md:h-[80%]"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentTrailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
