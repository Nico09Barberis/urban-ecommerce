import React, { useState, useEffect } from "react";

const RecentUsers = () => {
  const [users, setUsers] = useState([]); // Estado para almacenar la lista de usuarios
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener lista de usuarios recientes al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Extrae el token almacenado en localStorage para autenticación
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No se encontró el token."); // Manejo de error si no hay token disponible
        }

        // Realiza la solicitud para obtener usuarios registrados
        const response = await fetch("http://localhost:5000/api/admin/dashboard/registered-users", {
          headers: {
            "Authorization": `Bearer ${token}`, // Incluye el token en la cabecera de la solicitud
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los usuarios."); // Manejo de error si la respuesta no es exitosa
        }

        const data = await response.json(); // Convierte la respuesta a JSON
        console.log("Usuarios recibidos: ", data);
        setUsers(data); // Almacena los datos en el estado
      } catch (error) {
        setError(error.message); // Guarda el mensaje de error en el estado
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchUsers();
  }, []); // Ejecuta el efecto solo una vez al montar el componente

  if (loading) {
    return <div>Cargando usuarios...</div>; // Muestra mensaje de carga mientras se obtienen los datos
  }

  if (error) {
    return <div>Error: {error}</div>; // Muestra mensaje de error si falla la solicitud
  }
    // Ordenamos por fecha descendente y se extraen los 5 más recientes.
    const lastFiveUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-left text-[#25396f]">
        Últimos Usuarios Registrados
      </h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-[#25396f] uppercase text-sm leading-normal">
            <th className="py-3 px-6">Email</th>
            <th className="py-3 px-6">Nombre</th>
            <th className="py-3 px-6">Apellido</th>
            <th className="py-3 px-6">Telefono</th>
            <th className="py-3 px-6">Fecha de Registro</th>
          </tr>
        </thead>
        <tbody className="text-[#25396f] text-sm">
          {lastFiveUsers.map((user) => (
            <tr
              key={user._id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6">{user.email}</td>
              <td className="py-3 px-6">{user.firstName}</td>
              <td className="py-3 px-6">{user.lastName}</td>
              <td className="py-3 px-6">{ user.phone ? user.phone : "no disponible" }</td>
              <td className="py-3 px-6">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Fecha no disponible"}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentUsers;
