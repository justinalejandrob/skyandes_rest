import { Building2, CarFront, Landmark, Briefcase } from "lucide-react";

export default function ComplementaExperiencia() {
  const items = [
    {
      icono: <Building2 className="text-[#ff6b00]" size={50} />,
      titulo: "Reserva de hoteles",
      descripcion: (
        <>
          Cientos de alojamientos con hasta 15% DCTO te esperan en{" "}
          <a
            href="https://www.booking.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff6b00] underline hover:text-[#e65a00]"
          >
            Booking.com
          </a>
          .
        </>
      ),
    },
    {
      icono: <CarFront className="text-[#ff6b00]" size={50} />,
      titulo: "Alquiler de autos",
      descripcion: (
        <>
          Muévete a tu ritmo con hasta 15% DCTO en tu próximo destino con{" "}
          <a
            href="https://www.rentalcars.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff6b00] underline hover:text-[#e65a00]"
          >
            Rentalcars.com
          </a>
          .
        </>
      ),
    },
    {
      icono: <Landmark className="text-[#ff6b00]" size={50} />,
      titulo: "Tours y excursiones",
      descripcion: (
        <>
          Descubre actividades en los principales destinos turísticos del mundo con{" "}
          <a
            href="https://www.civitatis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff6b00] underline hover:text-[#e65a00]"
          >
            Civitatis
          </a>
          .
        </>
      ),
    },
    {
      icono: <Briefcase className="text-[#ff6b00]" size={50} />,
      titulo: "Todo en una sola reserva",
      descripcion:
        "Muy pronto podrás comprar tus tiquetes aéreos + alojamiento, auto y más en un solo lugar.",
    },
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          Complementa tu experiencia
        </h2>

        {/* GRID DE TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl shadow-md hover:shadow-[#ff6b00]/30 transition transform hover:-translate-y-2 duration-300 p-8 text-left flex flex-col items-start"
            >
              <div className="mb-4">{item.icono}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.titulo}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
