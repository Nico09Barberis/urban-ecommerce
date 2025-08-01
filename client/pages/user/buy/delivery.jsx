import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// contraseña paypal: 7MQJ!Cxg

// Componentes personalizados reutilizables
import NavBar from '../../../components/user/layout/NavBar';
import Breadcrumb from '../../../components/user/layout/Breadcrumb';
import Footer from '../../../components/user/layout/Footer';
import PayPalButton from '../../../components/user/layout/PaypalButton';
import Button from '../../../components/user/layout/Button';

// Iconos
import { IoWarningOutline } from "react-icons/io5";

//============================================================================
//                  COMPONENTE PRINCIPAL: DeliveryOptions
//============================================================================

const DeliveryOptions = () => {
  // Estado para la opción de entrega seleccionada
  const [selectedOption, setSelectedOption] = useState("home");

  // Dirección del usuario
  const [userAddress, setUserAddress] = useState(null);

  // Valores monetarios
  const [subtotal, setSubtotal] = useState(0);
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [total, setTotal] = useState(0);

  // Elementos del carrito
  const [cartItems, setCartItems] = useState([]);

  // Validación de dirección por defecto
  const isDefaultAddress = userAddress?.street === "default street";

  // Estado de errores
  const [error, setError] = useState(null);

  // Hook para navegación
  const navigate = useNavigate();

  //============================================================================
  //                 OBTENER DATOS DEL USUARIO (Dirección)
  //============================================================================
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('token almacenado', token);

        const response = await fetch('http://localhost:5000/api/user/address', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }

        const data = await response.json();
        setUserAddress(data.address);
        console.log('Direccion obtenida: ', data.address);
      } catch (error) {
        console.error('Error al obtener la direccion del usuario', error);
        toast.error('No se pudo obtener la dirección del usuario.');
      }
    };

    fetchUserData();
  }, []);

  //============================================================================
  //                 OBTENER DATOS DEL CARRITO Y CALCULAR TOTALES
  //============================================================================
  
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del carrito.');
        }

        const data = await response.json();
        const cartItems = data?.items || [];
        setCartItems(cartItems);

        // Calcula el subtotal del carrito
        const calculatedSubtotal = cartItems.reduce((acc, item) => {
          const priceToUse = item.productId.offerPrice || item.productId.price;
          return acc + priceToUse * item.quantity;
        }, 0);
        setSubtotal(calculatedSubtotal);

        // Calcula el costo de envío
        const calculatedShippingCost = calculatedSubtotal > 100000 ? 0 : 5000;
        setCostoEnvio(calculatedShippingCost);

        // Calcula el total
        setTotal(calculatedSubtotal + calculatedShippingCost);
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
        setError('Hubo un problema al obtener los datos del carrito');
        toast.error('Hubo un problema al obtener los datos del carrito.');
      }
    };

    fetchCartData();
  }, []);

  //============================================================================
  //                   CAMBIAR OPCIÓN DE ENTREGA SELECCIONADA
  //============================================================================
  
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  //============================================================================
  //                  MANEJAR PAGO EXITOSO CON PAYPAL
  //============================================================================
  
  const handleSuccess = async (order) => {
    console.log('Ejecutando handleSuccess');

    // Validación: carrito vacío
    if (cartItems.length === 0) {
      console.error("Error: El carrito está vacío.");
      setError("El carrito está vacío. No se puede registrar la orden.");
      toast.error("El carrito está vacío. No se puede registrar la orden");
      return;
    }

    // Validación: total debe ser mayor a cero
    if (total <= 0) {
      console.error("Error: El monto total debe ser mayor que cero.");
      setError("El monto total debe ser mayor que cero.");
      toast.error("El monto total debe ser mayor que cero.");
      return;
    }

  // Preparar los datos de la orden para enviarlos al backend
  const orderData = {
  // Mapear cada ítem del carrito a un formato específico que necesita el backend
  items: cartItems.map((item) => {
    // Verificar si el producto tiene una talla seleccionada
    const hasSize = item.size !== undefined && item.size !== null;
        return {
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.offerPrice || item.productId.price,
          selectedSize: hasSize ? item.size : null,   // Talla seleccionada, si el producto tiene; si no, se guarda como null
        };
      }),
      total: total,
      status: 'Pendiente',
      PaymentMethod: 'Paypal',
    };

    console.log('Datos enviados al backend', orderData);
    console.log('PaymentMethod enviado al backend:', orderData.PaymentMethod);

  // Mostrar un toast de carga mientras se procesa la orden
  const loadingToastId = toast.loading('Procesando tu pedido...');

  try {
    // Enviar la orden al backend
    const response = await fetch('http://localhost:5000/api/orders/checkout', {
      method: 'POST',
      headers: {
        // Indicar que se envían datos en formato JSON
        'Content-Type': 'application/json',
        // Incluir el token JWT almacenado para autenticar al usuario
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      // Enviar los datos de la orden convertidos a JSON
      body: JSON.stringify(orderData),
    });

    // Si la respuesta no es exitosa, lanzar un error con el detalle
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error del backend: ', errorDetails);
      throw new Error('Error al registrar la orden');
    }

    // Si todo va bien, mostrar la orden registrada por consola
    const data = await response.json();
    console.log('Orden registrada: ', data);

    // Mostrar un toast de éxito y redirigir a la página de éxito
    toast.success("¡Compra realizada con éxito!", { id: loadingToastId });
    navigate("/success");

  } catch (error) {
    // Si ocurre un error, mostrarlo en consola y notificar al usuario
    console.log('Error al registrar la orden: ', error);
    toast.error('No se pudo completar la compra. Inténtalo nuevamente.', { id: loadingToastId });
    }
  };


  return (
    <div>
      <NavBar />

      <div className="pt-36">
        <Breadcrumb />
      </div> 

        <div className="flex flex-col md:flex-row justify-between p-6">
          <div className="w-full md:w-2/3 space-y-4 bg-white m-6 p-6 shadow-md">
            <h2 className="text-xl font-bold">Selecciona la forma de entrega</h2>
            
            {/* Envío a domicilio */}
              <div
                className={`p-4 m-4 border rounded mb-4 cursor-pointer ${
                  selectedOption === "home" ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => handleOptionChange("home")}
              >
                <p className="font-semibold">Enviar a domicilio</p>
                {userAddress && selectedOption === "home" && (
                  <p className="text-sm text-gray-500 mt-2">
                    Dirección: {`${userAddress.street} ${userAddress.number}, ${userAddress.city}`}
                  </p>
                )}
              </div>

              {/* Retiro en un punto de entrega */}
              <div
                className={`p-4 m-4 border rounded cursor-pointer ${
                  selectedOption === "pickup" ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => handleOptionChange("pickup")}
              >
                <p className="font-semibold">Retiro en un punto de entrega - Gratis</p>
              </div>
            </div>

          {/* Resumen de compra */}
          <div className="w-full md:w-1/3 bg-white p-6 m-6 text-left shadow-md">
            <h3 className="text-3xl font-oswald italic font-bold uppercase">Resumen de compra</h3>
            <div className="mt-2">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <span className="font-semibold">${subtotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between">
                <p>Costo de envío</p>
                <span className="font-semibold">${costoEnvio.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between font-bold mt-4 mb-4">
                <p>Total a pagar</p>
                <span className="font-semibold">${total.toLocaleString('es-AR')}</span>
              </div>
            </div>
            {isDefaultAddress ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                <span className='flex items-center gap-2'>
                  <IoWarningOutline className='text-2xl mb-2' />
                  <p className="font-semibold mb-2">Antes de continuar, actualizá tu dirección de envío.</p>
                </span>
                <Button to="/addresses">
                  Actualizar dirección
                </Button>
              </div>
            ) : total > 0 ? (
              <PayPalButton total={total} onSuccess={handleSuccess} />
            ) : (
              <p className="text-red-500">El monto total debe ser mayor que cero para procesar el pago.</p>
            )}
              <p className=' text-gray-400 italic underline'>Proximamente mas formas de pago</p>
          </div>
        </div>
        <Footer />
      </div>
      );
    };

export default DeliveryOptions;
