import React from "react";
import { Link } from "react-router-dom";

const TopSelections = () => {
  const trends = [
    {
      name: "Chuck Taylor All Star Black",
      Image:
        "https://i.ibb.co/8LKKBt8L/765d15f997ffd64b6a688de52ff1-removebg-preview.png",
      path: "/products/calzado/converse",
    },
    {
      name: "Reloj Festina Blue",
      Image:
        "https://i.ibb.co/4wr7kwPY/66d61aec794af7a880220e2ccc1e9011-removebg-preview.png",
      path: "/products/accesorios/relojes",
    },
    {
      name: "Chuck Taylor All Star Clasic",
      Image:
        "https://i.ibb.co/6c2dVBkD/1501be9bb3373c1df1017bd160dd-removebg-preview.png",
      path: "/products/calzado/converse",
    },
    {
      name: "Vans Old Skool",
      Image:
        "https://i.ibb.co/Hf3F0gVP/5919ca54a821f82148d48ce28d766180-removebg-preview.png",
      path: "/products/calzado/vans",
    },
  ];

  return (
    <div className="py-6 mx-auto sm:mx-4 md:mx-auto lg:mx-auto">
      <h2 className="font-oswald font-bold italic tracking-wider uppercase text-black mx-4 sm:mx-4 md:mx-0 lg:mx-0 text-5xl text-left mb-6">
        Tendencias
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trends.map((item) => (
          <div
            key={item.name}
            className="group relative text-center bg-gray-200 p-4 transition-all duration-300"
          >
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-8 group-hover:border-gray-300 transition-all duration-300 pointer-events-none"></div>
            <img
              src={item.Image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            {/* Solo el texto es enlace */}
            
            <Link
              to={item.path}
              className="mb-4 mt-4 text-black text-sm font-bold text-left tracking-wider border-b-2 border-black hover:bg-gray-300 transition duration-300 inline-block"
            >
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSelections;
