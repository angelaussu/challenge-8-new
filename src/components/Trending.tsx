import { useQuery } from "@tanstack/react-query";
import { getTrending } from "../api/tmdb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const Trending = () => {
  const navigate = useNavigate();

  const { data: movies, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const data = await getTrending();
      return data.slice(0, 10);
    },
  });

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
    <section className="w-full relative mt-6 pl-4 md:pl-10 xl:pl-35 pb-21 z-1">
      <h2 className="text-white font-bold text-2xl mb-4">Trending Now</h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".custom-swiper-next",
          prevEl: ".custom-swiper-prev",
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={false}
        grabCursor
        spaceBetween={12}
        breakpoints={{
          0: {
            slidesPerView: 2,
            slidesPerGroup: 2, // pindah 2 item → rapi
          },
          640: {
            slidesPerView: "auto",
            slidesPerGroup: 1,
          },
        }}
        className="pb-4 relative"
      >
        {movies?.map((movie, index) => (
          <SwiperSlide
            key={movie.id}
            className="w-[50%!] sm:w-54!" // mobile 2 item, desktop custom
          >
            <div
              className="relative group cursor-pointer"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              {/* numbering */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-[18px] w-12 h-12 flex items-center justify-center rounded-full z-10">
                {index + 1}
              </div>

              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg w-full h-80.25 object-cover"
              />

              <div className="mt-3 text-white font-semibold text-base xl:text-[18px] truncate leading-7.5">
                {movie.title}
              </div>

              <div className="text-[#A4A7AE] xl:text-base text-[14px] flex items-center gap-1 leading-7.5">
                ⭐ {movie.vote_average.toFixed(1)}/10
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Swiper Arrows */}
        <div className="custom-swiper-prev absolute top-1/2 left-2 -translate-y-1/2 w-14 h-14 bg-[#0A0D1299] rounded-full flex items-center justify-center z-20 cursor-pointer text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
        <div className="custom-swiper-next absolute top-1/2 right-2 -translate-y-1/2 w-14 h-14 bg-[#0A0D1299] rounded-full flex items-center justify-center z-20 cursor-pointer text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Swiper>
    </section>
  );
};

export default Trending;
