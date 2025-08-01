import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // Componente del grafico de barras desde Recharts

const SalesAnalysis = () => {
  const [salesData, setSalesData] = useState([]); // Estado para guardar los datos de ventas formateados
  const [loading, setLoading] = useState(true); // Estado para mostrar carga mientras se obtienen datos
  const token = localStorage.getItem("token"); // Obtener el token JWT desde localStorage

  const [monthA, setMonthA] = useState(""); // Primer mes seleccionado para comparación
  const [monthB, setMonthB] = useState(""); // Segundo mes seleccionado para comparación

  // Buscar los objetos correspondientes a los meses seleccionados
  const selectedA = salesData.find((m) => m.name === monthA);
  const selectedB = salesData.find((m) => m.name === monthB);

  // Calcular el porcentaje de diferencia entre dos meses seleccionados
  const comparisonPercentage =
    selectedA && selectedB && selectedB.totalSales !== 0
      ? (
          ((selectedA.totalSales - selectedB.totalSales) /
            selectedB.totalSales) *
          100
        ).toFixed(2) // Redondear a dos decimales
      : null; // Si falta algún valor, devuelve null

  // Lista de nombres de meses en español, para mostrar en el gráfico
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];


  // Hook de efecto para obtener datos de ventas mensuales al montar el componente
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        if (!token) {
          throw new Error("No se encontró el token."); // Validación del token
        }

        const response = await fetch("/api/admin/sales/monthly-sales", {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar token como header Authorization
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las ventas"); // Verificación de error de red
        }

        const data = await response.json(); // Parsear la respuesta

        // Formatear los datos agregando un campo 'name' legible con mes y año
        const formattedData = data.map((d) => ({
          ...d,
          name: `${monthNames[d.month - 1]} ${d.year}`,
        }));

        setSalesData(formattedData); // Guardar los datos formateados en estado
        console.log("Datos de ventas:", formattedData); // Log para depuración
      } catch (error) {
        console.error("Error al obtener las ventas:", error); // Manejo de errores
      } finally {
        setLoading(false); // Finaliza la carga en cualquier caso
      }
    };

    fetchSalesData(); // Ejecutar la función al montar el componente
  }, []); // Solo una vez, al montar


  if (loading) return <p className="p-4">Cargando datos de ventas...</p>;

  return (
    <div className="p-6 bg-white mx-auto rounded-lg">
      <h2 className="text-3xl font-bold uppercase mb-4 text-[#25396f]">
        Análisis de Ventas Mensuales
      </h2>

      {/* Comparación personalizada */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-left text-[#25396f] mb-2">
          Comparar dos meses
        </h3>
        <div className="flex gap-4 mb-4">
          <select
            value={monthA}
            onChange={(e) => setMonthA(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Selecciona el primer mes</option>
            {salesData.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={monthB}
            onChange={(e) => setMonthB(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Selecciona el segundo mes</option>
            {salesData.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {selectedA && selectedB && (
          <div className="bg-gray-100 p-4 rounded shadow">
            <p>
              <strong>{selectedA.name}</strong>: $
              {selectedA.totalSales.toFixed(2)}
            </p>
            <p>
              <strong>{selectedB.name}</strong>: $
              {selectedB.totalSales.toFixed(2)}
            </p>
            <p className="mt-2">
              Diferencia:{" "}
              <span
                className={
                  comparisonPercentage > 0
                    ? "text-green-600"
                    : comparisonPercentage < 0
                    ? "text-red-600"
                    : ""
                }
              >
                {comparisonPercentage}% (
                {comparisonPercentage > 0 ? "aumento" : "disminución"})
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Mes</th>
              <th className="p-2">Total Vendido</th>
              <th className="p-2">% Comparado al mes anterior</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((month, index) => {
              const currentTotal = month.totalSales || 0;
              const previousTotal =
                index > 0 ? salesData[index - 1].totalSales || 0 : null;
              const percentageDiff =
                previousTotal !== null && previousTotal !== 0
                  ? (
                      ((currentTotal - previousTotal) / previousTotal) *
                      100
                    ).toFixed(2)
                  : "—";

              return (
                <tr key={month.name} className="border-b">
                  <td className="p-2">{month.name}</td>
                  <td className="p-2">${currentTotal.toFixed(2)}</td>
                  <td
                    className={`p-2 ${
                      percentageDiff > 0
                        ? "text-green-600"
                        : percentageDiff < 0
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {percentageDiff !== "—" ? `${percentageDiff}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Gráfico */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Bar dataKey="totalSales" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesAnalysis;
