import ProductBlock from "../components/list_product";
const catProducts = [
  {
    image: "/image/cat_product2.jpg",
    name: "Bánh Thưởng Ogro (phô mai)",
    price: "30.000đ",
  },
  {
   image: "/image/cat_product3.jpg",
    name: "Xúc xích dinh dưỡng cho chó",
    price: "70.000đ",
  },
  {
   image: "/image/cat_product2.jpg",
    name: "Thức ăn hạt cho chó Royal Canin",
    price: "Liên hệ",
  },
  {
    image: "/image/cat_product1.jpg",
    name: "Pate chó Monge",
    price: "Liên hệ",
  },
  
];
export default function CatProduct(){
    return(
         <main>
      <ProductBlock title="THỨC ĂN HẠT CHO mèo" products={catProducts} />

      <ProductBlock title="PATE CHO mèo" products={catProducts} />

      <ProductBlock title="THỨC ĂN DINH DƯỠNG CHO mèo" products={catProducts} />
    </main> 
    )
}