import { useEffect, useState } from "react";
import React, { Fragment } from 'react';
import { FiAlertTriangle } from "react-icons/fi";


const SalesList = () => {
  // Estados del componente
  const [sales, setSales] = useState([]); // Lista completa de ventas
  const [filteredSales, setFilteredSales] = useState([]); // Ventas después de aplicar filtros y orden
  const [expandedSaleId, setExpandedSaleId] = useState(null); // ID de la venta expandida (detalle visible)
  const [dateFilter, setDateFilter] = useState("all"); // Filtro de fecha activo
  const [sortOrder, setSortOrder] = useState("desc"); // Orden de las ventas: más reciente primero
  const [isMobileView, setIsMobileView] = useState(false); // Detecta si es vista móvil
  const [currentPage, setCurrentPage] = useState(1); // Página actual de la paginación
  const salesPerPage = 20; // Cantidad de ventas por página

  useEffect(() => {
    // Funcion para obtener las ventas del backend
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) throw new Error("No se encontró el token");

        const response = await fetch("http://localhost:5000/api/admin/sales", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok)
          throw new Error(`Error en la respuesta, ${response.status}`);

        const data = await response.json();   //Parseo de la respuesta a formato JSON
        setSales(data); // Guardado en el estado principal
        setFilteredSales(data);
      } catch (error) {
        console.error("Error al cargar las ventas", error);
      }
    };

    fetchSales(); // Se ejecuta al montar el componente
  }, []);

  // =======================================================================
  //                          FUNCION DE FILTRADO
  // =======================================================================
  
  const filterSales = () => {
    let filtered = [...sales]; // Copia de las ventas originales
    const today = new Date(); // Fecha actual
    today.setHours(0, 0, 0, 0); // Eliminar hora para comparar solo la fecha

    if (dateFilter === "today") {
      // Filtrar por ventas de hoy
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === today.getTime();
      });
    } else if (dateFilter === "week") {
      // Filtrar por los últimos 7 días
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      filtered = filtered.filter((sale) => new Date(sale.createdAt) >= weekAgo);
    } else if (dateFilter === "month") {
      // Filtrar por el último mes
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      filtered = filtered.filter(
        (sale) => new Date(sale.createdAt) >= monthAgo
      );
    }

    return filtered; // Retornar la lista filtrada
  };

  // ========================================================================
  //                        FUNCION DE ORDENAMIENTO
  // ========================================================================
  
  const sortSales = (salesList) => {
    return salesList.sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt) // Orden descendente
        : new Date(a.createdAt) - new Date(b.createdAt) // Orden ascendente
    );
  };

  // =======================================================================
  //                       APLICAR FILTROS Y ORDEN
  // =======================================================================
  
  useEffect(() => {
    const filtered = filterSales();
    const sorted = sortSales(filtered);
    setFilteredSales(sorted);
  }, [sales, dateFilter, sortOrder]);

  //========================================================================
  //              FUNCION PARA EL DESPLEGABLE DE CADA VENTA
  //========================================================================

  const toggleExpand = (saleId) => {
    setExpandedSaleId(expandedSaleId === saleId ? null : saleId);
  };

  //========================================================================
  //           FUNCION PARA CALCULAR EL IMPORTE TOTAL POR VENTA
  //========================================================================

  const calculateTotal = (sale) => {
    const totalPrice = sale.items.reduce(
      (acc, item) => acc + (item.quantity * item.price || 0),
      0
    );
    const shippingCost = totalPrice > 100000 ? 0 : 5000;
    return totalPrice + shippingCost;
  };

  
  // =====================================================================
  //                  FUNCION PARA MANEJAR LA PAGINACION
  // =====================================================================
  
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // =====================================================================
  //                   DETECTAR EL TAMAÑO DE PANTALLA
  // =====================================================================
 
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    handleResize(); // ejecutar al montar
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =====================================================================
  //                        CALCULOS DE PAGINACION
  // =====================================================================

  const totalPages = Math.ceil(filteredSales.length / salesPerPage);
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  // =====================================================================
  //                              RENDERIZADO
  // =====================================================================

  return (
  <div className="container mx-auto my-6 px-4 sm:px-8 bg-white  rounded-md">
    <div className="py-8">
      <div className="text-left leading-tight">
        <h2 className="text-3xl uppercase font-bold text-[#25396f]">
          Ventas
        </h2>
        <div className="flex items-start gap-2 mt-3 p-3 border border-yellow-300 bg-yellow-50 text-gray-800">
          <FiAlertTriangle className="text-yellow-600" size={20} />
          <p className="text-sm leading-tight">
            Las compras menores a <strong>$100.000</strong> incluyen un cargo adicional de <strong>$5.000</strong> por envío.
          </p>
  	    </div>
      </div>

      {/* Selector de filtro por fecha */}
      <div className="flex items-center my-4 justify-start space-x-4">
        <label className="text-[#25396f] font-semibold mr-2">
          Filtrar por fecha:
        </label>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border px-2 py-1 rounded-md"
        >
          <option value="all">Todas</option>
          <option value="today">Hoy</option>
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
        </select>
      </div>

      {isMobileView ? (
        <div className="space-y-4">
          {currentSales.length > 0 ? (
            currentSales.map((sale) => (
              <div
                key={sale._id}
                className="bg-white shadow-md rounded-md text-left p-4 border"
              >
                <div className="mb-2 text-sm text-[#25396f]">
                  <strong>ID Venta:</strong> {sale._id}
                </div>
                <div className="mb-2 text-sm text-[#25396f]">
                  <strong>Usuario:</strong> {sale.userId || "Sin datos"}
                </div>
                <div className="mb-2 text-sm text-[#25396f]">
                  <strong>Artículos:</strong>{" "}
                  {sale.items.reduce((acc, item) => acc + (item.quantity || 0), 0)}
                </div>
                <div className="mb-2 text-sm text-[#25396f]">
                  <strong>Total:</strong> ${calculateTotal(sale)}
                </div>
                <div className="mb-2 text-sm text-[#25396f]">
                  <strong>Fecha:</strong>{" "}
                  {new Date(sale.createdAt).toLocaleDateString()}
                </div>
                <div className="mb-2 text-sm text-[#25396f]">
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded font-semibold ${
                      sale.status === "Pendiente"
                        ? "bg-orange-200 text-orange-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {sale.status}
                  </span>
                </div>

                <button
                  onClick={() => toggleExpand(sale._id)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {expandedSaleId === sale._id ? "Ocultar detalle" : "Ver detalle"}
                </button>

                {expandedSaleId === sale._id && (
                  <div className="mt-4 border-t pt-2">
                    <h3 className="font-semibold text-[#25396f] text-md mb-2">
                      Detalle de la venta
                    </h3>
                    {sale.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start bg-gray-50 rounded p-2 mb-2"
                      >
                        <img
                          src={item.productId.imageUrl || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded mr-2"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#25396f] hidden sm:table-cell">
                            {item._id}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {item.productId.description || "Sin descripción"}
                          </p>
                          {item.selectedSize && (
                            <p className="text-gray-600 text-xs">
                              Talle: {item.selectedSize}
                            </p>
                          )}
                          <p className="text-[#25396f] text-xs">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-[#25396f] text-xs">
                            Precio: ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="text-sm mt-2 text-[#25396f]">
                      <span className="font-semibold">Método de pago: </span>
                      {sale.PaymentMethod || "No especificado"}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-600">
              No hay ventas disponibles
            </p>
          )}
        </div>
      ) : (
        // Vista de escritorio
        <div className="my-4 w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle rounded-lg">
            <div className="overflow-hidden shadow-md ring-1 ring-black ring-opacity-5 md:rounded-md">
              <table className="min-w-full divide-y divide-gray-200 leading-normal">
                <thead>
                  <tr className="text-center">
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                      Id de Venta
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                      Id del Usuario
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                      Cant. Artículos
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                      Importe Total
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                      Fecha de Venta
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                      Detalle
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-[#25396f] uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSales.length > 0 ? (
                    currentSales.map((sale) => (
                      <React.Fragment key={sale._id}> 
                        <tr key={sale._id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-[#25396f]">
                            {sale._id}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-[#25396f]">
                            {sale.userId || "Sin datos"}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-[#25396f]">
                            {sale.items.reduce(
                              (acc, item) => acc + (item.quantity || 0),
                              0
                            )}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-[#25396f]">
                            ${calculateTotal(sale).toLocaleString('es-AR')}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-[#25396f]">
                            {new Date(sale.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              onClick={() => toggleExpand(sale._id)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {expandedSaleId === sale._id ? "Ocultar detalle" : "Ver detalle"}
                            </button>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span
                              className={`inline-block px-3 py-1 font-semibold leading-tight ${
                                sale.status === "Pendiente"
                                  ? "text-orange-900 bg-orange-200"
                                  : "text-green-900 bg-green-200"
                              }`}
                            >
                              {sale.status}
                            </span>
                          </td>
                        </tr>
                        {expandedSaleId === sale._id && (
                          <tr>
                            <td colSpan="7" className="bg-gray-50 border-b border-gray-200 p-4 text-sm">
                              <h3 className="font-semibold text-[#25396f] text-lg mb-4 border-b pb-2">
                                Detalle de la venta
                              </h3>
                              <div className="mb-4 max-w-6xl mx-auto">
                                {sale.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start bg-white rounded-lg shadow-sm border p-3 mb-4"
                                  >
                                    <img
                                      src={item.productId.imageUrl || "https://via.placeholder.com/80"}
                                      alt={item.name}
                                      className="w-20 h-20 object-cover rounded mr-3"
                                    />
                                    <div className="flex-1 text-left">
                                      <p className="font-semibold text-[#25396f] text-md">
                                        {item._id}
                                      </p>
                                      <p className="text-gray-600 text-md">
                                        {item.productId.description || "Sin descripción"}
                                      </p>
                                      {item.selectedSize && (
                                        <p className="text-gray-600">
                                          Talle: {item.selectedSize}
                                        </p>
                                      )}
                                      <p className="text-gray-600">
                                        Cantidad: {item.quantity}
                                      </p>
                                      <p className="text-gray-600">
                                        Precio unitario: ${item.price.toLocaleString('Es-AR')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2 text-sm text-[#25396f]">
                                <span className="font-semibold">Método de pago: </span>
                                {sale.PaymentMethod || "No especificado"}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No hay ventas disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>

      <nav
        aria-label="Page navigation example"
        className="p-4 bg-white rounded-b-lg"
      >
        <ul className="inline-flex -space-x-px text-sm text-gray-800 dark:text-gray-200">
          <li>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Previous
            </button>
          </li>

          {[...Array(totalPages)].map((_, i) => (
            <li key={i}>
              <button
                onClick={() => paginate(i + 1)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${
                  currentPage === i + 1
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 bg-white"
                } border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SalesList;
