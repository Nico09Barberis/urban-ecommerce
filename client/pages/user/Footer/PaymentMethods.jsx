import React from "react";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Footer from "../../../components/user/layout/Footer";

export default function PaymentMethods() {
  return (
    <div className="bg-white">
      <NavBar />

      <div className="pt-36">
        <Breadcrumb />
      </div>

      <main className="flex flex-col min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Medios de Pago - Urban
        </h1>
        <p className="text-gray-600 mb-8">
          En Urban buscamos ofrecerte un proceso de pago simple y seguro.
          Actualmente, contamos con el siguiente método de pago disponible:
        </p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">PayPal</h2>
          <p className="text-gray-600">
            Realiza tus compras de forma segura con tu cuenta de PayPal. Podrás
            pagar con tu saldo de PayPal, tarjetas de crédito o débito
            vinculadas a tu cuenta.
          </p>
        </div>

        <p className="text-gray-600">
          Estamos trabajando para incorporar más opciones de pago muy pronto.
        </p>
      </div>
      </main>
      <Footer />
    </div>
  );
}
