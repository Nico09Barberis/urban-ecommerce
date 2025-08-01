import React from "react";

const ChatCard = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden mx-auto">
      <div className="chat-header p-3 bg-gray-200 flex items-center">
        <h2 className="text-lg font-medium text-[#25396f]">ChatGPT</h2>
      </div>
      <div className="chat-body p-5 space-y-3">
        <div className="message incoming bg-gray-200 rounded-lg p-3">
          <p className="text-sm text-[#25396f]">Hola, ¿en que puedo ayudarte?</p>
        </div>
        <div className="message outgoing bg-gray-100 rounded-lg p-3 text-right">
          <p className="text-sm text-[#25396f]">Dame los 10 colores en tendencia</p>
        </div>
        <div className="message incoming bg-gray-200 rounded-lg p-3">
          <p className="text-sm text-[#25396f]">¡Claro! a continuacion, te presento la lista...</p>
        </div>
      </div>
      <div className="chat-footer p-3 bg-gray-200 items-center flex space-x-2">
        <input
          type="text"
          placeholder="Escriba aqui"
          className="flex-grow w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button className="p-2 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-green-500 transition duration-300 text-center">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatCard;

