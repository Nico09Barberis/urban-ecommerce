import { useState, useEffect } from "react";

function EmailHistory() {
  const [emails, setEmails] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null); // Controla qué correo está desplegado

  useEffect(() => {
    const savedEmails = JSON.parse(localStorage.getItem("emails")) || [];
    setEmails(savedEmails);
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Alterna entre mostrar y ocultar
  };

  const deleteEmail = (index) => {
    const updatedEmails = emails.filter((_, i) => i !== index);
    setEmails(updatedEmails);
    localStorage.setItem("emails", JSON.stringify(updatedEmails));
  };
  
  return (
    <div className="container mx-auto my-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-left text-[#25396f] uppercase mx-3 p-3">Historial de correos enviados</h2>
      {emails.length > 0 ? (
        <div className="space-y-3 mx-6">
          {emails.map((email, index) => (
            <div key={index} className="bg-gray-100 hover:bg-gray-200 p-4 text-left rounded-md border cursor-pointer" onClick={() => toggleExpand(index)}>
              <p className="font-semibold text-lg">{email.destinatario}</p>
              <p className="text-sm text-gray-600">{email.fecha}</p>

              {expandedIndex === index && (
                <div className="mt-2 border-t pt-2 text-gray-700 whitespace-pre-line">
                  {email.cuerpo}
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); deleteEmail(index); }}
                className="text-red-500 hover:text-red-700 text-md mt-2"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mx-6">No hay correos enviados registrados.</p>
      )}
    </div>
  );
}

export default EmailHistory;
