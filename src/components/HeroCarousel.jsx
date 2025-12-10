import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const useHeroImages = () => {
  const modules = import.meta.glob("../images/hero*.{png,jpg,jpeg,webp}", {
    eager: true,
    import: "default",
  });

  const images = useMemo(() => {
    return Object.entries(modules)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, url]) => url);
  }, [modules]);

  return images;
};

export default function HeroCarousel() {
  const images = useHeroImages();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [animateText, setAnimateText] = useState(false);
  const navigate = useNavigate();

  // ✅ Textos sincronizados con cada imagen
  const textos = [
    {
      titulo: "Vuela con SkyAndes",
      subtitulo: "Tu aventura empieza en el cielo",
    },
    {
      titulo: "Explora nuevos destinos",
      subtitulo: "Conectamos Miami con el mundo",
    },
    {
      titulo: "Viaja seguro y cómodo",
      subtitulo: "Descubre la experiencia SkyAndes",
    },
    {
      titulo: "Tu viaje comienza aquí",
      subtitulo: "Reserva fácil, vuela feliz",
    },
  ];

  // ✅ Animación inicial al cargar la página
  useEffect(() => {
    const t = setTimeout(() => setAnimateText(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ✅ Cambio automático de imagen y texto
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setFade(false);
      setAnimateText(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setFade(true);
        setAnimateText(true);
      }, 600);
    }, 10000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Imagen de fondo */}
      {images.length > 0 ? (
        <img
          src={images[index]}
          alt="SkyAndes hero"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      )}

      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-6">
        {/* Título animado */}
        <h1
          className={`text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-4 transition-all duration-700 ease-in-out ${
            animateText
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {textos[index % textos.length].titulo}
        </h1>

        {/* Subtítulo animado */}
        <p
          className={`text-lg md:text-xl mb-8 transition-all duration-700 ease-in-out delay-150 ${
            animateText
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {textos[index % textos.length].subtitulo}
        </p>

        {/* Botón */}
        <button
          onClick={() => {
            const user = sessionStorage.getItem("user"); // ✅ CORREGIDO: usar sessionStorage

            if (!user) {
              // ❌ No loggeado → enviar al login
              navigate("/login");
              return;
            }

            // ✔ Loggeado → hacer scroll al buscador
            const el = document.getElementById("flight-search-box");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-[#ff6b00] hover:bg-[#e65a00] transition-all duration-300 px-8 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl cursor-pointer"
        >
          Explorar vuelos
        </button>
      </div>

      {/* Gradiente inferior */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}
