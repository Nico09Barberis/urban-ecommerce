import React from "react";
import Footer from "../../../components/user/layout/Footer";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";

export default function Contact() {
  return (
    <div className="bg-white">
      <NavBar />

      <div className="pt-36">
        <Breadcrumb />
      </div>

      <main className="flex flex-col mix-h-screen">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Contáctanos</h1>
          <p className="text-gray-600 mb-6">
            Si tienes alguna pregunta, comentario o necesitas asistencia, no
            dudes en ponerte en contacto con nosotros. En Urban estamos aquí
            para ayudarte.
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Información de contacto
            </h2>
            <ul className="text-gray-600 space-y-2">
              <li>
                <strong>Email:</strong> soporte@urban.com
              </li>
              <li>
                <strong>Teléfono:</strong> +52 55 1234 5678
              </li>
              <li>
                <strong>Horario de atención:</strong> Lunes a Viernes de 9:00 a
                18:00 hrs
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Envíanos un mensaje
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
