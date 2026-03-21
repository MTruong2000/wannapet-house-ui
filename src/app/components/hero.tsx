"use client";

import Image from "next/image";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>

        {/* LEFT */}
        <div>
          {/* Header Image */}
          <Image
            src="/image/hero2.jpg" // 👈 ảnh header
            alt="header"
            width={180}
            height={50}
            className={styles.headerImage}
          />

          

          <p className={styles.desc}>
            wanwannapet với hơn 10 năm kinh nghiệm,
cung cấp đầy đủ các sản phẩm và dịch vụ
chăm sóc thú cưng chất lượng cao. Chúng tôi có
đa dạng các loài vật cưng, phụ kiện và thức ăn,
cùng với đội ngũ nhân viên chuyên nghiệp luôn
sẵn sàng hỗ trợ khách hàng. Hãy đến wannapet
để khám phá thế giới của những người bạn đáng yêu!
          </p>
        </div>

        {/* RIGHT */}
        <div className={styles.imageWrapper}>
          <div className={styles.bgShape}></div>

          <div className={styles.borderShape}>
            <Image
              src="/image/hero1.jpg"
              alt="pet"
              width={350}
              height={350}
            />
          </div>

          {/* BUTTON dưới image */}
          <button className={styles.buttonRight}>
            Tìm hiểu thêm về <b>wannapet</b>
          </button>
        </div>

      </div>
    </section>
  );
}