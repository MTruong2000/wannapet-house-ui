import Image from "next/image";
import Link from "next/link";
import DecorativeTitle from "../common/DecorativeTitle";

const services = [
  {
    id: 1,
    image: "/imgs/pet-grprooming.webp",
    label: "PET GROOMING",
    href: "/dich-vu",
  },
  {
    id: 2,
    image: "/imgs/home-phu-kien-thuc-an.webp",
    label: "PHỤ KIỆN – THỨC ĂN",
    href: "/phu-kien",
  },
  {
    id: 3,
    image: "/imgs/home-hotel.webp",
    label: "HOTEL",
    href: "/dich-vu",
  },
];

export default function FeaturedServices() {
  return (
    <section
      className="relative w-full overflow-hidden px-4 py-13"
      style={{ backgroundColor: "var(--primary-color)" }}
    >
      <DecorativeTitle text="Dịch Vụ Nổi Bật" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-stretch justify-center gap-6 md:flex-row">
        {services.map((service) => (
          <Link
            key={service.id}
            href={service.href}
            className="group flex flex-1 cursor-pointer flex-col items-center gap-3"
          >
            <div className="w-full overflow-hidden bg-white p-2 shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
              <div className="relative aspect-[1] w-full">
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
              className="w-full rounded-full px-4 py-3 text-center text-sm font-bold tracking-widest shadow transition-all duration-300 group-hover:scale-105 md:text-base"
              style={{
                backgroundColor: "var(--secondary-color)",
                color: "#5a6b2a",
                fontFamily: "'SVN-Gilroy', 'Nunito', sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              {service.label}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
