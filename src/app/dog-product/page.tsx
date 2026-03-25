import ProductBlock from "../components/list-product";
const dogProducts = [
  {
    image: "/image/dog_product2.jpg",
    name: "Bánh Thưởng Ogro (phô mai)",
    price: "30.000đ",
  },
  {
   image: "/image/dog_product3.jpg",
    name: "Xúc xích dinh dưỡng cho chó",
    price: "70.000đ",
  },
  {
   image: "/image/dog_product4.jpg",
    name: "Thức ăn hạt cho chó Royal Canin",
    price: "Liên hệ",
  },
  {
    image: "/image/dog_product1.jpg",
    name: "Pate chó Monge",
    price: "Liên hệ",
  },
  
];
export default function DogProduct(){
    return(
         <main>
      <ProductBlock title="THỨC ĂN HẠT CHO CHÓ" products={dogProducts} />

      <ProductBlock title="PATE CHO CHÓ" products={dogProducts} />

      <ProductBlock title="THỨC ĂN DINH DƯỠNG CHO CHÓ" products={dogProducts} />

      <ProductBlock title="PHỤ KIỆN CHO CHÓ" products={dogProducts} />
    </main> 
    )
}