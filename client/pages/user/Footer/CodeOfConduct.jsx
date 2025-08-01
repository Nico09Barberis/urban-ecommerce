import React from "react";
import Footer from "../../../components/user/layout/Footer";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";

export default function CodeOfConduct() {
  return (
    <div className="bg-white">
      <NavBar />

      <div className="pt-36">
        <Breadcrumb />
      </div>

      <main className="flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Principios de Conducta
          </h1>
          <p className="text-gray-600 mb-6">
            En Urban, creemos en una comunidad basada en el respeto, la
            inclusión y la integridad. Nuestros principios de conducta guían
            cada interacción dentro de nuestra tienda y con nuestros clientes.
          </p>

          <ul className="list-disc list-inside space-y-4 text-gray-700">
            <li>
              <span className="font-semibold">Respeto mutuo:</span> Tratamos a
              todos con cortesía y consideración, independientemente de su
              origen, género, orientación o creencias.
            </li>
            <li>
              <span className="font-semibold">Inclusión:</span> Fomentamos un
              ambiente abierto y accesible para todas las personas, sin
              discriminación.
            </li>
            <li>
              <span className="font-semibold">Transparencia:</span> Actuamos con
              honestidad y claridad en nuestras políticas, precios y
              comunicaciones.
            </li>
            <li>
              <span className="font-semibold">Responsabilidad:</span> Nos
              hacemos responsables de la calidad de nuestros productos y del
              servicio que ofrecemos.
            </li>
            <li>
              <span className="font-semibold">Sostenibilidad:</span> Promovemos
              prácticas que respetan el medio ambiente y contribuyen al
              bienestar social.
            </li>
          </ul>

          <p className="text-gray-600 mt-6">
            Estos principios son la base de nuestra identidad como tienda y
            comunidad. Agradecemos que nuestros clientes y colaboradores
            compartan estos valores.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
