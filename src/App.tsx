import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Trending from "./components/Trending";
import NewRelease from "./components/NewRelease";
import Footer from "./components/Footer";
import MovieDetail from "./pages/MovieDetail";
import Favorites from "./pages/Favorites";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="bg-black">
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Trending />
                <NewRelease />
              </>
            }
          />
          {/* Single movie page */}
          <Route path="/movie/:id" element={<MovieDetail />} />
          {/* Single Favorites page */}
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
