// Importación de hooks necesarios desde React y React Router
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Componente del formulario de registro
const RegisterForm = ({ showModal, onClose, onSwitchToLogin }) => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dni: "",
  });

  // Estado para manejar mensajes de error y éxito
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Hook para redireccionar al usuario
  const navigate = useNavigate();

  //==================================================================
  //        MANEJADOR DE CAMBIOS EN LOS CAMPOS DEL FORMULARIO
  //==================================================================

  const handleChange = (e) => {
    // Actualiza el estado del formulario según el input modificado
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  //==================================================================
  //           MANEJADOR DE ENVÍO DEL FORMULARIO DE REGISTRO
  //==================================================================

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setError(""); // Limpia errores anteriores
    setSuccess(""); // Limpia mensajes de éxito anteriores

    console.log("Datos enviados:", JSON.stringify(formData)); // Log para debug

    try {
      // Se crea el objeto con los datos del usuario a registrar
      const newUserData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      /* Se agrega el DNI solo si está presente
      if (formData.dni && formData.dni.trim() !== '') {
        newUserData.dni = formData.dni;
      }*/

      // Validación manual: confirmar que las contraseñas coincidan
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      // Petición al backend para registrar al usuario
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      });

      const data = await response.json(); // Se obtiene la respuesta en formato JSON
      console.log(data); // Log para debug

      // Manejo de errores de la respuesta
      if (!response.ok) {
        setError(
          data.errors
            ? data.errors[0].msg
            : data.msg || `Error ${response.status}: Registro fallido`
        );
      } else {
        // Si todo va bien, se guarda el usuario en localStorage
        const user = {
          token: data.token,
          email: data.user?.email,
          firstName: data.user?.firstName,
          lastName: data.user?.lastName,
          role: data.user?.role,
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Token guardado en localStorage: ", data.token);
        console.log("User guardado en localStorage: ", user);

        setSuccess("Registro exitoso!");

        // Limpia el formulario después del registro
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          dni: "",
        });

        // Redirecciona después de 1 segundo
        setTimeout(() => {
          onClose(); // Cierra el modal
          navigate(user.role === "admin" ? "/admin/dashboard" : "/home");
        }, 1000);
      }
    } catch (error) {
      // Error general de servidor
      setError("Error en el servidor");
    }
  };

  // Validacion para renderizar el formulario
  if (!showModal) return null;

  //==================================================================
  //                      RENDER DEL COMPONENTE
  //==================================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#2a2b38] rounded-lg shadow-md w-full max-w-sm p-6 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-[#f5f5f5] hover:text-[#ffeba7] text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-medium text-[#f5f5f5] mb-6">Registro</h2>

        {error && <div className="text-red-400 mb-2">{error}</div>}
        {success && <div className="text-green-400 mb-2">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["firstName", "lastName", "email", "password"].map((field) => (
            <div
              className="flex items-center gap-2 bg-[#1f2029] rounded px-4 py-2"
              key={field}
            >
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "password"
                    ? "password"
                    : "text"
                }
                id={field}
                className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-[#d3d3d3] placeholder-opacity-70"
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field === "firstName"
                    ? "Nombre"
                    : field === "lastName"
                    ? "Apellido"
                    : field === "email"
                    ? "Correo electrónico"
                    : "Contraseña"
                }
                required
              />
            </div>
          ))}

          {/* Campo Confirmar Contraseña */}
          <div className="flex items-center gap-2 bg-[#1f2029] rounded px-4 py-2">
            <input
              type="password"
              id="confirmPassword"
              className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-[#d3d3d3] placeholder-opacity-70"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[#ffeba7] text-[#5e6681] font-bold text-sm uppercase py-2 rounded shadow-md hover:bg-[#5e6681] hover:text-[#ffeba7] transition-all duration-300"
          >
            Registrarse
          </button>
          <p className="text-sm text-[#f5f5f5] mt-4">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-[#ffeba7] underline hover:text-[#ffd700]"
            >
              Inicia sesión aquí
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
