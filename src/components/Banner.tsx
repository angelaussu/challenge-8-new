import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import type { Movie, MovieVideo } from "../api/tmdb";
import { getTrending, getMovieVideos } from "../api/tmdb";
import { HiPlay } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();

  // Fetch trending movies
  const { data: movies, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: getTrending,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrailerKey, setCurrentTrailerKey] = useState<string | null>(
    null
  );

  // Lock scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Trailer mutation
  const trailerMutation = useMutation({
    mutationFn: (movieId: number) => getMovieVideos(movieId),
    onSuccess: (videos: MovieVideo[]) => {
      const trailer = videos.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        setCurrentTrailerKey(trailer.key);
        setIsModalOpen(true);
      } else {
        alert("Trailer not available");
      }
    },
    onError: () => {
      alert("Failed to fetch trailer");
    },
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTrailerKey(null);
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

  return (
    <section className="w-full relative z-10">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={false}
        loop={true}
      >
        {movies?.map((movie: Movie) => (
          <SwiperSlide key={movie.id}>
            <div className="overflow-hidden relative before:content-[''] before:absolute before:inset-0 before:z-10 before:bg-[linear-gradient(360deg,rgba(0,0,0,1)_16%,rgba(255,255,255,0)_76%)]">
              {movie.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-140 md:h-202.5 object-cover object-top"
                />
              )}
              <div className="absolute top-1/2 left-4 right-4 md:left-10 xl:left-35 -translate-y-1/2 z-50 bottom-0 md:bottom-auto">
                <h2 className="text-[24px] sm:text-[32px] md:text-[48px] leading-15 md:mb-4 mb-0 text-white font-bold tracking-[-2px]">
                  {movie.title}
                </h2>
                <p className="text-base text-[#A4A7AE] md:mb-12 mb-6 max-w-158.75 leading-7 md:leading-7.5 line-clamp-5 md:line-clamp-none">
                  {movie.overview?.slice(0, 500)}
                </p>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    label={
                      trailerMutation.isPending ? "Loading..." : "Watch Trailer"
                    }
                    variant="primary"
                    icon={<HiPlay size={24} />}
                    width={230}
                    onClick={() => trailerMutation.mutate(movie.id)}
                    className="justify-center md:justify-start bg-[#961200]"
                  />
                  <Button
                    label="See Detail"
                    variant="secondary"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="justify-center md:justify-start"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal Trailer */}
      {isModalOpen && currentTrailerKey && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
          onClick={closeModal} // click outside closes modal
        >
          <div
            className="relative w-[90%] max-w-4xl h-[60%] md:h-[80%]"
            onClick={(e) => e.stopPropagation()} // click inside iframe does not close
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentTrailerKey}?autoplay=1`}
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
    </section>
  );
}
