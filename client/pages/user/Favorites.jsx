import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Navegación y enlaces
import NavBar from "../../components/user/layout/NavBar"; // Barra de navegación superior
import Breadcrumb from "../../components/user/layout/Breadcrumb"; // Ruta de navegación
import Footer from "../../components/user/layout/Footer"; // Pie de página
import LoginForm from "../../components/user/forms/LoginForm"; // Componente de login
import RegisterForm from "../../components/user/forms/RegisterForm"; // Componente de registro

const Favorites = () => {
  const [favorites, setFavorites] = useState({ products: [] }); // Estado para almacenar productos favoritos
  const [loading, setLoading] = useState(true); // Estado de carga
  //const navigate = useNavigate(); // Hook de navegación
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [showLoginModal, setShowLoginModal] = useState(false); // Mostrar modal de login
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Mostrar modal de registro

  const token = localStorage.getItem("token"); // Obtener token del localStorage

  // useEffect para comprobar autenticación y cargar favoritos al montar el componente
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      setShowLoginModal(true); // Mostrar login si no hay token
      return;
    }

    setIsAuthenticated(true); // Usuario autenticado

    const fetchFavorites = async () => {
      try {
        if (!token) {
          setShowLoginModal(true); // Verificación extra
          return;
        }

        const response = await fetch("http://localhost:5000/api/favorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar token en header
          },
        });

        const data = await response.json(); // Convertir respuesta en JSON
        setFavorites(data || { products: [] }); // Guardar favoritos o un array vacío
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
      } finally {
        setLoading(false); // Fin del loading
      }
    };

    fetchFavorites(); // Ejecutar función
  }, [token]);

  // Eliminar un producto de favoritos
  const handleRemoveFavorite = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/favorites/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Error al eliminar el favorito");
        return;
      }

      // Actualizar estado local eliminando el producto
      setFavorites((prevFavorites) => {
        const newProducts = prevFavorites.products.filter(
          (fav) => fav.productId._id !== productId
        );
        const newFavoritesIDs = newProducts.map((fav) => fav.productId._id); // Extraer IDs
        localStorage.setItem("favorites", JSON.stringify(newFavoritesIDs)); // Guardar en localStorage
        return {
          ...prevFavorites,
          products: newProducts,
        };
      });
    } catch (error) {
      console.error("Error al eliminar el producto de favoritos:", error);
    }
  };

  // Mostrar pantalla de carga mientras se obtiene la información
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-semibold">Cargando favoritos...</p>
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <div>
        <NavBar />
        <div className="pt-36">
          <Breadcrumb />
        </div>

        <main className="flex flex-col min-h-screen">
          <div className="text-center mt-10">
            <h2 className="text-3xl font-bold mb-4">Acceso Restringido</h2>
            <p className="text-lg">
              Necesitas iniciar sesión para ver tus favoritos.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className=" bg-black text-white my-6 py-2 px-6 uppercase font-semibold tracking-widest opacity-100 hover:opacity-80"
            >
              Iniciar sesión
            </button>
          </div>
        </main>

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
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />

        <Footer />
      </div>
    );
  }

  if (favorites && favorites.products && favorites.products.length === 0) {
    return (
      <div>
        <NavBar />

        <div className="pt-36">
          <Breadcrumb />
        </div>

        <main className="flex flex-col min-h-screen">
          <p className="mt-6">No tienes productos en favoritos.</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <NavBar />

      <div className="pt-36">
        <Breadcrumb /> 
      </div>

      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-oswald font-bold italic tracking-wider uppercase text-black text-5xl text-left mb-6">
            Mis Favoritos
          </h2>
          <hr className="w-full border-t border-gray-300 mb-4" />
          <div className="flex flex-col md:flex-row gap-6 p-6">
            {/* Lista de favoritos */}
            <div className="flex-1 bg-white p-4 text-left shadow-md">
              {favorites.products.map((fav) => (
                <div
                  key={fav.productId._id}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        fav.productId.imageUrl ||
                        "https://via.placeholder.com/150"
                      }
                      alt={fav.productId.name}
                      className="w-28 h-28 rounded-md"
                    />

                    {/* Corrección: Contenedor con flex-col para organizar los elementos verticalmente */}
                    <div className="flex flex-col">
                      <p className="font-semibold text-xl">
                        {fav.productId.description}
                      </p>
                      <div className="price">
                        {fav.productId.offerPrice ? (
                          <>
                            <span className="line-through font-semibold text-gray-400 mr-2">
                              ${fav.productId.price.toLocaleString("es-AR")}
                            </span>
                            <span className="text-green-600 font-semibold">
                              $
                              {fav.productId.offerPrice.toLocaleString("es-AR")}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold">
                            ${fav.productId.price.toLocaleString("es-AR")}
                          </span>
                        )}
                      </div>
                      {/* Contenedor de botones con flex-row para alinearlos horizontalmente */}
                      <div className="flex flex-row gap-4 mt-4">
                        <button
                          className="mb-2 text-black text-sm font-bold tracking-wider border-b-2 border-black hover:bg-gray-300 transition duration-300"
                          onClick={() =>
                            handleRemoveFavorite(fav.productId._id)
                          }
                        > 
                          Eliminar
                        </button>
                        <Link
                          to={`/products/${fav.productId.category.replace(/\s+/g, '-').toLowerCase()}/${fav.productId.subcategory.replace(/\s+/g, '-').toLowerCase()}/${fav.productId._id}`}
                          className="mb-2 text-black text-sm font-bold tracking-wider border-b-2 border-black hover:bg-gray-300 transition duration-300"
                          >
                          Ver más
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;