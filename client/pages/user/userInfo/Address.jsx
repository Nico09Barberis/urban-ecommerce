import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Footer from "../../../components/user/layout/Footer";

// Componente para gestionar la dirección del usuario
const Address = () => {
  // Estado local para guardar los datos de dirección
  const [address, setAddress] = useState({
    street: "",
    number: "",
    department: "",
    floor: "",
    city: "",
    postalCode: "",
  });

  const [message, setMessage] = useState(""); // Mensaje de validación o éxito/error
  const navigate = useNavigate(); // Hook para redireccionar

  // Al montar el componente, carga los datos de dirección del localStorage si existen
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.address) {
      setAddress({
        street: userData.address.street || "",
        number: userData.address.number || "",
        department: userData.address.department || "",
        floor: userData.address.floor || "",
        city: userData.address.city || "",
        postalCode: userData.address.postalCode || "",
      });
    } else {
      // Si no hay dirección guardada, inicializa con valores vacíos
      setAddress({
        street: "",
        number: "",
        department: "",
        floor: "",
        city: "",
        postalCode: "",
      });
    }
  }, []);

  // Maneja los cambios en los inputs y realiza validaciones en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validaciones en vivo para algunos campos
    if (name === "street" && /[0-9@#$%^&*]/.test(value)) {
      setMessage("La calle no debe contener números ni caracteres especiales.");
    } else if (name === "city" && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.'-]*$/.test(value)) {
      setMessage("La ciudad solo puede contener letras, números, espacios y signos válidos como '.' o '-'.");
    } else if (name === "floor" && value && !/^\d*$/.test(value)) {
      setMessage("El piso debe ser un número válido.");
    } else {
      setMessage(""); // Limpia mensaje si todo está bien
    }

    // Actualiza el estado de la dirección
    setAddress({ ...address, [name]: value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones generales antes de enviar al servidor
    if (!address.street || address.street.length < 3) {
      setMessage("La calle debe tener al menos 3 caracteres.");
      return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s.'-]+$/.test(address.street)) {
      setMessage("La calle solo puede contener letras, espacios y signos válidos como '.' o '-'.");
      return;
    }

    if (!/^[0-9]+$/.test(address.number)) {
      setMessage("El número debe ser un valor numérico válido.");
      return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s.'-]+$/.test(address.city)) {
      setMessage("La ciudad solo puede contener letras, espacios y signos válidos como '.' o '-'.");
      return;
    }

    if (address.department && address.department.length > 10) {
      setMessage("El departamento no puede exceder 10 caracteres.");
      return;
    }

    if (address.floor && !/^[0-9]+$/.test(address.floor)) {
      setMessage("El piso debe ser un número válido.");
      return;
    }

    if (address.floor && address.floor.length > 5) {
      setMessage("El piso no puede exceder 5 caracteres.");
      return;
    }

    if (!/^[0-9]{4,6}$/.test(address.postalCode)) {
      setMessage("El código postal debe ser un número entre 4 y 6 dígitos.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Envía los datos de dirección al backend
      const response = await fetch("http://localhost:5000/api/user/update-address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error al actualizar la dirección.");
      } else {
        setMessage("¡Dirección actualizada con éxito!");

        // Actualiza el localStorage con la nueva dirección
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          address: data.address,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Redirige al perfil del usuario
        navigate("/profile");
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor.");
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
            Editar Dirección
          </h2>

          {message && (
            <p className="text-sm text-red-500 mb-4 text-center">{message}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {Object.keys(address).map((field) => {
              let labelText = "";

              switch (field) {
                case "street":
                  labelText = "Calle:";
                  break;
                case "number":
                  labelText = "Número:";
                  break;
                case "city":
                  labelText = "Ciudad:";
                  break;
                case "floor":
                  labelText = "Piso:";
                  break;
                case "department":
                  labelText = "Departamento:";
                  break;
                case "postalCode":
                  labelText = "Código Postal:";
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
                    <input
                      type="text"
                      name={field}
                      value={address[field]}
                      onChange={handleChange}
                      placeholder={
                        field === "street"
                          ? "Ej: Av. Independencia"
                          : field === "number"
                          ? "Ej: 1234"
                          : field === "postalCode"
                          ? "Ej: 5500"
                          : field === "city"
                          ? "Ej: Mendoza"
                          : field === "province"
                          ? "Ej: Mendoza"
                          : field === "country"
                          ? "Ej: Argentina"
                          : ""
                      }
                      className="w-full pl-2 border-0 border-b border-gray-300 focus:border-[#25396f] focus:outline-none py-1 text-gray-700 placeholder:text-sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className="mt-8 text-black text-md font-bold px-4 py-2 tracking-wider border-2 border-black hover:bg-gray-300 transition duration-300"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Address;
