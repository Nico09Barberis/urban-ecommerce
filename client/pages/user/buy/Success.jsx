// Importaciones necesarias de React, rutas y componentes personalizados
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/user/layout/NavBar";
import Btn from "../../../components/user/layout/Btn";
import Footer from "../../../components/user/layout/Footer";
import ProductCarousel from "../../../components/user/layout/ProductCarousel";

const Success = () => {
  // Hook de navegación para redirigir al usuario
  const navigate = useNavigate();

  // Estado para almacenar la dirección del usuario
  const [userAddress, setUserAddress] = useState(null);
  // Estado para controlar si los datos aún se están cargando
  const [loading, setLoading] = useState(true);

  // useEffect para obtener la dirección del usuario una vez montado el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener el token del usuario almacenado en localStorage
        const token = localStorage.getItem("token");
        console.log("token almacenado", token);

        // Realizar petición al backend para obtener la dirección
        const response = await fetch("http://localhost:5000/api/user/address", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar token para autenticar al usuario
          },
        });

        // Validar que la respuesta sea exitosa
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        // Extraer los datos recibidos y guardarlos en el estado
        const data = await response.json();
        setUserAddress(data.address);
        console.log("Dirección obtenida: ", data.address);
      } catch (error) {
        // Capturar y mostrar errores si la petición falla
        console.error("Error al obtener la dirección del usuario", error);
      } finally {
        // Marcar como finalizada la carga de datos
        setLoading(false);
      }
    };

    // Ejecutar la función para obtener los datos del usuario
    fetchUserData();
  }, []);

  // Construcción de la dirección del envío a partir de los datos obtenidos
  let shippingAddress = "Dirección no disponible";
  if (userAddress) {
    const { street, number, department, floor, city } = userAddress;
    shippingAddress = `${street || ""} ${number || ""}`.trim(); // Construir calle y número
    if (department) shippingAddress += `, Apt ${department}`; // Añadir departamento si existe
    if (floor) shippingAddress += `, Piso ${floor}`; // Añadir piso si existe
    if (city) shippingAddress += `, ${city}`; // Añadir ciudad
  }

  // Calcular las fechas de envío estimadas:
  // Fecha mínima: 7 días desde hoy
  // Fecha máxima: 15 días desde hoy
  const today = new Date();
  const minShippingDate = new Date();
  const maxShippingDate = new Date();
  minShippingDate.setDate(today.getDate() + 7);
  maxShippingDate.setDate(today.getDate() + 15);

  // Formatear las fechas a formato legible (ej: "15 de mayo")
  const minDateFormatted = minShippingDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });
  const maxDateFormatted = maxShippingDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-white">
      <NavBar />
      <div className="w-full mx-auto pt-28">
        {/* Banner verde de fondo */}
        <div className="bg-green-500 text-white font-semibold text-xl text-center py-20">
          <h2 className="text-3xl font-bold">¡Gracias por tu compra!</h2>
          <span>Te avisaremos cuando tu compra esté en camino</span>
        </div>

        {/* Tarjeta blanca superpuesta */}
        <div className="bg-gray-200 p-4 max-w-md mx-auto shadow-xl rounded-lg -mt-6 relative z-10">
          {/* Dirección de envío */}
          <p className="font-semibold text-gray-700">
          Envío a{" "}
            <span className="font-bold">
              {loading ? "Cargando dirección..." : shippingAddress}
            </span>
          </p>

          {/* Detalles de envío */}
          <div className="mt-2 mb-6 text-gray-600">
            <p>
              Llega entre el {minDateFormatted} y el {maxDateFormatted} a tu
              domicilio
            </p>
          </div>

          {/* Botón de acción */}
          <div className="mt-4">
            <Btn onClick={() => navigate("/purchase-history")} text="Ver en mis compras" />
          </div>
          <div className="mt-4">
            <Btn onClick={() => navigate("/home")} text="Volver al inicio" />
          </div>
        </div>
      </div>

      <div className="mx-4">
        <ProductCarousel title="Te puede interesar"/>
      </div>

      <div className="flex-grow" />
      <Footer />
    </div>
  );
};

export default Success;
