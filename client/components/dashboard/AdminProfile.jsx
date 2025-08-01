import React from "react";

const AdminProfile = () => {
  const name = "Nombre Apellido";
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join(""); // Obtiene las iniciales (NB)

  return (
    <div className="flex items-center w-full bg-white shadow-md rounded-md">
      {/* Sección de icono circular */}
      <section className="flex justify-center ml-2 items-center w-14 h-14 rounded-full shadow-md bg-gradient-to-r from-[#F9C97C] to-[#A2E9C1] hover:from-[#C9A9E9] hover:to-[#7EE7FC] hover:cursor-pointer hover:scale-110 duration-300">
        <span className="text-gray-700 admin-profile-initials">{initials}</span>
      </section>

      {/* Sección de contenido */}
      <section className="block border-l border-gray-300 m-3">
        <div className="pl-3 admin-profile-content">
          <h3 className="text-gray-600 font-semibold text-start text-sm">{name}</h3>
          <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#005BC4] to-[#27272A] text-lg font-bold">
            Administrador de Urban
          </h3>
        </div>
        <div className="flex gap-3 pt-2 pl-3">
          {/* Iconos sociales */}
          <svg
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-white stroke-2"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <svg
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-white stroke-2"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </svg>
        </div>
      </section>
    </div>
  );
};

export default AdminProfile;
