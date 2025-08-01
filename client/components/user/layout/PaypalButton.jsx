import React, { useEffect, useRef, useState } from "react";

const PayPalButton = ({ total, onSuccess }) => {
  const paypalLoaded = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (paypalLoaded.current) return;

    if (!window.paypal) {
      console.error("El SDK de PayPal no está disponible o no se cargó correctamente.");
      setError("Hubo un problema al cargar PayPal. Por favor, intenta más tarde.");
      return;
    }

    paypalLoaded.current = true;

    const container = document.getElementById("paypal-button-container");
    if (!container) {
      console.error("El contenedor 'paypal-button-container' no está presente en el DOM.");
      setError("No se puede renderizar el botón de PayPal. Por favor, verifica.");
      return;
    }
    container.innerHTML = "";

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        try {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total || 0,
                },
              },
            ], 
          });
        } catch (orderError) {
          console.error("Error al crear la orden:", orderError);
          setError("Hubo un problema al crear la orden. Inténtalo nuevamente.");
        }
      },
      onApprove: async (data, actions) => {
        try {
          const order = await actions.order.capture();
          console.log("Compra aprobada:", order);
          onSuccess(order);
        } catch (approvalError) {
          console.error("Error al capturar la orden:", approvalError);
          setError("Hubo un problema al confirmar el pago. Por favor, inténtalo nuevamente.");
        }
      },
      onError: (err) => {
        console.error("Error durante el proceso de pago:", err);
        setError("Hubo un problema con el pago. Inténtalo nuevamente.");
      },
    }).render("#paypal-button-container");
  }, [total, onSuccess]);

  return (
    <div>
      <div id="paypal-button-container"></div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default PayPalButton;
