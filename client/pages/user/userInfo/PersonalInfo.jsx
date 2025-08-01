import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Footer from "../../../components/user/layout/Footer";

const PersonalInfoForm = () => {
  // Estado para almacenar los datos del formulario del usuario
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dni: "",
    phone: "",
    province: "",
  });

  // Estado para mostrar mensajes de error o éxito
  const [message, setMessage] = useState("");

  // Hook para redirigir programáticamente
  const navigate = useNavigate();

  // Cargar los datos del usuario desde localStorage cuando se monta el componente
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")); // Obtener los datos del usuario guardados en localStorage
    console.log("Datos del usuario cargados:", userData);

    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        dni: userData.dni || "",
        phone: userData.phone || "",
        province: userData.province || "",
      });
    }
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Actualiza el campo correspondiente del estado
  };

  // Enviar los datos al backend para actualizar la información del usuario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    try {
      const token = localStorage.getItem("token"); // Obtener el token del usuario

      // Filtrar los campos vacíos para no enviarlos al backend
      const cleanFormData = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value.trim() !== "")
      );

      // Petición PUT al backend para actualizar la información
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar token como autenticación
        },
        body: JSON.stringify(cleanFormData),
      });

      const data = await response.json();

      // Si hubo error, mostrar mensaje
      if (!response.ok) {
        setMessage(data.message || "Error al actualizar los datos.");
      } else {
        setMessage("¡Datos actualizados con éxito!");

        // Actualizar los datos del usuario en localStorage
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          ...formData,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Redirigir al perfil del usuario después de actualizar
        navigate("/profile");
      }
    } catch (error) {
      // Captura de errores de red o del servidor
      console.error("Error al conectar con el servidor.", error);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div className="pt-36">
        <Breadcrumb />      
      </div>
  
      <div className="flex items-center justify-center flex-grow p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 w-full max-w-2xl border shadow-md rounded-lg border-gray-300"
        >
          <h2 className="text-2xl font-bold text-[#25396f] mb-6 text-center">
            Editar Información Personal
          </h2>

          {message && (
            <p className="text-sm text-red-500 mb-4 text-center">{message}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {Object.keys(formData).map((field) => {
              let labelText = "";

              switch (field) {
                case "firstName":
                  labelText = "Nombre:";
                  break;
                case "lastName":
                  labelText = "Apellido:";
                  break;
                case "email":
                  labelText = "Correo:";
                  break;
                case "dni":
                  labelText = "DNI:";
                  break;
                case "phone":
                  labelText = "Teléfono:";
                  break;
                case "province":
                  labelText = "Provincia:";
                  break;
                default:
                  labelText = field;
              }

              return (
                <div key={field} className="flex items-center">
                  <label className="w-32 text-right text-[#25396f] font-medium mr-4 capitalize">
                    {labelText}
                  </label>
                  <div className="relative flex-grow">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i className="fas fa-user" />
                    </span>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Ejemplo: ${
                        field === "firstName"
                          ? "Juan"
                          : field === "lastName"
                          ? "Pérez"
                          : field === "email"
                          ? "juan@email.com"
                          : field === "dni"
                          ? "30123456"
                          : field === "phone"
                          ? "2611234567"
                          : field === "province"
                          ? "Mendoza"
                          : ""
                      }`}
                      className="w-full pl-8 border-0 border-b border-gray-300 focus:border-[#25396f] focus:outline-none py-1 text-gray-700 placeholder:text-sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <button
            type="submit"
            className="mt-8 text-black text-md font-bold tracking-wider border-2 px-4 py-2 border-black hover:bg-gray-300 transition duration-300"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PersonalInfoForm;
