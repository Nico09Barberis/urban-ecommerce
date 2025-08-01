import { useState, useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No se encontró el token");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error en la respuesta, ${response.status}`);
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error obteniendo notificaciones", error);
      }
    };

    fetchNotifications();
    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchNotifications, 60000);
    }

    return () => clearInterval(intervalRef.current);
  }, []);

  //Función corregida para abrir Gmail con productos dinámicos
  function sendEmail(products) {
    const destinatario = "reposicionmiempresa@gmail.com";
    const asunto = "Stock Crítico - Reposición Necesaria";

    const cuerpo = `Hola equipo de inventario,

      Hemos detectado que los siguientes productos están en niveles críticos de stock y necesitan reposición:\n\n${products
        .map((p) => {
          if (p.variants && p.variants.length > 0) {
            const lowVariants = p.variants.filter((v) => v.stock <= 5);
            return `🔹 Producto: ${p.name}
          🏷 Categoría: ${p.category}
          📄 Descripción: ${p.description}
          📦 Talles con bajo stock:\n${lowVariants
            .map((v) => `   - Talle: ${v.size} | Stock: ${v.stock}`)
            .join("\n")}`;
          } else {
            return `🔹 Producto: ${p.name}
          📦 Stock disponible: ${p.stock}
          🏷 Categoría: ${p.category}
          📄 Descripción: ${p.description}`;
          }
        })
        .join("\n\n")}

      Por favor, revisen los productos en el sistema de inventario y realicen los ajustes necesarios para evitar inconvenientes.

      Gracias.
    `;

    const emails = JSON.parse(localStorage.getItem("emails")) || [];
    emails.push({
      destinatario,
      asunto,
      cuerpo,
      fecha: new Date().toLocaleString(),
    });
    localStorage.setItem("emails", JSON.stringify(emails));

    const gmailLink = `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${encodeURIComponent(
      destinatario
    )}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

    window.open(gmailLink, "_blank");
  }

  return (
    <div className="container mx-auto my-6 bg-white rounded-lg p-6 shadow-md">
      <div className="text-left p-4">
        <h2 className="text-2xl font-bold mb-4 uppercase text-[#25396f]">
          Productos con stock crítico
        </h2>
        <div className="flex items-start gap-2 mt-3 p-3 border border-yellow-300 bg-yellow-50 text-gray-800">
          <FiAlertTriangle className="text-yellow-600" size={20} />
          <p className="text-md leading-tight">
            ¡Atención! Algunos productos están por agotarse. Asegúrate de tomar
            acción antes de que se queden sin stock.
          </p>
        </div>
      </div>

      {/* Botón para enviar alerta por correo */}
      <div className="text-left">
        <button
          onClick={() => sendEmail(notifications)}
          className="bg-blue-500 text-blue-100 px-4 py-2 hover:bg-blue-700 mx-6 mb-4"
        >
          Enviar alerta por correo
        </button>
      </div>

      {/* Lista de productos con stock crítico */}

      {notifications.map((product) => {
        const criticalVariants =
          product.variants?.filter((v) => v.stock <= 5) || [];

        const allZeroStock = criticalVariants.every((v) => v.stock === 0);
        const hasLowButNotZero = criticalVariants.some(
          (v) => v.stock > 0 && v.stock <= 5
        );

        const containerClasses = allZeroStock
          ? "bg-red-200 border border-red-600 text-red-800"
          : hasLowButNotZero
          ? "bg-yellow-100 border border-yellow-400 text-yellow-800"
          : "bg-red-100 border border-red-400 text-red-700"; // fallback (sin variantes)

        return (
          <div
            key={product._id}
            className={`flex items-center ${containerClasses} text-left mb-2 p-3 mx-6`}
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-28 h-28 bg-white object-cover rounded-md mr-4 hidden md:block"
              />
            )}
            <div>
              <p>ID: {product._id}</p>
              <p>
                Categoría: {product.category} | Subcategoría:{" "}
                {product.subcategory}
              </p>
              <p>Descripción: {product.description}</p>

              {product.variants && product.variants.length > 0 ? (
                <div>
                  <p className="font-bold">Variantes con stock crítico:</p>
                  <ul className="list-disc ml-5">
                    {criticalVariants.map((v, index) => (
                      <li key={index}>
                        Talle: {v.size} | Stock: {v.stock}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="font-bold">Stock: {product.stock}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Notifications;
