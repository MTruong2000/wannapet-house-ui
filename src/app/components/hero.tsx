"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full bg-[#d9d4c2] py-[80px] px-[20px]">
      <div className="flex flex-col md:flex-row justify-center items-center relative gap-[40px]">     
        <div className="w-full md:w-1/2">        
          <Image
            src="/image/hero2.png" 
            alt="header"
            width={360}
            height={100}
            className=""
          />        
          <p className=" font-[ir] text-xl" >
            wanwannapet với hơn 10 năm kinh nghiệm,
            cung cấp đầy đủ các sản phẩm và dịch vụ
            chăm sóc thú cưng chất lượng cao. Chúng tôi có
            đa dạng các loài vật cưng, phụ kiện và thức ăn,
            cùng với đội ngũ nhân viên chuyên nghiệp luôn
            sẵn sàng hỗ trợ khách hàng. Hãy đến wannapet
            để khám phá thế giới của những người bạn đáng yêu!
          </p>
        </div>       
        <div className="flex flex-col gap-[20px]">
         
            <Image
              src="/image/hero.png"
              alt="pet"
              width={500}
              height={500}
            />        
          <button className="bg-[#9aa77a] text-white py-2 px-4 rounded-[25px] hover:bg-[#fff] hover:text-[#5D2906] max-w-[300px] mx-auto cursor-pointer">
            Tìm hiểu thêm về <b>wannapet</b>
          </button>
        </div>
      </div>
    </section>
  );
}
