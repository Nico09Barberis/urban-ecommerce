// Importaciones necesarias desde React, React Router, librerías y componentes personalizados
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Btn from "../../../components/user/layout/Btn";
import Footer from "../../../components/user/layout/Footer";
import LoginForm from "../../../components/user/forms/LoginForm";
import RegisterForm from "../../../components/user/forms/RegisterForm"; 

const Cart = () => {
  // Estados para manejar los ítems del carrito, subtotal, costo de envío y total general
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(5000);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados para autenticación y modales de login/registro
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // useEffect para cargar el carrito al montar el componente
  useEffect(() => {
    // Si no hay token, el usuario no está autenticado
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      setShowLoginModal(true); // Mostrar modal de login
      return;
    }

    // Usuario autenticado
    setIsAuthenticated(true);

    const fetchCartData = async () => {
      try {
        // Verificar token nuevamente antes de realizar la petición
        if (!token) {
          setShowLoginModal(true);
          return;
        }

        // Petición GET al backend para obtener los ítems del carrito
        const response = await fetch("http://localhost:5000/api/cart/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        console.log("Datos del carrito:", data);

        // Establecer ítems recibidos
        const cartItems = data?.items || [];
        setItems(cartItems);
      } catch (error) {
        console.error("Error al obtener los datos del carrito:", error);
      } finally {
        setLoading(false); // Marcar finalizada la carga
      }
    };

    // Llamar a la función para cargar datos del carrito
    fetchCartData();
  }, [token]);

  // useEffect para calcular subtotal y total cada vez que cambian los ítems o el costo de envío
  useEffect(() => {
    const calculatedSubtotal = items.reduce((acc, item) => {
      const priceToUse = item.productId.offerPrice || item.productId.price;
      return acc + priceToUse * item.quantity;
    }, 0);

    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal + shippingCost);
  }, [items, shippingCost]); // Dependencias

  // useEffect para calcular costo de envío dinámicamente según el subtotal
  useEffect(() => {
    const calculateShippingCost = () => {
      if (subtotal > 100000) {
        setShippingCost(0); // Envío gratis si el subtotal supera los $100.000
      } else {
        setShippingCost(5000); // Costo fijo de envío
      }
    };

    calculateShippingCost();
  }, [subtotal]);

  //==========================================================================
  //           FUNCION PARA ELIMINAR UN PRODUCTO DEL CARRITO
  //==========================================================================
  
  const handleRemoveItem = async (productId, size = null) => {
    try {
      // Enviar también la talla si existe (productos con variantes)
      const dataToSend = size ? { productId, size } : { productId };

      console.log("Datos enviados: ", dataToSend);
      const token = localStorage.getItem("token");

      // Petición al backend para eliminar el producto del carrito
      const response = await fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error al eliminar el producto: ", data.message);
        toast(data.message || "Error al eliminar el producto");
        return;
      }

      // Actualizar estado local quitando el producto eliminado
      setItems((prevItems) => {
        return prevItems.filter(
          (item) => !(item.productId._id === productId && item.size === size)
        );
      });
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
    }
  };

  //==========================================================================
  //      FUNCION PARA ACTUALIZAR LA CANTIDAD DE PRODUCTOS EN EL CARRITO
  //==========================================================================
  
  const handleUpdateQuantity = async (productId, newQuantity, size = null) => {
    if (newQuantity <= 0) {
      toast("La cantidad debe ser mayor a 0.");
      return;
    }

    console.log("Actualizando producto: ", productId, "Nueva cantidad: ", newQuantity, "Talla: ", size);
    console.log("Frontend - productId enviado:", productId);
    console.log("Frontend - newQuantity enviado:", newQuantity);

    try {
      // Petición PATCH al backend para actualizar cantidad
      const response = await fetch("http://localhost:5000/api/cart/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity, size }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error al actualizar la cantidad: ", data.message);
        toast(data.message || "Error al actualizar la cantidad");
        return;
      }

      // Actualizar estado local reflejando la nueva cantidad
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === productId && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad", error);
    }
  };

  // Mostrar estado de carga
  if (loading) {
    return <p>Cargando carrito...</p>;
  }

  // Si el usuario no esta autenticado

  if (!isAuthenticated) {
    return (
      <div>
        <NavBar />

        <main className="flex flex-col min-h-screen">
          <div className="pt-36">
            <Breadcrumb />
          </div>

          <div className="text-center mt-10">
            <h2 className="text-3xl font-bold mb-4">Acceso Restringido</h2>
            <p className="text-lg">
              Necesitas iniciar sesión para ver tu carrito.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className=" bg-black text-white my-6 py-2 px-6 uppercase font-semibold tracking-widest opacity-100 hover:opacity-80"
            >
              Iniciar sesión
            </button>
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
            onSwitchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Mostrar mensaje si no hay items en el carrito

  if (items.length === 0) {
    return (
      <div>
        <NavBar />

        <main className="flex flex-col min-h-screen">
          <div className="pt-36">
            <Breadcrumb />
          </div>

          <div className="flex flex-col items-center justify-center min-h-[50vh] px-6">
            <div className="bg-white shadow-md p-8 text-center w-full max-w-md">
              <p className="text-gray-600 text-xl mb-6">
                Tu carrito está vacío.
              </p>
              <Link
                to="/home"
                className=" text-black text-md font-bold px-4 py-2 tracking-wider border-2 border-black hover:bg-gray-300 transition duration-300"
              >
                Ir a Comprar
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NavBar />

      <div className="pt-36">
        <Breadcrumb />
      </div>

      <main className="flex flex-col min-h-screen">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Sección de productos en el carrito */}
          <div className="flex-1 bg-white p-4 shadow-md">
            <div className="text-left">
              <h2 className="font-oswald font-bold italic tracking-wider uppercase text-black text-5xl text-left mb-4">
                Tu carrito
              </h2>
              <h3 className="font-semibold">
                <strong>TOTAL</strong> [ {items.length}{" "}
                {items.length === 1 ? "producto" : "productos"} ] $
                {total.toLocaleString("es-AR")}
              </h3>
              <p className="text-gray-700">
                Los artículos en tu carrito no están reservados. Terminá el
                proceso de compra ahora para hacerte con ellos.
              </p>
            </div>

            {items.map((item) => {
              // Verificamos si productId y variants están definidos antes de acceder a ellos
              const variants = item.productId?.variants || []; // Si no existe, usamos un array vacío
              const selectedVariant = variants.find(
                (variant) => variant.size === item.size
              );

              return (
                <div
                  key={item.productId._id + item.size}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center text-left gap-4">
                    <img
                      src={
                        item.productId.imageUrl ||
                        "https://cdn.pixabay.com/photo/2016/03/25/09/04/t-shirt-1278404_1280.jpg"
                      }
                      alt={item.productId.name || "Producto sin imagen"}
                      className="w-28 h-28 rounded-md"
                    />
                    <div>
                      <p className="font-semibold text-xl">
                        {item.productId.description}
                      </p>
                    
                      <p className="text-sm text-gray-500">
                        {variants.length > 0 ? (
                          <>Talle: {item.size}</>
                        ) : null}
                      </p>
                      {variants.length > 0 ? (
                        selectedVariant ? (
                          <p className="text-sm text-gray-500">
                            Stock disponible: {selectedVariant.stock}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No hay stock disponible para este talle
                          </p>
                        )
                      ) : (
                        <p className="text-sm text-gray-500">
                          Stock disponible: {item.productId.stock}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        {item.productId.offerPrice ? (
                          <>
                            <p className="text-sm text-gray-500 line-through">
                              ${item.productId.price.toLocaleString("es-AR")}
                            </p>
                            <p className="text-sm text-green-500">
                              $
                              {item.productId.offerPrice.toLocaleString(
                                "es-AR"
                              )}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">
                            $
                            {item.productId.price.toLocaleString("es-AR")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="bg-gray-200 px-2 py-1 rounded"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId._id,
                              item.quantity - 1,
                              item.size
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="bg-gray-200 px-2 py-1 rounded"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId._id,
                              item.quantity + 1,
                              item.size
                            )
                          }
                          disabled={
                            selectedVariant &&
                            item.quantity >= selectedVariant.stock
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() =>
                      handleRemoveItem(item.productId._id, item.size)
                    }
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}
          </div>

          {/* Sección del resumen del pedido */}
          <div className="w-full md:w-1/3 bg-white p-4 shadow-md">
            <h2 className="text-3xl font-oswald tracking-wider italic text-left uppercase font-bold mb-4">
              Resumen del Pedido
            </h2>

            {/* Título y lista de productos */}
            <div className="border-b pb-4 mb-4 text-left">
              <h3 className="text-xl font-semibold mb-2">Productos:</h3>
              <ul className="list-disc pl-5">
                {items.map((item) => (
                  <li
                    key={item.productId._id + item.size}
                    className="text-gray-700"
                  >
                    {item.productId.description} (x{item.quantity}) 
                    {item.productId.variants &&
                      item.productId.variants.length > 0 && (
                        <> - Talle: {item.size}</>
                      )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Subtotal y costo de envío */}
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${subtotal.toLocaleString("es-AR")}</p>
              </div>
              <div className="flex justify-between">
                <p>Costo de Envío</p>
                <p>${shippingCost.toLocaleString("es-AR")}</p>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>${total.toLocaleString("es-AR")}</p>
            </div>

            <div className="mt-5">
              <Btn text="Ir a pagar" onClick={() => navigate("/delivery")} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
