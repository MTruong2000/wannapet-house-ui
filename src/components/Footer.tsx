import Link from "next/link";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="w-full bg-wannapet-dark text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="hover:opacity-90 transition-opacity mb-4">
              <Image
                src="/images/wannapet-logo.png"
                alt="Wannapet Logo"
                width={150}
                height={50}
                className="h-20 sm:h-24 md:h-28 w-auto object-contain"
              ></Image>
            </Link>
            <p className="text-center md:text-left font-bold text-xs sm:text-sm uppercase leading-relaxed">
              Nơi chăm sóc và làm đẹp cho thú cưng
              <br />
              của bạn
            </p>
          </div>

          {/* Brand & Info Section */}
          <div className="col-span-1 md:col-span-1">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8 tracking-wider text-transparent text-center md:text-left"
              style={{ WebkitTextStroke: "1px white" }}
            >
              wannapet
            </h2>

            <div className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <span className="font-bold sm:w-24 sm:shrink-0">Địa chỉ:</span>
                <span className="text-center sm:text-left">
                  LK1-22 Q7 Riverside Complex, 4 Đào Trí, Phú Thuận,
                  <br />
                  Quận 7, Tp Hồ Chí Minh 700000, Việt Nam
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <span className="font-bold sm:w-24 sm:shrink-0">Email:</span>
                <a
                  href="mailto:hello@wannaservice.com"
                  className="hover:text-wannapet-primary transition-colors text-center sm:text-left break-all"
                >
                  hello@wannaservice.com
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <span className="font-bold sm:w-24 sm:shrink-0">Hotline:</span>
                <a
                  href="tel:0813454444"
                  className="hover:text-wannapet-primary transition-colors text-center sm:text-left"
                >
                  081 345 4444
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <span className="font-bold sm:w-24 sm:shrink-0">Website:</span>
                <a
                  href="#"
                  className="hover:text-wannapet-primary transition-colors text-center sm:text-left"
                ></a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex justify-center md:justify-start lg:justify-center">
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-40 md:h-40 lg:w-64 lg:h-64 rounded-full overflow-hidden flex-shrink-0">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d479.4214452562852!2d108.22980893300588!3d15.994161922040233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1774494807813!5m2!1svi!2s"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
