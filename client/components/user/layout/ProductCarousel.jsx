import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom"

// Componente ProductCarousel con prop 'title' por defecto
const ProductCarousel = ({ title = "Ultimos ingresos" }) => {
  const [products, setProducts] = useState([]); // Estado local para almacenar los productos

  useEffect(() => {
    // Se ejecuta una sola vez al montar el componente
    fetch("http://localhost:5000/api/home/products") // Llamada a la API para obtener productos
      .then((res) => res.json()) // Convertimos la respuesta a JSON
      .then((data) => setProducts(data)) // Guardamos los productos en el estado
      .catch((error) => console.error("Error al obtener productos:", error)); // Manejamos errores
  }, []); // Dependencias vacías: se ejecuta solo una vez al renderizar


  return (
    <div className="container mx-auto py-10 z-40">
      <h2 className="font-oswald font-bold italic tracking-wider uppercase text-black mx-4 sm:mx-4 md:mx-0 lg:mx-0 text-5xl text-left mb-6">{title}</h2>
      
      <Swiper
        loop={true}
        spaceBetween={20} 
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          700: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1400: { slidesPerView: 5, spaceBetween: 20 },
        }}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Navigation]}
        className="mySwiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="w-full max-w-[400px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[400px] h-auto mx-auto sm:mx-4 md:mx-auto lg:mx-auto bg-[#FFEEF2] p-6 border border-transparent hover:border-black transition-all duration-300 group">
              
              {/* Imagen del producto */}
              <div className="bg-[#FFEEF2] overflow-hidden rounded-md">
                <img
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Información del producto */}
              <div className="mt-4 text-left space-y-2">
                <p className="text-sm text-gray-600">{product.description}</p>

                {/* Precio con oferta */}
                <div className="flex items-center gap-2 font-bold">
                  {product.offerPrice ? (
                    <>
                      <span className="line-through text-sm text-gray-500">${product.price.toLocaleString('es-AR')}</span>
                      <span className="text-green-600 text-md">${product.offerPrice.toLocaleString('es-AR')}</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-800">${product.price.toLocaleString('es-AR')}</span>
                  )}
                </div>

                {/*Boton de ver mas*/}
                  <Link
                    to={`/products/${product.category.replace(/\s+/g, '-').toLowerCase()}/${product.subcategory.replace(/\s+/g, '-').toLowerCase()}/${product._id}`}
                    className="mb-2 text-black text-sm font-bold tracking-wider border-b-2 border-black hover:bg-gray-300 transition duration-300"
                    >
                    Ver más
                  </Link>
                </div>
              </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;
