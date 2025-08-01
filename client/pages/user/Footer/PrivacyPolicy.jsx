import React from "react";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Footer from "../../../components/user/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white"> 
      <NavBar />

      <div className="pt-36">
        <Breadcrumb />
      </div>

      <main className="flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
          <h1 className="text-3xl font-bold text-[#2a2b38] mb-6">
            Política de Privacidad
          </h1>

          <p className="mb-4">
            En <strong>Urban</strong>, valoramos y respetamos tu privacidad.
            Esta política describe cómo recopilamos, usamos y protegemos tu
            información personal cuando visitas nuestro sitio web y realizas
            compras con nosotros.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            1. Información que Recopilamos
          </h2>
          <p className="mb-4">
            Recopilamos información personal que tú nos proporcionas
            voluntariamente, como tu nombre, dirección, correo electrónico,
            número de teléfono y datos de pago cuando realizas una compra, te
            registras o te comunicas con nosotros.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            2. Uso de la Información
          </h2>
          <p className="mb-4">
            Utilizamos tu información para procesar pedidos, brindar atención al
            cliente, gestionar tu cuenta, enviarte comunicaciones relevantes y
            mejorar la experiencia en nuestro sitio. No vendemos ni alquilamos
            tu información a terceros.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            3. Compartir Datos con Terceros
          </h2>
          <p className="mb-4">
            Solo compartimos tu información con terceros cuando es necesario
            para procesar pagos (Stripe, PayPal) o realizar envíos. Estos
            proveedores están obligados a proteger tus datos y no pueden
            utilizarlos para otros fines.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            4. Seguridad de la Información
          </h2>
          <p className="mb-4">
            Implementamos medidas de seguridad para proteger tu información,
            como cifrado SSL y almacenamiento seguro de datos. Sin embargo,
            ningún sistema es 100% infalible, por lo que no podemos garantizar
            la seguridad absoluta.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            5. Tus Derechos
          </h2>
          <p className="mb-4">
            Tienes derecho a acceder, rectificar o eliminar tu información
            personal. Puedes ejercer estos derechos contactándonos a{" "}
            <a
              href="mailto:soporte@urban.com"
              className="text-[#ffeba7] underline"
            >
              soporte@urban.com
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            6. Cookies
          </h2>
          <p className="mb-4">
            Utilizamos cookies para mejorar la navegación y analizar el uso del
            sitio. Puedes configurar tu navegador para rechazar cookies, pero
            algunas funciones pueden no estar disponibles.
          </p>

          <h2 className="text-2xl font-semibold text-[#2a2b38] mt-6 mb-2">
            7. Cambios en la Política
          </h2>
          <p className="mb-4">
            Nos reservamos el derecho de modificar esta política en cualquier
            momento. Los cambios entrarán en vigor cuando se publiquen en esta
            página. Te recomendamos revisarla periódicamente.
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

export default PrivacyPolicy;
