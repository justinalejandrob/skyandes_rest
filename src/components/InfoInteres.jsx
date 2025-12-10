export default function InfoInteres() {
  const tarjetas = [
    {
      titulo: "Experiencia SkyAndes",
      descripcion:
        "¡Listo para despegar! Descubre los servicios a bordo que te ofrecemos al volar con nosotros.",
      imagen: "/src/images/info-experiencia.png",
    },
    {
      titulo: "Equipaje",
      descripcion:
        "Entérate de las condiciones que debes tener en cuenta al momento de preparar tu equipaje.",
      imagen: "/src/images/info-equipaje.png",
    },
    {
      titulo: "Unidos contra el fraude",
      descripcion:
        "Protege tu viaje comprando tus boletos y servicios adicionales en nuestros canales oficiales.",
      imagen: "/src/images/info-fraude.png",
    },
    {
      titulo: "Compensa tu huella",
      descripcion:
        "Calcula y compensa la huella de carbono de tu viaje. Cada acción puede hacer la diferencia.",
      imagen: "/src/images/info-huella.png",
    },
  ];

  return (
    <section className="bg-[#000000] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-12">
          Más información de interés
        </h2>

        {/* GRID DE TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tarjetas.map((item, i) => (
            <div
              key={i}
              className="bg-[#111111] rounded-2xl shadow-lg hover:shadow-[#ff6b00]/40 transition transform hover:-translate-y-2 duration-300 overflow-hidden"
            >
              {/* Imagen */}
              <img
                src={item.imagen}
                alt={item.titulo}
                className="w-full h-40 object-cover"
              />

              {/* Contenido */}
              <div className="p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.titulo}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
