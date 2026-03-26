"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "../styles/main.module.css";

type service = {
  title: string;
  mainImage: string;
  list_service: string[];
  reverse?: boolean;
};

type serviceProps = {
  service: service;
};

export default function MainService({ service }: serviceProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    time: "",
    date: "",
    email: "",
  });
  const [errors, setErrors] = useState<any>({});
  const validate = () => {
    const newErrors: any = {};

    if (!form.name) newErrors.name = "Nhập họ tên";

    if (!form.phone) {
      newErrors.phone = "Nhập số điện thoại";
    } else if (!/^[0-9]{9,11}$/.test(form.phone)) {
      newErrors.phone = "SĐT không hợp lệ";
    }

    if (!form.time) newErrors.time = "Chọn giờ";

    if (!form.date) newErrors.date = "Chọn ngày";

    if (!form.email) {
      newErrors.email = "Nhập email";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email sai";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (validate()) {
      alert("Đặt lịch thành công - Chúng tôi sẽ liên hệ với bạn sớm nhất!");
      setOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <section className={`w-full ${service.reverse ? 'bg-[#41431B]' : 'bg-[#9aa77a]'} px-[20px] py-[20px] text-center`}>

        <div
          className={`${mounted ? 'fade-item' : ''} flex flex-col md:flex-row items-center justify-center py-12 gap-[20px] 
  ${service.reverse ? "md:flex-row-reverse" : ""}`}
        >
          {/* LEFT */}
          <div>
            <Image
              src={service.mainImage}
              alt={service.title}
              width={300}
              height={150}
            />
            <h2 className="uppercase text-2xl font-black text-[#41431B] mx-8 [-webkit-text-stroke:0.5px_#f5f5f5]">
              {service.title}
            </h2>
          </div>
          {/* RIGHT */}
          <div className="relative flex flex-col justify-center gap-[15px] w-[320px]">
            {service.list_service.map((item, index) => (
              <div key={index} className={`mb-2 ${service.reverse ? 'bg-[#9aa77a]' : 'bg-[#41431B]'} rounded-[8px] px-4 py-2 border-[2px] border-[#FFFFFF]`}>
                <p className={`text-lg text-white text-left `}>
                  ✓ {item}
                </p>
              </div>
            ))}

            <button
              onClick={() => setOpen(true)}
              className={`uppercase font-bold flex justify-center items-center gap-2 py-2 px-4 rounded-[8px] transition duration-300 cursor-pointer border-[2px] ${service.reverse ? 'bg-[#41431b] text-[#F8F3E1] border-[#F8F3E1] hover:bg-[#F8F3E1] hover:text-[#41431B] hover:border-[#9aa77a]' : 'bg-[#F8F3E1] text-[#41431B] border-[#41431B] hover:bg-[#41431B] hover:text-[#F8F3E1] hover:border-[#F8F3E1]'}`}
            >
              Đặt lịch ngay
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-[#F8F3E1] rounded-[40px] p-[30px] w-[90%] max-w-[1000px] relative">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>
            <div className="flex items-center justify-center gap-4 mb-[30px]">
              <Image src="/image/logo2.png" alt="Booking" width={800} height={400} />
            </div>
            <form id="booking-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="uppercase">Họ tên</p>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  type="text"
                  placeholder="Tên của bạn"
                  className={`bg-[#9CA960] p-2 rounded-[15px] w-full ${errors.name && "border border-red-500"
                    }`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div>
                <p className="uppercase">Số điện thoại</p>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  type="tel"
                  placeholder="Số điện thoại"
                  className={`bg-[#9CA960] p-2 rounded-[15px] w-full ${errors.phone && "border border-red-500"
                    }`}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              <div>
                <p className="uppercase">Giờ</p>
                <input
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  type="time"
                  className={`bg-[#9CA960] p-2 rounded-[15px] w-full ${errors.time && "border border-red-500"
                    }`}
                />
                {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
              </div>
              <div>
                <p className="uppercase">Ngày</p>
                <input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  type="date"
                  className={`bg-[#9CA960] p-2 rounded-[15px] w-full ${errors.date && "border border-red-500"
                    }`}
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>

              <div>
                <p className="uppercase">Gmail</p>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  placeholder="Email"
                  className={`bg-[#9CA960] p-2 rounded-[15px] w-full ${errors.email && "border border-red-500"
                    }`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div>
                <p className="uppercase">Chi nhánh</p>
                <select className="bg-[#9CA960] p-3 rounded-[15px] w-full text-[#41431B]">
                  <option>Đà Nẵng</option>
                </select>
              </div>
              <div>
                <p className="uppercase">Chọn dịch vụ:</p>
                <select className="bg-[#9CA960] p-3 rounded-[15px] w-full text-[#41431B]">
                  <option>Pet Grooming</option>
                  <option>Pet Hotel</option>
                </select>
              </div>
              <div>
                <p className="uppercase">Lưu ý:</p>
                <p className="">Quý khách hàng chỉ nên đặt lịch trong
                  khoảng thời gian 9h00 - 19h00</p>
              </div>
            </form>
            <button
              type="submit"
              form="booking-form"
              className="uppercase bg-[#41431B] text-white py-2 px-8  rounded-[15px] mt-2 mx-auto block cursor-pointer hover:bg-[#9CA960] "
            >
              Đặt lịch ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
