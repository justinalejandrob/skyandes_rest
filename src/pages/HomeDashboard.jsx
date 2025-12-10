import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import FlightSearchBox from "../components/FlightSearchBox";
import OfertasDesde from "../components/OfertasDesde";
import ComplementaExperiencia from "../components/ComplementaExperiencia";
import PreparateViajar from "../components/PreparateViajar";
import Footer from "../components/Footer";

function HomeDashboard() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden m-0 p-0">
        <HeroCarousel />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
          <Navbar />
        </div>
      </section>

      {/* BUSCADOR DE VUELOS */}
      <section
        id="flight-search-box"
        className="flex justify-center items-center py-20 bg-black"
      >
        <FlightSearchBox />
      </section>

      {/* OFERTAS DESDE */}
      <section id="ofertas-desde" className="bg-png py-16">
        <OfertasDesde />
      </section>

      <ComplementaExperiencia />
      <PreparateViajar />
      <Footer />
    </div>
  );
}

export default HomeDashboard;
