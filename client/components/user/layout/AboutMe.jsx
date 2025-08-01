import React from "react";
import { FaCity } from "react-icons/fa";

const AboutMe = () => {
  return (
    <div className="bg-black text-white py-16 px-8 container mx-auto">
      {/* Contenedor centrado con límite de ancho */}
      <div className="max-w-4xl mx-auto text-left">
        <h2 className="font-oswald font-bold italic tracking-wider uppercase text-5xl text-left mb-6">
          Urban: vibra urbana, estilo real
        </h2>

        <p className="text-lg leading-relaxed">
          En <span className="font-bold">Urban</span>, el corazón de la ciudad late en cada prenda.
          Nuestro estilo nace de las calles y vibra con la energía urbana: auténtico, versátil y lleno de actitud.
        </p>

        <p className="mt-6 text-lg leading-relaxed">
          Nuestra tienda nació con una misión clara: <span className="font-bold">conectar la moda con la cultura urbana</span>,
          ofreciendo prendas que expresan identidad, movimiento y confianza.
        </p>

        <p className="mt-6 text-lg leading-relaxed">
          Creemos que vestirse es más que elegir ropa: es <span className="font-bold">mostrar quién sos</span>,
          contar tu historia y caminar con estilo propio. Urban es para quienes viven la ciudad a su manera y no siguen las reglas.
        </p>

        <p className="mt-12 text-xl font-oswald italic font-bold uppercase tracking-wide text-center">
          Bienvenido a Urban: estilo sin limites, como vos.
        </p>
      </div>
    </div>
  );
};

export default AboutMe;
