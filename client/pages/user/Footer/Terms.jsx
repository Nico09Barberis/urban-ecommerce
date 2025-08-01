import React from "react";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Footer from "../../../components/user/layout/Footer";

const TermsAndConditions = () => {
  return (
    <div className="bg-white">
      <NavBar /> 

      <div className="pt-36">
        <Breadcrumb />
      </div>

      <main>
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
          <h1 className="text-3xl font-bold text-[#2a2b38] mb-6">
            Términos y Condiciones
          </h1>

          <p className="mb-4">
            Bienvenido a <strong>Urban</strong>. Al acceder y utilizar nuestro
            sitio web, aceptas cumplir con los siguientes términos y
            condiciones. Si no estás de acuerdo con alguno de estos términos, te
            pedimos que no utilices nuestro sitio.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            1. Información General
          </h2>
          <p className="mb-4">
            Urban es una tienda online dedicada a la venta de ropa urbana y
            accesorios. Nos reservamos el derecho de modificar, actualizar o
            eliminar cualquier parte de los términos sin previo aviso. Te
            recomendamos revisar esta página periódicamente.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            2. Compras y Pagos
          </h2>
          <p className="mb-4">
            Todos los productos y precios están sujetos a disponibilidad.
            Aceptamos pagos mediante tarjeta de crédito, débito y otros métodos
            seguros a través de Stripe o PayPal. Los precios están expresados en
            moneda local e incluyen los impuestos correspondientes.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            3. Envíos y Devoluciones
          </h2>
          <p className="mb-4">
            Realizamos envíos a todo el país. Los plazos de entrega son
            aproximados y pueden variar. Aceptamos devoluciones dentro de los 15
            días posteriores a la recepción del pedido, siempre que el producto
            se encuentre en perfectas condiciones y sin uso.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            4. Propiedad Intelectual
          </h2>
          <p className="mb-4">
            Todo el contenido de este sitio (textos, imágenes, logotipos,
            diseños) es propiedad de Urban y está protegido por las leyes de
            derechos de autor. Queda prohibida su reproducción sin autorización
            expresa.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            5. Protección de Datos
          </h2>
          <p className="mb-4">
            Nos comprometemos a proteger tu información personal conforme a
            nuestra{" "}
            <span className="underline cursor-pointer">
              Política de Privacidad
            </span>
            . No compartiremos tus datos con terceros sin tu consentimiento.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            6. Contacto
          </h2>
          <p className="mb-4">
            Para cualquier consulta sobre estos términos y condiciones, puedes
            contactarnos a través del correo electrónico{" "}
            <a
              href="mailto:soporte@urban.com"
              className="text-[#ffeba7] underline"
            >
              soporte@urban.com
            </a>
            .
          </p>

          <p className="mt-8 text-sm text-gray-500">
            Última actualización: Abril 2025
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
