import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom"; // Componente de enlace para navegación sin recarga
import { ToastContainer, toast } from "react-toastify"; // Librería para notificaciones tipo toast
import 'react-toastify/dist/ReactToastify.css'; // Estilos de react-toastify

import NavBar from "../../../components/user/layout/NavBar"; // Componente de navegación superior
import Breadcrumb from "../../../components/user/layout/Breadcrumb"; // Ruta de navegación (breadcrumbs)
import Footer from "../../../components/user/layout/Footer"; // Componente de pie de página

const UserProfile = () => {
  // Estado para guardar los datos del usuario actual
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // useEffect para cargar los datos del usuario desde localStorage al montar el componente
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")); // Obtener y parsear los datos del usuario
    if (userData) {
      setUser({
        firstName: userData.firstName || "Usuario",
        lastName: userData.lastName || "",
        email: userData.email || "",
      });
    }
  }, []);

  // Secciones del perfil con su título, descripción, link y disponibilidad
  const sections = [
    { 
      title: "Información personal",
      description: "Gestiona tu nombre, dirección, teléfono, etc.",
      link: "/personal-info",
      available: true, // Esta sección está disponible
    },
    {
      title: "Historial de compra",
      description: "Revisa tus ultimas compras.",
      link: "/purchase-history",
      available: true, // Esta sección está disponible
    },
    {
      title: "Direcciones",
      description: "Guarda y edita tus direcciones.",
      link: "/addresses",
      available: true, // Esta sección está disponible
    },
    {
      title: "Seguridad",
      description: "Configura contraseñas y opciones de seguridad.",
      link: "/security",
      available: false, // Esta sección aún no está disponible
    },
    {
      title: "Tarjetas",
      description: "Administra tus métodos de pago guardados.",
      link: "/cards",
      available: false, // Esta sección aún no está disponible
    },
  ];

  // Manejador para secciones que aún no están habilitadas
  const handleComingSoon = (e) => {
    e.preventDefault(); // Evita que se redireccione
    toast.info("Estamos trabajando en esta funcionalidad. ¡Estará disponible pronto!", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div>
      <NavBar />

      <div className="pt-36">
        <Breadcrumb />
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white w-full max-w-xl shadow-md rounded-lg">
          <div className="text-center p-6 bg-[#25396f] text-white rounded-t-lg">
            <h2 className="text-2xl font-bold">Perfil del Usuario</h2>
            <p className="text-sm mt-2">{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-sm">{user.email}</p>
          </div>

          <div className="p-6 space-y-4">
            {sections.map((section, index) => (
              <Link
                key={index}
                to={section.available ? section.link : "#"}
                onClick={section.available ? undefined : handleComingSoon}
                className={`block border-b-2 border-gray-200 transition-all ${
                  section.available
                    ? "hover:border-indigo-400"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                <div
                  className={`py-4 px-2 rounded-lg ${
                    section.available ? "hover:bg-gray-100 transition cursor-pointer" : ""
                  }`}
                >
                  <h3 className="text-[#25396f] text-lg font-semibold">
                    {section.title}{" "}
                    {!section.available && (
                      <span className="text-sm text-gray-500">(Próximamente)</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer />
      <Footer />
    </div>
  );
};

export default UserProfile;
