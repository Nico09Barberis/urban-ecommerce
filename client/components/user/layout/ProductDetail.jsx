// ==============================
// Importaciones necesarias
// ==============================
import { useState, useEffect } from "react"; // Hooks de React
import { useParams } from "react-router-dom"; // Hook para acceder a los parámetros de la URL (category, subcategory, id)
import { PiHandbagBold } from "react-icons/pi"; // Ícono de bolso de compras
import Toast from "./Toast"; // Componente personalizado para mostrar notificaciones
import { toast } from "react-hot-toast"; // Librería para mostrar mensajes emergentes (tipo notificaciones)
import Breadcrumb from "./Breadcrumb"; // Componente de navegación tipo "migas de pan"
import Footer from "./Footer"; // Pie de página
import NavBar from "./NavBar"; // Barra de navegación
import { IoIosInformationCircleOutline } from "react-icons/io"; // Ícono de información
import LoginForm from "../forms/LoginForm"; // Formulario de login
import RegisterForm from "../forms/RegisterForm"; // Formulario de registro
import ProductCarousel from "../layout/ProductCarousel"; // Carrusel de productos
import { GoHeartFill } from "react-icons/go"; // Ícono de corazón para favoritos

// ==============================
// Componente principal
// ==============================
const ProductDetail = () => {
  // Obtenemos los parámetros de la URL: categoría, subcategoría e ID del producto
  const { category, subcategory, id } = useParams();
  console.log("id recibido: ", id);

  // ==============================
  // Estados del componente
  // ==============================
  const [product, setProduct] = useState({ variants: [] }); // Estado para guardar los datos del producto actual
  const [favorites, setFavorites] = useState([]); // Estado para los productos marcados como favoritos por el usuario
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true); // Bandera para saber si los favoritos están cargando
  const [selectedSize, setSelectedSize] = useState(""); // Talle seleccionado por el usuario
  const [selectedQuantity, setSelectedQuantity] = useState(1); // Cantidad del producto seleccionada
  const [selectedStock, setSelectedStock] = useState(null); // Stock disponible para el talle seleccionado
  const [showLoginModal, setShowLoginModal] = useState(false); // Mostrar/ocultar modal de login
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Mostrar/ocultar modal de registro
  const [toastMessage, setToastMessage] = useState(""); // Mensaje a mostrar en el Toast

  // Recuperamos el token de autenticación del usuario desde localStorage
  const token = localStorage.getItem("token");

  // ==============================
  // Fetch del producto desde el backend
  // ==============================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Petición al backend con los parámetros de la URL
        const response = await fetch(
          `http://localhost:5000/api/products/${category}/${subcategory}/${id}`
        );
        if (!response.ok) throw new Error("No se pudo obtener el producto");

        const data = await response.json(); // Parseamos la respuesta
        console.log("Producto recibido: ", data);

        // Guardamos el producto en el estado, incluyendo sus variantes
        setProduct({
          ...data,
          variants: data.variants || [], // Si no hay variantes, ponemos un array vacío
        });
      } catch (error) {
        console.error("Error al obtener el producto: ", error);
      }
    };

    fetchProduct(); // Ejecutamos la función
  }, [id, category, subcategory]); // Se ejecuta cada vez que cambie el ID, categoría o subcategoría

  // ==============================
  // Fetch de favoritos
  // ==============================
  useEffect(() => {
    // Primero se leen los favoritos almacenados localmente (por si el usuario no está logueado)
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    // Si hay token, pedir los favoritos desde el backend
    const fetchFavorites = async () => {
      try {
        if (!token) {
          console.warn("Token no disponible para obtener favoritos");
          return;
        }

        const response = await fetch("http://localhost:5000/api/favorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token para autenticar
          },
        });

        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json(); // Se parsea la respuesta
        const favoritesIds = data.products.map((fav) => fav.productId._id); // Extraer solo los IDs
        setFavorites(favoritesIds); // Guardar los IDs de los favoritos
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
      } finally {
        setIsLoadingFavorites(false); // Marcamos que terminó la carga
      }
    };

    fetchFavorites();
  }, [token]); // Se ejecuta cuando cambia el token

  // Sincronizar favoritos con localStorage

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites)); // Guardamos los favoritos actualizados
  }, [favorites]);

  // =================================================================================
  //                      FUNCION PARA AGREGAR / QUITAR FAVORITO
  // =================================================================================
  
  const handleAddToFavorites = async (productId) => {
    if (!token) {
      setShowLoginModal(true); // Si no está logueado, mostrar el modal
      return;
    }

    const isFavorite = favorites.includes(productId); // Verificar si ya está en favoritos

    // Crear la nueva lista de favoritos según si se agrega o se quita
    const updateFavorites = isFavorite
      ? favorites.filter((favId) => favId !== productId) // Quitar el producto
      : [...new Set([favorites, productId])]; // Agrega el producto (sin duplicados)

    setFavorites(updateFavorites); // Actualizar el estado de favoritos

    try {
      // Definir si es POST (agregar) o DELETE (remover)
      const method = isFavorite ? "DELETE" : "POST";
      const url = isFavorite
        ? `http://localhost:5000/api/favorites/${productId}`
        : "http://localhost:5000/api/favorites";

      // Hacer la petición al backend
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: method === "POST" ? JSON.stringify({ productId }) : null, // Solo enviar body en POST
      });

      if (!response.ok) {
        throw new Error(`Error al ${method === "POST" ? "agregar" : "remover"} favorito`);
      }

      // Mostrar un mensaje con éxito
      setToastMessage(`Producto ${method === "POST" ? "agregado a" : "removido de"} favoritos correctamente`);
    } catch (error) {
      console.error(`Error al modificar favoritos:`, error);
      setToastMessage(`No se pudo ${isFavorite ? "remover" : "agregar"} el producto de favoritos`);

      // Revertir los cambios si falló
      setFavorites(favorites);
    }
  };

  // =================================================================================
  //                           AGREGAR PRODUCTO AL CARRITO
  // =================================================================================

  const handleAddToCart = async (productId, selectedSize, quantity) => {
    console.log("Token desde localStorage:", token);
    console.log("Claves en localstorage: ", Object.keys(localStorage));

    // Si el producto tiene variantes (talles) y no se seleccionó ninguno, mostrar un aviso
    if ((product.variants?.length || 0) > 0 && !selectedSize) {
      toast("Por favor seleccioná un talle antes de agregar al carrito.");
      return;
    }

    // Si el usuario no está logueado, mostrar el modal
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    // Si el producto no tiene variantes y no hay stock, no se puede agregar
    if ((product.variants?.length || 0) === 0 && product.stock <= 0) {
      toast("Este producto no tiene stock disponible");
      return;
    }

    // Mostrar los datos que se van a enviar
    console.log("Datos enviados al backend:", { productId, quantity, selectedSize });

    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity, selectedSize }),
      });

      const data = await response.json();
      console.log("Producto agregado al carrito: ", data.message);

      if (!response.ok) {
        throw new Error(data.message || "Error al agregar producto al carrito");
      }

      setToastMessage("Producto agregado al carrito correctamente!");
    } catch (error) {
      console.log("Error al agregar producto al carrito: ", error);
      setToastMessage("No se pudo agregar el producto al carrito");
    }
  };

  // =================================================================================
  //                   COMPROBAR SI EL PRODUCTO ESTÁ EN FAVORITOS
  // =================================================================================

  const isFavorite = product && favorites.length > 0
    ? favorites.includes(product._id?.toString()) // Convertir el ID a string para prevenir errores
    : false;


return (
  <div className="bg-white">
    <NavBar />
    <div className="pt-36">
      <Breadcrumb />
    </div>
    <main className="flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Columna izquierda: Imagen */}
          <div className="relative group flex justify-center bg-[#FFEEF2] overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[600px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Botón favorito */}
            <button
              className="absolute top-3 right-3 p-2"
              onClick={() => handleAddToFavorites(product._id)}
              disabled={!product}
            >
              {isFavorite ? (
                <GoHeartFill className="text-red-500 text-2xl" />
              ) : (
                <GoHeartFill className="text-gray-400 text-2xl" />
              )}
            </button>
          </div>

          {/* Columna derecha: Información */}
          <div className="flex flex-col justify-center space-y-4 text-left">
            <h1 className="font-oswald font-bold italic tracking-wider text-4xl uppercase">{product.description}</h1>

            {product.isNew && (
              <span className="bg-green-200 text-green-800 px-4 py-1 rounded text-sm font-semibold inline-block max-w-max">
                Nuevo
              </span>
            )}
            <div className="price font-bold">
            {product.offerPrice ? (
              <>
                {product.price !== undefined && (
                  <span className="line-through text-lg text-gray-400">
                    ${Number(product.price).toLocaleString("es-AR")}
                  </span>
                )}
                <span className="text-green-600 text-lg ml-2">
                  ${Number(product.offerPrice).toLocaleString("es-AR")}
                </span>
              </>
            ) : (
              product.price !== undefined && (
                <span className="text-lg">
                  ${Number(product.price).toLocaleString("es-AR")}
                </span>
              )
            )}
          </div>


           {/* ======================== SI TIENE VARIANTES (Talles) ======================= */}
            { product && product.variants && product.variants.length > 0 ? (
              <div className="mb-4">
                <p>Talle:</p>
                <div className="grid grid-cols-4 gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                    key={index}
                    onClick={() => {
                      if (variant.stock > 0) {
                          setSelectedSize(variant.size);
                          setSelectedStock(variant.stock);
                        }
                      }}
                      className={`px-4 py-2 font-medium transition-colors duration-200
                        ${
                          variant.stock === 0
                            ? "bg-[#FFEEF2] text-gray-400 cursor-not-allowed"
                            : selectedSize === variant.size
                            ? "bg-black text-white"
                            : "bg-[#FFEEF2] text-black hover:bg-black hover:text-white"
                        }`}
                      disabled={variant.stock === 0}
                      title={variant.stock === 0 ? "Sin stock" : ""}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
                {/*Alerta de poco stock*/}
                {selectedStock !== null && selectedStock <=5 && (
                  <p className="mt-2 text-sm text-red-600">
                    ¡Quedan solo {selectedStock} unidades disponibles!
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* ======================== SI NO TIENE VARIANTES ======================= */}
                <div className="mb-4 flex items-center gap-2">
                  <label htmlFor="quantity" className="font-medium">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    className="w-20 border rounded p-2"
                  />
                  <span className="text-sm text-gray-500">(Stock: {product.stock})</span>
                </div>
              </>
            )}


            <div className="flex items-center gap-2 text-gray-800 border border-black py-2 px-4 self-start">
              <IoIosInformationCircleOutline />
              <p className="text-sm">
                <strong>talle real</strong>. Te recomendamos pedir tu talle habitual
              </p>
            </div>

            <p className="text-gray-800">
              {product.details || "Sin descripción adicional"}
            </p>
            <button
              className={`py-2 px-4 border-2 flex items-center gap-5 self-start border-black transition-colors duration-300
                ${
                  (selectedSize || product.variants.length === 0)
                    ? "bg-white text-black hover:bg-black hover:text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              onClick={() => handleAddToCart(product._id, selectedSize, selectedQuantity)}
              disabled={(product.variants?.length || 0) > 0 && !selectedSize}
            >
              agregar al carrito <PiHandbagBold fontSize={20} />
            </button>
            <div className="mt-4 uppercase italic font-bold underline">
                ¡envio gratis a partir de $100.000!
            </div>
          </div>

        </div>

      </div>

      <div className="mt-6 mx-4">
        <ProductCarousel title="Completa tu outfit" />
      </div>

      <LoginForm
        showModal={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterForm
        showModal={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}

    </main>
    <Footer />
  </div>
);

};

export default ProductDetail;