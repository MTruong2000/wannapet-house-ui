import { title } from "process";
import Services from "../components/main-service";
const service=[{
    title:"Pet Grooming",
    mainImage:"/image/service1.jpg",
    list_service:["Tắm và sấy khô","Cắt tỉa tạo kiểu","Làm móng vệ sinh tai","Massage thư giãn"],
    reverse:false
    },
     {title:"Pet hotel",
    mainImage:"/image/service4.jpg",
    list_service:["Phòng riêng có điều hòa","Camera riêng","Spa nhẹ nhàng","Không gian sạch sẽ"],
    reverse:true
    }
]
export default function Service(){
    return(
        <main>
        <h2 className="text-3xl mb-[0px] font-bold mb-8 w-full bg-[#9aa77a] px-[20px] py-[20px] text-center [-webkit-text-stroke:0.5px_#f5f5f5]">DỊCH VỤ</h2>
        <Services service={service[0]} />
        <Services service={service[1]} />
        </main>

    )
}