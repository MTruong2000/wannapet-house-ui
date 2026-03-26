import Image from "next/image";
type ContactProps = {
  backgroundColor?: string;
};
export default function Contact({ backgroundColor }: ContactProps) {
    return (
        <section className={`flex flex-col md:flex-row justify-between w-full ${backgroundColor} h-auto`}>
            <div className="relative h-auto w-full md:w-[49%] aspect-3/2 ">
                <Image src="/image/left_image_contact.jpg" alt="Contact" fill className=" md:rounded-tr-[150px] object-cover" />
                <div className="flex flex-col inset-0 bg-black/50 w-full h-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:rounded-tr-[150px]">
                    <h2 className="uppercase font-extrabold text-[clamp(24px,3vw,20px)] text-white">Đăng ký nhận tin</h2>
                    <form className="flex flex-col mt-4 gap-2 items-center">
                        <div className="flex flex-col md:flex-row gap-[5px]">
                            <input type="text" placeholder="Số điện thoại" className="text-white placeholder:text-white/70 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-wannapet-secondary border border-white/50" />
                            <input type="email" placeholder="Nhập email của bạn" className="text-white placeholder:text-white/70 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-wannapet-secondary border border-white/50" />
                        </div>
                        <button type="submit" className="cursor-pointer md:w-1/2 px-4 py-2 bg-wannapet-dark text-white rounded-[25px] hover:bg-wannapet-primary transition-colors">Đăng ký ngay</button>
                    </form>
                </div>
            </div>
            <div className="relative h-auto w-full md:w-[49%] aspect-3/2 ">
                <Image src="/image/right_image_contact.jpg" alt="Contact" fill className="md:rounded-tl-[150px] object-cover" />
                <div className="flex flex-col inset-0 bg-black/50 w-full h-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:rounded-tl-[150px]">
                    <h2 className="uppercase font-extrabold text-[clamp(24px,3vw,20px)] text-white">Kết nối mạng xã hội</h2>
                    <div className="flex gap-4 mt-4">
                        <a href="">
                            <Image src="/image/fb_logo.png" alt="Facebook" width={75} height={75} />
                        </a>
                        <a href="">
                            <Image src="/image/zalo_logo.png" alt="Facebook" width={75} height={75} />
                        </a>
                        <a href="">
                            <Image src="/image/tiktok_logo.png" alt="Facebook" width={75} height={75} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
