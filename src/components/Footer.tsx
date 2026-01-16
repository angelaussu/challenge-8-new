import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="w-full
  px-4 py-6
  md:px-10
  lg:px-10 lg:py-10
  xl:px-35
  bg-black border-t border-[#252B37]"
    >
      <div
        className="flex flex-col gap-5
  lg:flex-row lg:gap-0 lg:justify-between lg:items-center"
      >
        {/* Logo kiri */}
        <div className="flex items-center">
          <Link to="/">
            <img src="/assets/movie-logo.svg" alt="Logo" className="w-32.25" />
          </Link>
        </div>

        {/* Teks kanan */}
        <div className="text-[12px] lg:text-base text-[#535862] ">
          Copyright ©2025 Movie Explorer
        </div>
      </div>
    </footer>
  );
};

export default Footer;
