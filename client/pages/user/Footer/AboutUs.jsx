import React from "react";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Footer from "../../../components/user/layout/Footer";

export default function AboutUs() {
  return (
    <div className="bg-white">
      <NavBar />

      <div className="pt-36">
        <Breadcrumb />
      </div>

      <main className="flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            ¿Quiénes Somos?
          </h1>

          <p className="text-gray-600 mb-4">
            En <span className="font-semibold text-gray-800">Urban</span>, somos
            más que una tienda de ropa. Somos una comunidad apasionada por el
            estilo urbano, las tendencias contemporáneas y la autoexpresión a
            través de la moda. Desde nuestra fundación en 2025, nos hemos
            dedicado a ofrecer a nuestros clientes las mejores colecciones de
            ropa y accesorios que reflejan autenticidad y personalidad.
          </p>

          <p className="text-gray-600 mb-4">
            Nuestro equipo está formado por diseñadores, creativos y amantes de
            la cultura urbana que trabajan día a día para brindarte una
            experiencia única, tanto en la calidad de nuestros productos como en
            el servicio que ofrecemos. Creemos que la moda es una forma de
            contar tu historia, y queremos acompañarte en cada paso de ese
            camino.
          </p>

          <p className="text-gray-600 mb-4">
            En Urban nos comprometemos con la sostenibilidad y la ética en la
            producción de nuestras prendas, colaborando con fabricantes
            responsables y priorizando materiales de calidad que respeten el
            medio ambiente.
          </p>

          <p className="text-gray-600">
            Gracias por ser parte de Urban. Te invitamos a seguir explorando
            nuestras colecciones y a ser parte de nuestra comunidad.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
