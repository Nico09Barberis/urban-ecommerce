import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Footer from "../../../components/user/layout/Footer";

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([]); // Estado para guardar las órdenes del usuario
  const [error, setError] = useState(null); // Estado para manejar errores
  const [expandedOrder, setExpandedOrder] = useState(null); // Estado para manejar qué orden está expandida (ver detalles)
  const token = localStorage.getItem("token"); // Obtener token JWT del localStorage

  useEffect(() => {
    // Función que obtiene las órdenes del usuario al cargar el componente
    const fetchOrders = async () => {
      try {
        // Decodifica el JWT para extraer el userId
        const userId = JSON.parse(atob(token.split(".")[1])).userId;

        // Llama al endpoint del backend para obtener las órdenes del usuario
        const response = await fetch(
          `http://localhost:5000/api/orders/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el historial de compras");
        }

        // Almacena las órdenes en el estado
        const data = await response.json();
        console.log("Datos de órdenes:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error al obtener el historial de compras:", error);
        setError("No se pudo cargar el historial de compras");
      }
    };

    // Ejecuta la función al montar el componente
    fetchOrders();
  }, [token]);

  console.log("orders:", orders); // Log para depuración

  // Alterna la expansión de los detalles de una orden específica
  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow">
        <div className="pt-36">
          <Breadcrumb />
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold gap-6 p-6 uppercase text-left">
            Historial de Compras
          </h2>
          <hr className="w-full border-t border-gray-300 mb-4" />
          <div className="flex flex-col md:flex-row gap-6 p-6">
            <div className="flex-1 bg-white p-4 text-left shadow-md">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-6">
                  <div className="justify-center mb-4">
                    <p className="text-gray-600 text-lg mb-6">
                      No has hecho compras aún.
                    </p>
                    <Link
                      to="/home"
                      className="bg-black text-white py-3 px-6 uppercase font-semibold tracking-widest opacity-100 hover:opacity-80"
                    >
                      Ir a Comprar
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li key={order._id} className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            Fecha:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            Total:{" "}
                            <span className="font-semibold">
                              ${order.total.toLocaleString("es-AR")}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => toggleExpand(order._id)}
                          className="text-black text-sm font-bold tracking-wider border-2 px-2 py-1 border-black hover:bg-gray-300 transition duration-300"
                        >
                          {expandedOrder === order._id ? "Ocultar" : "Ver más"}
                        </button>
                      </div>

                      {/* Contenedor desplegable */}
                      {expandedOrder === order._id && (
                        <div className="mt-4 p-4 rounded-lg">
                          <p className="text-gray-600">
                            Método de pago: {order.PaymentMethod}
                          </p>
                          <h3 className="font-semibold mt-2">Productos:</h3>
                          <ul className="mt-2">
                            {order.items.map((item) => (
                              <li
                                key={item._id}
                                className="flex items-center space-x-4"
                              >
                                <img
                                  src={
                                    item.productId.imageUrl ||
                                    "/placeholder.jpg"
                                  }
                                  alt={item.productId.name}
                                  className="w-20 h-20 rounded-md"
                                />
                                <div>
                                  <p className="text-gray-800 font-semibold">
                                    {item.productId.description}
                                  </p>

                                  {/* Solo mostrar el tamaño si el producto tiene variantes */}
                                  {item.productId.variants &&
                                    item.productId.variants.length > 0 &&
                                    item.selectedSize && (
                                      <p className="text-gray-600">
                                        Talle: {item.selectedSize}
                                      </p>
                                    )}

                                  <p className="text-gray-600">
                                    {item.quantity} x $
                                    {item.price.toLocaleString("es-AR")}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseHistory;
