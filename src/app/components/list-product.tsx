"use client";

import Image from "next/image";

type Product = {
  image: string;
  name: string;
  price: string;
};

type ProductBlockProps = {
  title: string;
  products: Product[];
};

export default function ProductBlock({ title, products }: ProductBlockProps) {
  return (
    <section className="w-full bg-wannapet-primary py-[50px] px-[20px]  text-center">
      <h2 className="uppercase text-3xl font-bold text-[#41431B] mb-8">
        {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
        {products.map((item, index) => (
          <div key={index} className="fade-scale-item active bg-white rounded-[16px] overflow-hidden shadow-md">
            <div className="relative w-full aspect-[280/340]">
              <Image src={item.image}
               alt={item.name} 
              fill
              className="transition duration-500 hover:scale-110"
               style={{objectFit:"cover"}
            }/>
            </div>

            <p className="text-lg font-bold text-[#41431B] mt-4">{item.name}</p>
            <p className="text-xl font-bold text-[#9CA960]">{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
