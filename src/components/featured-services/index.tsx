import Image from "next/image";
import DecorativeTitle from "../common/DecorativeTitle";

const services = [
  {
    id: 1,
    image: "/imgs/pet-grprooming.webp",
    label: "PET GROOMING",
  },
  {
    id: 2,
    image: "/imgs/home-phu-kien-thuc-an.webp",
    label: "PHỤ KIỆN – THỨC ĂN",
  },
  {
    id: 3,
    image: "/imgs/home-hotel.webp",
    label: "HOTEL",
  },
];

export default function FeaturedServices() {
  return (
    <section
      className="relative w-full py-13 px-4 overflow-hidden"
      style={{ backgroundColor: "var(--primary-color)" }}
    >
      <DecorativeTitle text="Dịch Vụ Nổi Bật" />

      <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-5xl mx-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col items-center gap-3 flex-1 group cursor-pointer"
          >
            <div className="w-full overflow-hidden p-2 bg-white shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
              <div className="relative w-full aspect-[1]">
                <Image
                  src={service.image}
                  alt={service.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            <div
              className="w-full text-center rounded-full py-3 px-4 font-bold text-sm md:text-base tracking-widest shadow transition-all duration-300 group-hover:scale-105"
              style={{
                backgroundColor: "var(--secondary-color)",
                color: "#5a6b2a",
                fontFamily: "'SVN-Gilroy', 'Nunito', sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              {service.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
