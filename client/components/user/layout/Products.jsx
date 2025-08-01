// ==============================
// Importaciones necesarias
// ==============================
import { useParams, Link } from "react-router-dom"; // Hook para obtener parámetros de la URL y para crear enlaces
import { useEffect, useState } from "react"; // Hooks de React
import NavBar from "./NavBar"; // Componente de navegación
import Breadcrumb from "./Breadcrumb"; // Componente de migas de pan
import Footer from "./Footer"; // Componente de pie de página
import RegisterForm from "../forms/RegisterForm"; // Formulario de registro
import LoginForm from "../forms/LoginForm"; // Formulario de inicio de sesión

// ==============================
// Componente principal
// ==============================
const Products = () => {
  // Obtenemos los parámetros de la URL: categoría, subcategoría e id (aunque `id` no se usa acá)
  const { category, subcategory } = useParams();

  // ==============================
  // Estados del componente
  // ==============================
  const [products, setProducts] = useState([]); // Estado que guarda los productos obtenidos del backend
  const [showLoginModal, setShowLoginModal] = useState(false); // Controla si se muestra el modal de login
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Controla si se muestra el modal de registro

  // =================================================================
  //                EfFECTO PARA CARGAR LOS PRODUCTOS
  // =================================================================

  useEffect(() => {
    // Mostrar en consola los parámetros recibidos por URL
    console.log("Categoria: ", category);
    console.log("Subcategoria: ", subcategory);

    const fetchProducts = async () => {
      try {
        // Crear el endpoint de forma dinámica en base a category y subcategory
        let endpoint = `/api/products/${category
          ?.toLowerCase()
          .replace(/\s+/g, "-")}`; // Ej: "Ropa Hombre" → "ropa-hombre"

        // Si hay subcategoría, se agrega también al endpoint
        if (subcategory) {
          endpoint += `/${subcategory?.toLowerCase().replace(/\s+/g, "-")}`; // Ej: "Remeras Manga Larga" → "remeras-manga-larga"
        }

        console.log("Endpoint construido:", endpoint); // Para verificar que el endpoint esté bien formado

        // Hacer la petición al backend
        const response = await fetch(endpoint);
        const data = await response.json();

        // Guardar los productos en el estado
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error); // Mostrar el error si la petición falla
      }
    };

    fetchProducts(); // Llamar a la función
  }, [category, subcategory]); // Se ejecuta cada vez que cambia category o subcategory

  // ========================================================================
  //             AGRUPAR PRODUCTOS POR CATEGORIA Y SUBCATEGORIA
  // ========================================================================

  const groupByCategoryAndSubcategory = (products) => {
    return products.reduce((result, product) => {
      const { category, subcategory } = product;

      // Si la categoría aún no existe en el resultado, la creamos
      if (!result[category]) {
        result[category] = {};
      }

      // Si la subcategoría aún no existe dentro de la categoría, la creamos
      if (!result[category][subcategory]) {
        result[category][subcategory] = [];
      }

      // Agregar el producto a la subcategoría correspondiente
      result[category][subcategory].push(product);

      return result; // Devolver el resultado acumulado
    }, {}); // Empezar con un objeto vacío
  };

  return (
    <div className="bg-white">
      <NavBar />

      <main className="flex flex-col min-h-screen">

      <div className="pt-36">
        <Breadcrumb />      
      </div>

      {products.length > 0 ? (
        <>
          {/* Agrupar productos por categoría */}
          {Object.entries(groupByCategoryAndSubcategory(products)).map(
            ([category, subcategories]) => (
              <div key={category} className="mb-8">
                {/* Título de la categoría */}
                <div className="text-left border-b border-gray-300 mx-11 my-6">
                  <h2 className="font-oswald font-bold italic tracking-wider uppercase text-black text-5xl text-left mb-4">
                    {category}
                  </h2>
                  <p className="font-oswald font-medium italic tracking-wider text-black text-2xl text-left">
                  Encontrá lo que buscás en URBAN. Estilo urbano, actitud única.
                  </p>
                </div>

                {/* Iterar sobre las subcategorías */}
                {Object.entries(subcategories).map(
                  ([subcategory, productsSubcategory]) => (
                    <div key={subcategory} className="mb-6">
                      {/* Título de la subcategoría */}
                      <h3 className="font-oswald font-bold italic tracking-wider uppercase text-black text-3xl">
                        {subcategory}
                      </h3>

                      {/* Productos de la subcategoría */}
                      <div className="flex flex-wrap justify-center gap-4 m-6">
                        {productsSubcategory
                        .sort((a, b) => a.description.localeCompare(b.description))
                        .map((product) => {
                          return (
                            <div
                              key={product._id}
                              className="w-80 h-auto bg-[#FFEEF2] p-6 border border-transparent hover:border-black relative group transition-all duration-none"
                            >
                              <div className="bg-[#FFEEF2] overflow-hidden">
                                <img
                                  src={product.imageUrl || "/placeholder.jpg"}
                                  alt={product.name}
                                  className="w-full h-60 object-cover rounded-md transition-transform duration-100 hover:scale-125"
                                />
                              </div>

                              {/* Información del producto */}
                              <div className="mt-4 text-left">
                              {product.isNew && (
                                <span className="bg-green-200 text-green-800 px-4 py-1 mb-2 rounded text-sm font-semibold inline-block">
                                  Nuevo
                                </span>
              	                )}
                                <h2 className="text-md text-gray-700 font-semibold">
                                  {product.description}
                                </h2>
                                <div className="price font-bold">
                                  {product.offerPrice ? (
                                    <>
                                      <span className="line-through text-sm text-gray-400">
                                        ${product.price.toLocaleString('es-AR')}
                                      </span>
                                      <span className="text-green-600 text-sm ml-2">
                                        ${product.offerPrice.toLocaleString('es-AR')}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-sm">${product.price.toLocaleString('es-AR')}</span>
                                  )}
                                </div>
                              </div>
                                
                                <div className="mt-4 text-start">
                                  <Link
                                    to={`/products/${product.category.replace(/\s+/g, '-').toLowerCase()}/${product.subcategory.replace(/\s+/g, '-').toLowerCase()}/${product._id}`}
                                    className="mb-2 text-black text-sm px-2 py-1 font-bold tracking-wider border-2 border-black hover:bg-gray-300 transition duration-300"
                                    >
                                    Ver más
                                  </Link>
                                </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            )
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">
          No hay productos disponibles.
        </p>
      )}
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

      </main>
      <Footer />
    </div>
  );
};

export default Products;
