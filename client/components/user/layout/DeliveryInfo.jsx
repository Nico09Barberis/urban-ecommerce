import React from "react";
import { FaTruckFast } from "react-icons/fa6";


const DeliveryInfo = () => {
  return (
    <div className="flex items-center justify-center text-black my-6 p-4">
      <FaTruckFast className="sm:text-4xl md:text-5xl lg:text-5xl mr-2 animate-bounce" />
      <p className="font-oswald font-bold italic tracking-wider uppercase text-black text-left sm:text-4xl md:text-5xl lg:text-5xl mb-6">Envíos a todo el país</p>
    </div>
  );
};

export default DeliveryInfo;
