import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getNewRelease } from "../api/tmdb";
import { useNavigate } from "react-router-dom";

const NewRelease = () => {
  const navigate = useNavigate();

  // Fetch new release movies
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["newRelease"],
    queryFn: getNewRelease,
  });

  const [visibleCount, setVisibleCount] = useState(15);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 15);
  };

  if (isLoading)
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

  const visibleMovies = movies.slice(0, visibleCount);

  return (
    <section className="w-full mt-10 px-4 md:px-10 xl:px-35 mb-24 relative">
      <h2 className="text-white font-bold text-2xl mb-4">Now Playing</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-5 relative z-10">
        {visibleMovies.map((movie) => (
          <div
            key={movie.id}
            className="w-full h-auto cursor-pointer"
            style={{ aspectRatio: "2/3" }}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg w-full h-full object-cover"
            />
            <div className="mt-3 text-white font-semibold text-[18px] truncate">
              {movie.title}
            </div>
            <div className="text-[#A4A7AE] text-base flex items-center gap-1 leading-7.5">
              ⭐ {movie.vote_average.toFixed(1)}/10
            </div>
          </div>
        ))}
      </div>

      {/* Gradient Blur Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-150 z-20 pointer-events-none bg-linear-to-t from-[#000000] to-transparent" />

      {visibleCount < movies.length && (
        <div className="mt-8 flex justify-center relative z-30">
          <button
            onClick={handleLoadMore}
            className="py-2.75 rounded-[30px] bg-[#0A0D1299] text-[#FDFDFD] hover:bg-white/20 transition cursor-pointer w-57.5 leading-7.5 text-base font-semibold"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default NewRelease;
