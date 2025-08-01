import React from "react";
import { Link, useLocation } from "react-router-dom";
import { breadcrumbConfig } from "../../../config/breadcrumbConfig"; // Importa la configuración

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const Breadcrumb = () => {
  const { pathname } = useLocation();
  
  // Verificar si la ruta está en breadcrumbConfig 
  const items = breadcrumbConfig[pathname] || [];

  // Si no está en breadcrumbConfig, dividir la ruta en segmentos
  const segments = pathname.split("/").filter(Boolean);

  // Si no hay items en breadcrumbConfig, manejar ruta dinámica
  if (items.length === 0) {
    // Si el primer segmento es "products", lo descartamos
    const labelSegments = segments[0] === "products" ? segments.slice(1) : segments;

    return (
      <nav aria-label="breadcrumb" className="p-3 mx-6 rounded">
        <ol className="flex space-x-2">
          {/* Siempre mostramos Home */}
          <li>
            <Link to="/" className="text-[#25396f] hover:underline">
              Home
            </Link>
            {labelSegments.length > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>

          {labelSegments.map((segment, idx) => {
            const realPath = segments
              .slice(0, idx + 1 + (segments[0] === "products" ? 1 : 0))
              .join("/");
            const to = `/${realPath}`;
            const isLast = idx === labelSegments.length - 1;

            return (
              <li key={to} className="flex items-center">
                {isLast ? (
                  <span className="text-gray-500">
                    <span className="hidden sm:inline">
                      {capitalize(decodeURIComponent(segment))}
                    </span>
                  </span>
                ) : (
                  <Link to={to} className="text-[#25396f] hover:underline">
                    {capitalize(decodeURIComponent(segment))}
                  </Link>
                )}
                {!isLast && <span className="mx-2 text-gray-400">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  // Si la ruta está configurada en breadcrumbConfig, usar esa configuración
  return (
    <nav aria-label="breadcrumb" className="p-3 mx-6 rounded">
      <ol className="flex space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link to={item.href} className="text-[#25396f] hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
