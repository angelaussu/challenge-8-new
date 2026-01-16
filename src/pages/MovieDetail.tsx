import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById, getMovieVideos } from "../api/tmdb";
import type { Movie, MovieVideo } from "../api/tmdb";
import { HiPlay, HiHeart } from "react-icons/hi";
import Button from "../components/Button/Button";

console.log("movie");

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  // Trailer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  // Favorite State
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getMovieById(Number(id));
        setMovie(data);

        // === CHECK FAVORITE STATUS ===
        const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favs.some((f: Movie) => f.id === data.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="relative w-full h-125">
        <p
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-semibold flex items-center justify-center"
          style={{
            width: "180px",
            height: "180px",
            backgroundColor: "#0A0D1299",
            boxShadow: "none",
            display: "inline-flex",
            animation: "loadingText 1s linear alternate-reverse infinite",
          }}
        >
          Loading...
        </p>
      </div>
    );
  if (!movie) return <p className="text-white p-6">Movie not found</p>;

  /* ================= FAVORITE HANDLER ================= */
  const handleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;

    if (isFavorite) {
      updated = favs.filter((f: Movie) => f.id !== movie.id);
    } else {
      updated = [...favs, movie];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  /* ================= CONS / DERIVED ================= */

  const releaseDate = new Date(movie.release_date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const genres = movie.genres?.map((g) => g.name).join(", ") || "-";

  const handleWatchTrailer = async () => {
    try {
      const videos: MovieVideo[] = await getMovieVideos(movie.id);
      const trailer = videos.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
        setIsModalOpen(true);
      } else {
        alert("Trailer not available");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch trailer");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrailerKey(null);
  };

  const getCertification = (movie: Movie) => {
    const idRating = movie.release_dates?.results?.find(
      (r) => r.iso_3166_1 === "ID"
    );
    return idRating?.release_dates?.[0]?.certification || "NR";
  };

  const rating = movie.vote_average
    ? `${movie.vote_average.toFixed(1)}/10`
    : "-";

  const certification = getCertification(movie);

  /* ================= RETURN RENDER ================= */

  return (
    <div className="text-white">
      {/* Hero Banner */}
      <section className="relative z-0 before:content-[''] before:absolute before:inset-0 before:z-10 before:bg-[linear-gradient(360deg,rgba(0,0,0,1)_16%,rgba(255,255,255,0)_76%)] w-full h-[60vh] md:h-[80vh]">
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}
      </section>

      {/* Info Section */}
      <section className="flex flex-row gap-4 md:gap-8 px-4 md:px-10 xl:px-35 relative -mt-60 md:-mt-100 ">
        {/* Poster */}
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-29 h-42.75 lg:w-65 lg:h-96 rounded-lg shadow-lg"
          />
        )}

        {/* Movie Info */}
        <div className="flex flex-col md:gap-4 gap-0 w-full">
          <h1 className="text-[20px] md:text-[40px] font-bold">
            {movie.title}
          </h1>

          <p className="flex items-center text-white md:text-base text-[14px]">
            <img
              src="/assets/calendar.svg"
              alt="Calendar Icon"
              className="w-6 h-6 mr-2"
            />
            {releaseDate}
          </p>

          {/* Actions */}
          <div className="hidden min-[900px]:flex min-[900px]:gap-4 min-[900px]:mt-4">
            <Button
              label="Watch Trailer"
              variant="primary"
              icon={<HiPlay size={24} />}
              onClick={handleWatchTrailer}
            />

            {/* ============== FAVORITE BUTTON ============== */}
            <Button
              label=""
              variant="secondary"
              onClick={handleFavorite}
              icon={
                <HiHeart
                  size={24}
                  className={
                    isFavorite ? "text-red-500 fill-red-500" : "text-white"
                  }
                />
              }
              className={`p-0 h-13 w-13 flex justify-center bg-[#0A0D1299] border ${
                isFavorite ? "" : "border-[#181D27]"
              }`}
            />
          </div>

          {/* Rating / Genre / Age */}
          <div className="hidden min-[900px]:grid min-[900px]:grid-cols-3 min-[900px]:gap-5 min-[900px]:mt-4">
            <div className="bg-black border border-[#252B37] rounded-2xl p-5 flex flex-col items-center justify-center">
              <img
                src="/assets/star.svg"
                alt="Star"
                className="w-7.5 h-7.5 mb-2"
              />
              <p className="text-base text-[#D5D7DA] leading-7.5">Rating</p>
              <p className="text-[20px] font-semibold leading-8 text-white">
                {rating}
              </p>
            </div>

            <div className="bg-black border border-[#252B37] rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400">
              <img
                src="/assets/video.svg"
                alt="Genre"
                className="w-7.5 h-7.5 mb-2"
              />
              <p className="text-base text-[#D5D7DA] leading-7.5">Genres</p>
              <p className="text-[20px] font-semibold leading-8 text-white text-center">
                {genres}
              </p>
            </div>

            <div className="bg-black border border-[#252B37] rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400">
              <img
                src="/assets/emoji-happy.svg"
                alt="Age"
                className="w-7.5 h-7.5 mb-2"
              />
              <p className="text-base text-[#D5D7DA] leading-7.5">Age Limit</p>
              <p className="text-[20px] font-semibold leading-8  text-white">
                {certification}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="block min-[900px]:hidden px-4 md:px-10 xl:px-35 relative z-9 md:z-auto">
        {/* Actions */}
        <div className="min-[900px]:hidden flex gap-4 mt-6">
          <Button
            label="Watch Trailer"
            variant="primary"
            icon={<HiPlay size={24} />}
            onClick={handleWatchTrailer}
          />

          {/* ============== FAVORITE BUTTON ============== */}
          <Button
            label=""
            variant="secondary"
            onClick={handleFavorite}
            icon={
              <HiHeart
                size={24}
                className={
                  isFavorite ? "text-red-500 fill-red-500" : "text-white"
                }
              />
            }
            className={`p-0 h-13 w-13 flex justify-center bg-[#0A0D1299] border ${
              isFavorite ? "" : "border-[#181D27]"
            }`}
          />
        </div>

        {/* Rating / Genre / Age */}
        <div className="max-[900px]:grid max-[900px]:grid-cols-3 max-[900px]:gap-5 max-[900px]:mt-6">
          <div className="bg-black border border-[#252B37] rounded-2xl p-4 lg:p-5 flex flex-col items-center justify-center">
            <img
              src="/assets/star.svg"
              alt="Star"
              className="w-6 h-6 lg:w-7.5 lg:h-7.5 mb-0 lg:mb-2"
            />
            <p className="lg:text-base text-[12px] text-[#D5D7DA] leading-7.5">
              Rating
            </p>
            <p className="text-[18px] lg:text-[20px] font-semibold leading-8 text-white">
              {rating}
            </p>
          </div>

          <div className="bg-black border border-[#252B37] rounded-2xl p-4 lg:p-5 flex flex-col items-center justify-center text-gray-400">
            <img
              src="/assets/video.svg"
              alt="Genre"
              className="w-6 h-6 lg:w-7.5 lg:h-7.5 mb-0 lg:mb-2"
            />
            <p className="lg:text-base text-[12px] text-[#D5D7DA] leading-7.5">
              Genres
            </p>
            <p className="text-[18px] lg:text-[20px] font-semibold leading-8 text-white text-center">
              {genres}
            </p>
          </div>

          <div className="bg-black border border-[#252B37] rounded-2xl p-4 lg:p-5 flex flex-col items-center justify-center text-gray-400">
            <img
              src="/assets/emoji-happy.svg"
              alt="Age"
              className="w-6 h-6 lg:w-7.5 lg:h-7.5 mb-0 lg:mb-2"
            />
            <p className="lg:text-base text-[12px] text-[#D5D7DA] leading-7.5">
              Age Limit
            </p>
            <p className="text-[18px] lg:text-[20px] font-semibold leading-8  text-white">
              {certification}
            </p>
          </div>
        </div>
      </section>
      <section className="px-4 md:px-10 xl:px-35 mt-12 mb-10">
        <h2 className="md:text-[32px] text-[20px] font-bold mb-2 text-[#FDFDFD] leading-11.5">
          Overview
        </h2>
        <p className="text-[#A4A7AE] text-base leading-7.5">{movie.overview}</p>
      </section>

      {/* =================== CAST & CREW =================== */}

      <section className="px-4 md:px-10 xl:px-35 mt-6 md:mb-37.25  mb-10">
        <h2 className="md:text-[32px] text-[20px] font-bold mb-6 text-[#FDFDFD] leading-11.5">
          Cast & Crew
        </h2>

        {/* Cast */}
        <div className="mb-6">
          <div className="grid md:grid-cols-3 md:gap-10 gap-4">
            {movie.credits?.cast?.slice(0, 6).map((actor: any) => (
              <div key={actor.id} className="flex items-center gap-4">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : "/assets/avatar-placeholder.png"
                  }
                  alt={actor.name}
                  className="w-17.25 h-26 object-cover rounded-lg"
                />
                {/* Cast Details */}
                <div>
                  <p className="text-base font-medium leading-7.5 text-[#FDFDFD] mb-1">
                    {actor.name}
                  </p>
                  <p className="text-base text-[#A4A7AE]">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Trailer */}
      {isModalOpen && trailerKey && (
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
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
