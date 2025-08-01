import React from "react";
import NavBar from "../../../components/user/layout/NavBar";
import Breadcrumb from "../../../components/user/layout/Breadcrumb";
import Footer from "../../../components/user/layout/Footer";

export default function ReturnsExchanges() {
  return (
    <div className="bg-white">
      <NavBar />
      
      <div className="pt-36">
        <Breadcrumb />
      </div>

      <main className="flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Cambios y Devoluciones - Urban
          </h1>
          <p className="text-gray-600 mb-8">
            En Urban queremos que estés 100% satisfecho con tu compra. Aquí te
            explicamos cómo realizar cambios o devoluciones de forma sencilla.
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Política de Devoluciones
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Dispones de 14 días desde la recepción del pedido para realizar
                una devolución.
              </li>
              <li>
                El producto debe estar sin usar, con etiquetas y en su empaque
                original.
              </li>
              <li>
                Los productos en oferta no son elegibles para devolución (salvo
                defectos).
              </li>
              <li>
                Los gastos de envío de la devolución corren por cuenta del
                cliente.
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Política de Cambios
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Podrás solicitar un cambio de talla o color dentro de los 14
                días posteriores a la entrega.
              </li>
              <li>
                El producto debe estar en perfectas condiciones, sin uso y con
                etiquetas.
              </li>
              <li>
                Si el producto que deseas no está disponible, te ofreceremos un
                reembolso o un cupón de compra.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              ¿Cómo solicitar un cambio o devolución?
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2">
              <li>
                Envíanos un correo a <strong>devoluciones@urban.com</strong>{" "}
                indicando tu número de pedido y motivo.
              </li>
              <li>
                Te enviaremos las instrucciones y la dirección para la
                devolución.
              </li>
              <li>
                Una vez recibamos el producto, procesaremos el cambio o
                reembolso en un plazo de 5 a 7 días hábiles.
              </li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
