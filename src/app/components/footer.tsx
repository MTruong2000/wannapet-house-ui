import Link from 'next/link';
import Image from 'next/image';
const Footer = () => {
  return (
    <footer className="w-full bg-wannapet-dark text-white py-12 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-start gap-8">

          <div className="flex flex-col items-center w-1/3">
            <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image
                src="/image/logo.png"
                alt="Wannapet Logo"
                width={150}
                height={50}
                className="h-32 w-auto object-contain mb-4"
            ></Image>
            </Link>
            <p className="text-center font-bold text-sm uppercase leading-relaxed">
              Nơi chăm sóc và làm đẹp cho thú cưng<br />của bạn
            </p>
          </div>


          <div className="w-2/3 pl-10">
            
            <h2 className="text-5xl font-extrabold mb-8 tracking-wider text-transparent" style={{ WebkitTextStroke: '2px white' }}>
              wannapet
            </h2>

            <div className="flex flex-col gap-4 text-sm">
              
              <div className="flex">
                <span className="font-bold w-24 shrink-0">Địa chỉ:</span>
                <span>LK1-22 Q7 Riverside Complex, 4 Đào Trí, Phú Thuận,<br/>Quận 7, Tp Hồ Chí Minh 700000, Việt Nam</span>
              </div>
              
              <div className="flex">
                <span className="font-bold w-24 shrink-0">Email:</span>
                <a href="mailto:hello@wannaservice.com" className="hover:text-wannapet-primary transition-colors">
                  hello@wannaservice.com
                </a>
              </div>
              
              <div className="flex">
                <span className="font-bold w-24 shrink-0">Hotline:</span>
                <a href="tel:0813454444" className="hover:text-wannapet-primary transition-colors">
                  081 345 4444
                </a>
              </div>
              
              <div className="flex">
                <span className="font-bold w-24 shrink-0">Website:</span>
                <a href="#" className="hover:text-wannapet-primary transition-colors">
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
