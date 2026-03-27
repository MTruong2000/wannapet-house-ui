const About = () => {
  return (
    <div className="w-full bg-wannapet-dark py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 mb-8 sm:mb-10 lg:mb-12">
        <h1
          className="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-wider text-transparent text-center"
          style={{ WebkitTextStroke: "1px white" }}
        >
          wannapet
        </h1>
      </div>
      <div className="container mx-auto px-4 mb-8 sm:mb-10 lg:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 justify-center sm:justify-start">
          <h2
            className="hidden text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider text-transparent text-center sm:text-left"
            style={{ WebkitTextStroke: "1px white" }}
          >
            wannapet
          </h2>
          <p
            className="text-base sm:text-lg lg:text-2xl text-white italic font-bold text-center sm:text-left"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            là thiên đường cho những người yêu thích thú cưng tại Thành phố Hồ
            Chí Minh
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 mb-8 sm:mb-10 lg:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 justify-center sm:justify-start">
          <h3
            className="text-xl sm:text-2xl lg:text-3xl text-transparent font-bold text-center sm:text-left"
            style={{ WebkitTextStroke: "1px white" }}
          >
            Dịch vụ và sản phẩm tại
          </h3>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider text-transparent text-center sm:text-left"
            style={{ WebkitTextStroke: "1px white" }}
          >
            wannapet
          </h2>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <ul className="space-y-4 sm:space-y-6 lg:space-y-8 list-disc pl-4 sm:pl-6 marker:text-white">
          <li>
            <div className="flex flex-col sm:flex-row sm:gap-3 lg:gap-4">
              <h4
                className="text-base sm:text-lg lg:text-2xl text-white font-serif underline"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Thức ăn và đồ uống
              </h4>
              <p
                className="text-sm sm:text-base lg:text-2xl text-white italic leading-relaxed mt-2 sm:mt-0"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Chúng tôi cung cấp các loại thức ăn chất lượng cao, từ thức ăn
                khô đến thức ăn ướt, đảm bảo thú cưng của bạn luôn khoẻ mạnh và
                đầy năng lượng.
              </p>
            </div>
          </li>

          <li>
            <div className="flex flex-col sm:flex-row sm:gap-3 lg:gap-4">
              <h4
                className="text-base sm:text-lg lg:text-2xl text-white font-serif underline"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Phụ kiện và đồ chơi
              </h4>
              <p
                className="text-sm sm:text-base lg:text-2xl text-white italic leading-relaxed mt-2 sm:mt-0"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tại đây, bạn có thể tìm thấy mọi thứ từ lều chơi, áo mưa, đồ
                chơi đến ngủ êm ái cho thú cưng của mình.
              </p>
            </div>
          </li>

          <li>
            <div className="flex flex-col sm:flex-row sm:gap-3 lg:gap-4">
              <h4
                className="text-base sm:text-lg lg:text-2xl text-white font-serif underline"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Dịch vụ tắm và cắt tỉa lông
              </h4>
              <p
                className="text-sm sm:text-base lg:text-2xl text-white italic leading-relaxed mt-2 sm:mt-0"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Đội ngũ chuyên nghiệp của chúng tôi sẽ giúp thú cưng của bạn
                luôn sạch sẽ và đẹp đẽ.
              </p>
            </div>
          </li>

          <li>
            <div className="flex flex-col sm:flex-row sm:gap-3 lg:gap-4">
              <h4
                className="text-base sm:text-lg lg:text-2xl text-white font-serif underline"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tư vấn chăm sóc thú cưng
              </h4>
              <p
                className="text-sm sm:text-base lg:text-2xl text-white italic leading-relaxed mt-2 sm:mt-0"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Chúng tôi luôn sẵn sàng tư vấn về dinh dưỡng, sức khỏe và huấn
                luyện cho thú cưng của bạn.
              </p>
            </div>
          </li>

          <li>
            <div className="flex flex-col sm:flex-row sm:gap-3 lg:gap-4">
              <h4
                className="text-base sm:text-lg lg:text-2xl text-white font-serif underline"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Dịch vụ trông giữ thú cưng
              </h4>
              <p
                className="text-sm sm:text-base lg:text-2xl text-white italic leading-relaxed mt-2 sm:mt-0"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Bạn đang có kế hoạch du lịch hoặc công việc bận rộn? Hãy để
                chúng tôi chăm sóc thú cưng của bạn trong thời gian bạn vắng
                nhà. Chúng tôi cam kết đem lại sự an tâm cho bạn và thú cưng của
                bạn.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
