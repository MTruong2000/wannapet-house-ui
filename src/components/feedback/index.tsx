import Image from "next/image";
import DecorativeTitle from "../common/DecorativeTitle";

const feedbacks = [
  {
    id: 1,
    image: "/imgs/homepage-feedback-01.webp",
    width: 300,
    height: 300,
    rotate: "-rotate-6",
    name: "Nguyễn Thị Lan",
    rating: 5,
    text: "Dịch vụ grooming tại WannaPet thực sự tuyệt vời! Bé poodle nhà mình được chăm sóc rất kỹ lưỡng, lông mượt mà và thơm tho. Nhân viên rất tận tâm và yêu thương thú cưng.",
  },
  {
    id: 2,
    image: "/imgs/homepage-feedback-02.webp",
    width: 440,
    height: 270,
    rotate: "",
    name: "Trần Minh Khoa",
    rating: 5,
    text: "Mình rất hài lòng khi gửi bé mèo Ba Tư tại WannaPet. Không gian sạch sẽ, thoáng mát, bé được tắm và chải lông chuyên nghiệp. Sẽ quay lại thường xuyên!",
  },
  {
    id: 3,
    image: "/imgs/homepage-feedback-03.webp",
    width: 300,
    height: 300,
    rotate: "rotate-6",
    name: "Phạm Thu Hà",
    rating: 5,
    text: "Bé corgi nhà mình rất nghịch ngợm nhưng các bạn nhân viên xử lý rất khéo léo. Lần nào đến cũng thấy bé vui vẻ, thoải mái. WannaPet xứng đáng 5 sao!",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < count ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function FeedbackSection() {
  return (
    <section className="w-full bg-white py-10 md:py-14">
      <DecorativeTitle text="Feedback" textColor="#9CA960" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 sm:px-6 md:gap-6 lg:flex-row lg:items-start lg:justify-center">
        {feedbacks.map((item, idx) => (
          <div
            key={item.id}
            className={`flex w-full max-w-[380px] flex-col items-center ${
              idx === 1 ? "lg:mt-0" : "lg:mt-12"
            }`}
          >
            <div
              className={`relative z-0 transform transition-all duration-300 hover:scale-105 hover:rotate-0 ${item.rotate}`}
              style={{
                width: idx === 1 ? "min(100%, 320px)" : "min(100%, 260px)",
                height: idx === 1 ? "220px" : "260px",
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 320px, 300px"
                className="object-contain"
                priority
              />
            </div>

            <div
              className={`relative z-10 -mt-8 rounded-2xl border-2 bg-[#F8F3E1] p-5 shadow-md sm:p-6 ${
                idx === 1
                  ? "w-full max-w-[380px] pt-12 sm:pt-14"
                  : "w-full max-w-[280px] pt-10 sm:pt-12"
              }`}
              style={{ borderColor: "var(--primary-color, #9CA960)" }}
            >
              <StarRating count={item.rating} />

              <p className="mt-2 text-sm leading-relaxed text-[#4a4a2e] sm:text-[15px]">
                {item.text}
              </p>

              <p className="mt-3 text-sm font-semibold text-[#9CA960]">
                — {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
