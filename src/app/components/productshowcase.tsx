"use client";

import Image from "next/image";
import styles from "../styles/productshowcase.module.css";

type ProductCardProps = {
  src: string;
};

type ProductBlockProps = {
  title: string;
  mainImage: string;
  header_image_left: string[];
  header_image_right: string[];
  products: string[];
  reverse?: boolean;
};

const sections = [
  {
    id: 1,
    title: "Mua Đồ Cho Chó",
    mainImage: "/image/main_dog_image.jpg",
    reverse: false,
    header_image_left:[
      "/image/header_image1.png",
    ],
    header_image_right:[      
      "/image/dog_header_image.png",
    ],
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
     header_image_left:[
      "/image/header_image1.png",
    ],
    header_image_right:[
      "/image/cat_header_image.png",
    ],
    products: [
      "/image/product_cat1.jpg",
      "/image/product_cat2.jpg",
      "/image/product_cat3.jpg",
    ],
  },
   {
    id: 3,
    title: "Phụ Kiện Chó & Mèo",
    mainImage: "/image/phukien.jpg",
    reverse: false,
     header_image_left:[
      "/image/cat_header_image.png",
    ],
    header_image_right:[
      "/image/dog_header_image.png",
    ],
    products: [
      "/image/phukien1.jpg",
      "/image/phukien2.jpg",
      "/image/phukien3.jpg",
    ],
  },
];

function ProductCard({ src }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles["image-wrap"]}>
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
  header_image_left, 
  header_image_right,
  products,
  reverse,
}: ProductBlockProps) {
  return (
    <div className={`${styles.block} ${reverse ? styles.reverse : ""}`}>

      {/* IMAGE */}
      <div className={styles.left}>
        <div className={styles["left-border"]}></div>

        <div className={styles["left-image"]}>
          <Image src={mainImage} alt="" fill className={styles.image} />
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.right}>
          <div className={styles["header-row"]}>
  <div className={styles["header-left-wrapper"]}>
    <Image src={header_image_left[0]} alt="" fill />
  </div>

  <h2 className={styles.title}>{title}</h2>

  <div className={styles["header-right-wrapper"]}>
    <Image src={header_image_right[0]} alt="" fill />
  </div>
</div>
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
