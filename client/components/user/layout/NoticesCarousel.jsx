import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaTruckFast } from "react-icons/fa6";
import { ImFire } from "react-icons/im";
import { FaRegHandPeace } from "react-icons/fa6";
import { IoShirtSharp } from "react-icons/io5";
import { MdDiscount } from "react-icons/md";

const NoticesCarousel = () => {
  const notices = [
    <span className="flex items-center justify-center gap-2">
      <FaTruckFast />
      Envíos gratis en compras mayores a $100,000
    </span>,
    <span className="flex items-center justify-center gap-2">
      <ImFire className="text-red-600" />
      Nuevos diseños inspirados en lo retro ya disponibles{" "}
      <ImFire className="text-red-600" />
    </span>,
    <span className="flex items-center justify-center gap-2">
      Inspirate con looks reales de nuestra comunidad <FaRegHandPeace />
    </span>,
    <span className="flex items-center justify-center gap-2">
      Calidad premium que resiste tu ritmo <IoShirtSharp />
    </span>,
    <span className="flex items-center justify-center gap-2">
      Descuentos exclusivos por tiempo limitado <MdDiscount />
    </span>,
  ];

  return (
    <div className="w-full mx-auto py-2 bg-gray-200 z-40">
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="text-center"
      >
        {notices.map((notice, index) => (
          <SwiperSlide key={index} className="text-md font-semibold text-black">
            {notice}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NoticesCarousel;
