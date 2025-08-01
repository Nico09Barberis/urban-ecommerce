import React from "react";

const ContactList = () => {
  const contacts = [
    { name: "Diego Mardec", email: "soydiegomardec@gmail.com", status: "online" },
    { name: "Marcela Lopez", email: "marcelopez31@gmail.com", status: "offline" },
    { name: "Lautaro Del Campo", email: "Lautarodelcampo@gmail.com", status: "busy" },
    { name: "Dante Blatter", email: "soydanteBlatter1@gmail.com", status: "online" },
    { name: "inventario miempresa", email: "inventariomiempresa@gmail.com", status: "offline" },
    { name: "Macarana Solis", email: "macasolis311@hotmail.com", status: "busy" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="max-w-6xl">
      {/* Contenedor único para la lista de contactos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-left mb-4 text-[#25396f]">Mis contactos</h2>
        <ul>
          {contacts.map((contact, index) => (
            <li
              key={index}
              className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0"
            >
              {/* Avatar */}
              <div className="relative w-12 h-12 contact-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    contact.name
                  )}&background=random&size=128`}
                  alt={contact.name}
                  className="w-full h-full rounded-full"
                />
                {/* Estado */}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                    contact.status
                  )}`}
                ></span>
              </div>
              {/* Información de contacto */}
              <div>
                <p className="text-gray-700 text-start font-medium">{contact.name}</p>
                <p className="text-gray-500 text-start text-sm">{contact.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactList;
