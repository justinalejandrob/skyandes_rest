import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import DestinosPopulares from "../components/DestinosPopulares";
import PreparateViajar from "../components/PreparateViajar";
import InfoInteres from "../components/InfoInteres";
import ComplementaExperiencia from "../components/ComplementaExperiencia";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden m-0 p-0">
        <HeroCarousel />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
          <Navbar />
        </div>
      </section>

      {/* NUEVA SECCIÓN DE DESTINOS */}
      <PreparateViajar />
      <DestinosPopulares />
      <InfoInteres />
      <ComplementaExperiencia />
      <Footer />

      {/* Otras secciones futuras */}
    </div>
  );
}

export default Home;
