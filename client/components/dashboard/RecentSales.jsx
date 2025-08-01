import React, { useEffect, useState } from "react";

const RecentSales = () => {
  //Estado para almacenar los datos de las ultimas ventas
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Funcion asincronica que obtiene las ultimas ventas del backend
    const fetchLatestOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No se encontró el token.");
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard/latest-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Validar la respuesta del servidor
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }

        // Convertir la respuesta en formato JSON
        const data = await response.json();
        
        // Validar que los datos recibidos sean un arreglo
        if (!Array.isArray(data)) {
          throw new Error("Los datos recibidos no son válidos.");
        }

        // Guardar los datos en el estado
        setSalesData(data);
      } catch (error) {
        // Captura y muestra errores de la petición
        console.error("Error al cargar las últimas ventas", error);
      }
    };
    fetchLatestOrders();
  }, []);

  return (
    <div className="mx-auto sm:px-8">
      <div className="py-8">
        <h2 className="text-2xl font-bold text-start text-[#25396f] leading-tight">
          Ventas recientes
        </h2>
        <div className="my-4">
          <div className="inline-block min-w-full rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="text-center">
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                    Id de Venta
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                    Id del Usuario
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                    Precio Total
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                    Fecha de Venta
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale, index) => (
                  <tr key={index}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-[#25396f] whitespace-no-wrap">
                        {sale._id}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-[#25396f] whitespace-no-wrap">
                        {sale.userId || "Sin datos"}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-[#25396f] whitespace-no-wrap">
                        ${sale.total.toLocaleString('es-AR') || 0}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-[#25396f] whitespace-no-wrap">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                          sale.status === "Pendiente"
                            ? "text-orange-900 bg-orange-200"
                            : "text-green-900 bg-green-200"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
