import ProductBlock from "../components/list_product";
const accessories = [
  {
    image: "/image/accessories1.jpg",
    name: "Balo Thú Cưng Trắng",
    price: "Liên hệ",
  },
  {
   image: "/image/accessories2.jpg",
    name: "Balo Phi Hành Gia Hồng",
    price: "Liên hệ",
  },
  {
   image: "/image/accessories3.jpg",
    name: "Balo Phi Hành Gia Nâu",
    price: "Liên hệ",
  },
  {
    image: "/image/accessories4.jpg",
    name: "Balo Thú Phi Hành Gia Xanh Nhạt",
    price: "Liên hệ",
  },
   {
    image: "/image/accessories5.jpg",
    name: "Balo Pet Sky Hồng Xanh",
    price: "Liên hệ",
  },
   {
    image: "/image/accessories6.jpg",
    name: "Balo Pet Sky Hồng Xanh",
    price: "Liên hệ",
  },
  
];
export default function CatProduct(){
    return(
         <main>
      <ProductBlock title="phụ kiện" products={accessories} />
    </main> 
    )
}