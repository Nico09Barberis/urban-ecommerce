import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-6">
      <div className="container mx-auto px-4 text-left grid grid-cols-1 md:grid-cols-5 gap-6 text-sm">
        {/* Tienda online */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tienda online</h3>
          <ul>
            <li><Link to="/products/hombre" className="hover:underline">Hombre</Link></li>
            <li><Link to="/products/mujer" className="hover:underline">Mujer</Link></li>
            <li><Link to="/products/outlet" className="hover:underline">Outlet</Link></li>
            <li><Link to="/products/accesorios" className="hover:underline">Accesorios</Link></li>
          </ul>
        </div>
        
        {/* Sobre la compra */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Sobre la compra</h3>
          <ul>
            <li><Link to="/help-center" className="hover:underline">Centro de ayuda</Link></li>
            <li><Link to="/return-exchanges" className="hover:underline">Cambios y Devoluciones</Link></li>
            <li><Link to="/contact" className="hover:underline">Contacto</Link></li>
            <li><Link to="/payment-methods" className="hover:underline">Medios de pago</Link></li>
          </ul>
        </div>

        {/* Cancelación de compra */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Cancelación de compra</h3>
          <ul>
            <li><Link to="/boton-de-arrepentimiento" className="hover:underline">Botón de arrepentimiento</Link></li>
            <li><Link to="/solicitud-de-cancelacion" className="hover:underline">Solicitud de cancelación de compra</Link></li>
          </ul>
        </div>

        {/* Acerca de Topper */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Acerca de Urban</h3>
          <ul>
            <li><Link to="/about-us" className="hover:underline">Quienes somos</Link></li>
            <li><Link to="/code-of-conduct" className="hover:underline">Principios de conducta y ética</Link></li>
          </ul>
        </div>

        {/* Legales */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Legales</h3>
          <ul>
            <li><Link to="/terms-conditions" className="hover:underline">Términos y condiciones de uso</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Política de privacidad</Link></li>
            <li><Link to="" className="hover:underline">Política de cambios y devoluciones</Link></li>
            <li><Link to="" className="hover:underline">Defensa y protección al consumidor</Link></li>
          </ul>
        </div>
      </div>

      {/* Redes sociales */}
      <div className="mt-6 text-center">
        <p className="text-sm">Seguinos en nuestras redes sociales:</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link to="" className="hover:text-gray-400">Facebook</Link>
          <Link to="" className="hover:text-gray-400">Instagram</Link>
          <Link to="" className="hover:text-gray-400">Twitter</Link>
          <Link to="" className="hover:text-gray-400">YouTube</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
