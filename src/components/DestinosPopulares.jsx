export default function DestinosPopulares() {
  const destinos = [
    {
      ciudad: "Quito",
      imagen: "/src/images/destinoQuito.png",
      aerolinea: "SkyAndes",
      precio: 180,
      fechas: "5 noviembre 2025 – 10 noviembre 2025",
      puntos: 18,
    },
    {
      ciudad: "Guayaquil",
      imagen: "/src/images/destinoGuayaquil.png",
      aerolinea: "SkyAndes",
      precio: 160,
      fechas: "20 noviembre 2025 – 27 noviembre 2025",
      puntos: 16,
    },
    {
      ciudad: "Cuenca",
      imagen: "/src/images/destinoCuenca.png",
      aerolinea: "SkyAndes",
      precio: 150,
      fechas: "3 diciembre 2025 – 8 diciembre 2025",
      puntos: 15,
    },
    {
      ciudad: "Miami",
      imagen: "/src/images/destinoMiami.png",
      aerolinea: "SkyAndes Airlines (base principal)",
      precio: 320,
      fechas: "10 enero 2026 – 20 enero 2026",
      puntos: 32,
    },
    {
      ciudad: "Paris",
      imagen: "/src/images/destinoFrancia.png",
      aerolinea: "SkyAndes",
      precio: 750,
      fechas: "5 marzo 2026 – 20 marzo 2026",
      puntos: 75,
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Encuentra vuelos baratos a los destinos más populares
        </h2>

        {/* GRID DE DESTINOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {destinos.map((dest, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 duration-300"
            >
              {/* Imagen */}
              <img
                src={dest.imagen}
                alt={dest.ciudad}
                className="w-full h-40 object-cover rounded-t-2xl"
              />

              {/* Info */}
              <div className="p-5 text-left">
                <p className="text-xs tracking-widest text-gray-500 mb-1">VUELO</p>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Vuelos a {dest.ciudad}
                </h3>
                <p className="text-sm text-gray-600">
                  Partiendo desde Miami
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Por {dest.aerolinea}
                </p>

                <button className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-semibold mb-3">
                  Ida y vuelta
                </button>

                <p className="text-sm text-gray-700">
                  Precio ida y vuelta desde
                </p>
                <p className="text-2xl font-bold text-[#ff6b00] mb-2">
                  USD {dest.precio}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Fecha de referencia:<br />
                  {dest.fechas}
                </p>

                <div className="border-t pt-2 text-xs text-gray-600 flex items-center justify-between">
                  <p>✈️ Pasaporte SkyAndes</p>
                  <p className="text-[#ff6b00] font-semibold">
                    Sumarás {dest.puntos} puntos
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
