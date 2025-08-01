import React from "react";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Footer from "../../../components/user/layout/Footer";

export default function HelpCenter() {
  return (
    <div className="bg-white">
      <NavBar />
 
      <div className="pt-36">
        <Breadcrumb />
      </div>

      <main className="flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Centro de Ayuda Urban
          </h1>
          <p className="text-gray-600 mb-8">
            ¿Tienes dudas o necesitas ayuda? Aquí encontrarás respuestas a las
            preguntas más frecuentes y un formulario para contactarnos.
          </p>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Preguntas Frecuentes
            </h2>
            <ul className="space-y-4">
              <li>
                <h3 className="font-medium text-gray-800">
                  ¿Cuáles son los métodos de pago aceptados?
                </h3>
                <p className="text-gray-600">
                  Por ahora solo aceptamos pagos con PayPal. Estamos trabajando
                  para agregar más formas de pago próximamente.
                </p>
              </li>
              <li>
                <h3 className="font-medium text-gray-800">
                  ¿Cuánto tarda el envío?
                </h3>
                <p className="text-gray-600">
                  El tiempo de envío estándar es de 7 a 14 días hábiles,
                  dependiendo de tu ubicación.
                </p>
              </li>
              <li>
                <h3 className="font-medium text-gray-800">
                  ¿Puedo devolver un producto?
                </h3>
                <p className="text-gray-600">
                  Sí, aceptamos devoluciones dentro de los 14 días posteriores a
                  la entrega, siempre que el producto esté en su estado
                  original.
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Contáctanos
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              <textarea
                rows="4"
                placeholder="Tu mensaje"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              ></textarea>
              <button
                type="submit"
                className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
