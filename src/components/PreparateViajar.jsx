import { ClipboardCheck, HelpCircle, Globe2 } from "lucide-react";

export default function PreparateViajar() {
  const items = [
    {
      icono: <ClipboardCheck className="text-[#ff6b00]" size={50} />,
      titulo: "Check-in online",
      descripcion: "Obtén tu pase de abordar y ahorra tiempo en el aeropuerto.",
    },
    {
      icono: <HelpCircle className="text-[#ff6b00]" size={50} />,
      titulo: "Centro de ayuda",
      descripcion:
        "Busca y encuentra información útil para resolver tus preguntas.",
    },
    {
      icono: <Globe2 className="text-[#ff6b00]" size={50} />,
      titulo: "Requisitos para viajar",
      descripcion:
        "Infórmate acerca de visas, vacunas y demás documentos antes de tu vuelo.",
    },
  ];

  return (
    <section className="bg-[#000000] py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-12">
          Prepárate para viajar
        </h2>

        {/* GRID DE TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-[#111111] rounded-2xl shadow-lg hover:shadow-[#ff6b00]/30 transition transform hover:-translate-y-2 duration-300 p-8 text-left flex flex-col items-start"
            >
              <div className="mb-4">{item.icono}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.titulo}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {item.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
