import { Link } from "react-router-dom";

const PopularItems = () => {
  const popularProducts = [
    { name: "Hoodies", path: "/products/hombre/hoodies" },
    { name: "Jeans", path: "/products/hombre/jeans" },
    { name: "Medias", path: "/products/accesorios/medias" },
    { name: "Converse", path: "/products/calzado/converse" },
    { name: "Vans", path: "/products/calzado/vans" },
    { name: "Relojes", path: "/products/accesorios/relojes" },
  ];

  return (
    <div className="my-9 z-40">
      <h2 className="font-oswald font-bold italic tracking-wider uppercase text-black mx-4 sm:mx-4 md:mx-0 lg:mx-0 text-5xl text-left mb-6">
        Popular ahora
      </h2>
      {/* Grid para dividir en 3 columnas */}
      <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-6 text-left font-oswald font-bold text-4xl italic tracking-wider">
        {popularProducts.map((product) => (
          <Link
            key={product.name}
            to={product.path}
            className="relative block pb-2 text-black group transition-all duration-300"
          >
            {product.name}
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black origin-bottom transition-all duration-0 group-hover:h-[10px]"></span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularItems;
