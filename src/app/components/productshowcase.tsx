"use client";

import Image from "next/image";
import styles from "./productshowcase.module.css";

type ProductCardProps = {
  src: string;
};

type ProductBlockProps = {
  title: string;
  mainImage: string;
  products: string[];
  reverse?: boolean;
};

const sections = [
  {
    id: 1,
    title: "Mua Đồ Cho Chó",
    mainImage: "/image/main_dog_image.jpg",
    reverse: false,
    products: [
      "/image/product1.jpg",
      "/image/product2.jpg",
      "/image/product3.jpg",
    ],
  },
  {
    id: 2,
    title: "Mua Đồ Cho Mèo",
    mainImage: "/image/main_cat_image.jpg",
    reverse: true,
    products: [
      "/image/product_cat1.jpg",
      "/image/product_cat2.jpg",
      "/image/product_cat3.jpg",
    ],
  },
];

function ProductCard({ src }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <Image src={src} alt="" fill className={styles.image} />
      </div>

      <button className={styles.btn}>
        Xem thêm
      </button>
    </div>
  );
}

function ProductBlock({
  title,
  mainImage,
  products,
  reverse,
}: ProductBlockProps) {
  return (
    <div className={`${styles.block} ${reverse ? styles.reverse : ""}`}>

      {/* IMAGE */}
      <div className={styles.left}>
        <div className={styles.leftBorder}></div>

        <div className={styles.leftImage}>
          <Image src={mainImage} alt="" fill className={styles.image} />
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.right}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.products}>
          {products.map((item, index) => (
            <ProductCard key={index} src={item} />
          ))}
        </div>
      </div>

    </div>
  );
}

export default function ProductShowcase() {
  return (
    <section className={styles.section}>
      {sections.map((section) => (
        <ProductBlock key={section.id} {...section} />
      ))}
    </section>
  );
}