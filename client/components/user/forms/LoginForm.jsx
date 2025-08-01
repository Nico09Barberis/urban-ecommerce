import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { PiLockKeyFill } from "react-icons/pi";

const LoginForm = ({ showModal, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");       // Estado para el campo de email
  const [password, setPassword] = useState(""); // Estado para el campo de contraseña
  const [error, setError] = useState("");       // Estado para mensajes de error
  const navigate = useNavigate();               // Hook de navegación


  if (!showModal) return null; // Si el modal no debe mostrarse, no renderizar nada

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setError("");       // Limpiar mensajes de error anteriores


      try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST", // Método HTTP para enviar datos
        headers: {
          "Content-Type": "application/json", // Se indica que se enviará JSON
        },
        body: JSON.stringify({ email, password }), // Se envían las credenciales
      });

      const data = await response.json(); // Convertir respuesta a JSON


        if (!response.ok) {
        // Si hubo errores en la respuesta, mostrar mensaje adecuado
        setError(
          data.errors ? data.errors[0].msg : data.msg || "Error en el login"
        );
      } else {
        // Si la respuesta es exitosa, guardar token y usuario en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Token guardado en localStorage: ", data.token);
        console.log("Usuario guardado en localStorage: ", data.user);

        onClose(); // Cerrar el modal tras inicio de sesión exitoso

        // Redirigir según el rol del usuario
        if (data.user.role === "admin") {
          navigate("/admin/dashboard"); // Panel de administrador
        } else {
          navigate("/home"); // Página de usuario regular
        }
      }
    } catch (error) {
      // Manejo de errores del servidor
      setError("Error en el servidor");
    }
  };

  //======================================================================
  //                        RENDER DEL COMPONENTE
  //======================================================================

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-sm p-6 bg-[#2a2b38] rounded-lg shadow-md relative text-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-[#f5f5f5] hover:text-[#ffeba7] text-2xl"
        >
          &times;
        </button>
  
        <h2 className="text-2xl font-medium text-[#f5f5f5] mb-6">Iniciar sesión</h2>
        {error && <div className="text-red-400 mb-3">{error}</div>}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 bg-[#1f2029] rounded px-4 py-2">
            <MdAlternateEmail fontSize={26} className="text-[#ffeba7]" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-[#d3d3d3] placeholder-opacity-70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          <div className="flex items-center gap-2 bg-[#1f2029] rounded px-4 py-2">
            <PiLockKeyFill fontSize={26} className="text-[#ffeba7]"/>
            <input
              type="password"
              placeholder="Contraseña"
              className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-[#d3d3d3] placeholder-opacity-70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full mt-4 bg-[#ffeba7] text-[#5e6681] font-bold text-sm uppercase py-2 rounded shadow-md hover:bg-[#5e6681] hover:text-[#ffeba7] transition-all duration-300"
          >
            Login
          </button>
  
          <Link
            to="/recuperar-contraseña"
            className="block text-xs text-[#f5f5f5] hover:text-[#ffeba7] transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>

        </form>
  
        <p className="text-xs text-[#f5f5f5] mt-6">
          ¿No tienes una cuenta?
          <button
            type="button"
            className="ml-1 text-[#ffeba7] hover:underline"
            onClick={onSwitchToRegister}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
  
};

export default LoginForm;
