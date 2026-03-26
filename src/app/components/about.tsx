const About = () => {
  return (
    <div className="w-full bg-wannapet-dark py-16">
      <div className="container mx-auto px-4 block">
        <h1
          className="text-8xl font-extrabold mb-8 tracking-wider text-transparent text-center"
          style={{ WebkitTextStroke: "2px white" }}
        >
          wannapet
        </h1>
      </div>
      <div className="container mx-auto px-4 flex items-baseline gap-2 justify-left">
        <h2
          className="text-4xl font-extrabold tracking-wider text-transparent "
          style={{ WebkitTextStroke: "2px white" }}
        >
          wannapet
        </h2>
        <p
          className="text-2xl text-white italic font-bold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          là thiên đường cho những người yêu thích thú cưng tại Thành phố Hồ Chí
          Minh
        </p>
      </div>
      <div className="container mx-auto px-4 flex items-baseline gap-2 justify-left mt-10">
        <h3
          className="text-xl text-transparent font-bold"
          style={{ WebkitTextStroke: "1px white" }}
        >
          Dịch vụ và sản phẩm tại
        </h3>
        <h2
          className="text-4xl font-extrabold tracking-wider text-transparent text-center"
          style={{ WebkitTextStroke: "2px white" }}
        >
          wannapet
        </h2>
      </div>
      <div className="container mx-auto px-4 flex items-baseline gap-2 justify-left mt-10">
  {/* Thêm pl-6 để dấu chấm không bị che khuất và space-y-4 để tạo khoảng cách giữa các li */}
  <ul className="list-disc pl-6 space-y-4 marker:text-white">
    <li>
      {/* Đưa flex vào thẻ div bên trong li */}
      <div className="flex items-baseline gap-4">
        <h2
          className="text-2xl text-white font-serif underline whitespace-nowrap"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Thức ăn và đồ uống
        </h2>
        <p
          className="text-2xl text-white italic leading-relaxed"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Chúng tôi cung cấp các loại thức ăn chất lượng cao, từ thức ăn khô
          đến thức ăn ướt, đảm bảo thú cưng của bạn luôn khoẻ mạnh và đầy
          năng lượng.
        </p>
      </div>
    </li>

    <li>
      <div className="flex items-baseline gap-4">
        <h2
          className="text-2xl text-white font-serif underline whitespace-nowrap"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Phụ kiện và đồ chơi
        </h2>
        <p
          className="text-2xl text-white italic leading-relaxed"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Tại đây, bạn có thể tìm thấy mọi thứ từ lều chơi, áo mưa, đồ chơi
          đến ngủ êm ái cho thú cưng của mình.
        </p>
      </div>
    </li>

    <li>
      <div className="flex items-baseline gap-4">
        <h2
          className="text-2xl text-white font-serif underline whitespace-nowrap"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Dịch vụ tắm và cắt tỉa lông
        </h2>
        <p
          className="text-2xl text-white italic leading-relaxed"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Đội ngũ chuyên nghiệp của chúng tôi sẽ giúp thú cưng của bạn luôn
          sạch sẽ và đẹp đẽ.
        </p>
      </div>
    </li>

    <li>
      <div className="flex items-baseline gap-4">
        <h2
          className="text-2xl text-white font-serif underline whitespace-nowrap"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Tư vấn chăm sóc thú cưng
        </h2>
        <p
          className="text-2xl text-white italic leading-relaxed"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Chúng tôi luôn sẵn sàng tư vấn về dinh dưỡng, sức khỏe và huấn
          luyện cho thú cưng của bạn.
        </p>
      </div>
    </li>

    <li>
      <div className="flex items-baseline gap-4">
        <h2
          className="text-2xl text-white font-serif underline whitespace-nowrap"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Dịch vụ trông giữ thú cưng
        </h2>
        <p
          className="text-2xl text-white italic leading-relaxed "
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Bạn đang có kế hoạch du lịch hoặc công việc bận rộn? Hãy để chúng
          tôi chăm sóc thú cưng của bạn trong thời gian bạn vắng nhà. Chúng
          tôi cam kết đem lại sự an tâm cho bạn và thú cưng của bạn.
        </p>
      </div>
    </li>
  </ul>
</div>
    </div>
  );
};

export default About;
