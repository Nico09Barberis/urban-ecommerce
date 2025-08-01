import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { IoSearch } from "react-icons/io5";

const RegisteredUsers = () => {
  // Estado para almacenar los usuarios obtenidos del backend
  const [users, setUsers] = useState([]);

  // Estados para manejar la carga y posibles errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtro de búsqueda por nombre o apellido
  const [userFilter, setUserFIlter] = useState("");

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  // useEffect para obtener los usuarios cuando el componente se monta
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No se encontró el token.");

        const response = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener los usuarios.");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(); // LLamar a la funcion al montar el componente
  }, []);

  // Filtra los usuarios por nombre o apellido
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(userFilter.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(userFilter.toLowerCase())
  );

  // Paginacion, calcula el total de paginas necesarias
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Cambia de pagina
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  //================================================================================
  //            FUNCION PARA ELIMINAR UN USUARIO CON CONFIRMACION
  //================================================================================
const handleDelete = (userId) => {
  toast((t) => (
    <div className="p-2 bg-[#FFF9C4] text-md rounded text-black w-[300px]">
      <p className="text-sm">¿Estás seguro de que deseas eliminar al usuario?</p>
      <div className="mt-3 flex justify-center text-center gap-2">
        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");
              if (!token) throw new Error("No se encontró el token.");

              const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!res.ok) throw new Error("Error al eliminar el usuario.");

              setUsers((prev) => prev.filter((user) => user._id !== userId));

              toast.dismiss(t.id);
              toast.success("Usuario eliminado correctamente.");
            } catch (err) {
              toast.dismiss(t.id);
              toast.error("Error al eliminar el usuario.");
              console.error(err);
            }
          }}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Sí
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-300"
        >
          No
        </button>
      </div>
    </div>
  ), { duration: Infinity });
};


  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mx-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold uppercase my-4 text-[#25396f] text-left">
          Usuarios Registrados
        </h2>

        {/* Campo de búsqueda */}
        <div className="relative w-[300px] mb-4">
          <input
            required
            placeholder="Buscar por nombre o apellido"
            type="text"
            value={userFilter}
            onChange={(e) => setUserFIlter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-base border-b-2 border-gray-300 bg-transparent outline-none focus:border-indigo-500 transition-all"
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-colors duration-300">
            <IoSearch />
          </div>
        </div>

        <table className="min-w-full table-auto text-center">
          <thead>
            <tr className="bg-gray-100 text-[#25396f] uppercase text-sm leading-normal">
              <th className="py-3 px-6 hidden md:table-cell">ID</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Nombre</th>
              <th className="py-3 px-6">Apellido</th>
              <th className="py-3 px-6">Telefono</th>
              <th className="py-3 px-6">Fecha de Registro</th>
              <th className="py-3 px-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-[#25396f] text-sm">
            {currentUsers.map((user) => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 hidden md:table-cell">{user._id}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{user.firstName}</td>
                <td className="py-3 px-6">{user.lastName}</td>
                <td className="py-3 px-6">{user.phone ? user.phone : "No disponible"}</td>
                <td className="py-3 px-6">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Fecha no disponible"}
                </td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-400 px-3 py-1 rounded-md hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-[#253963] mt-4">
            No se encontraron usuarios con ese nombre o apellido
          </p>
        )}

        {/* Paginación */}
        <nav className="mt-4 p-4 bg-white rounded-b-lg text-sm text-gray-800">
          <ul className="inline-flex -space-x-px">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 h-8 border border-gray-300 rounded-s-lg hover:bg-gray-100 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Anterior
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i}>
                <button
                  onClick={() => paginate(i + 1)}
                  className={`px-3 h-8 border border-gray-300 ${
                    currentPage === i + 1
                      ? "text-blue-600 bg-blue-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 h-8 border border-gray-300 rounded-e-lg hover:bg-gray-100 ${
                  currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default RegisteredUsers;
