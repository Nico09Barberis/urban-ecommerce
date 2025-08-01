import { useEffect } from "react";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500); // El mensaje desaparece después de 2.5 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-50 bg-[#FFF9C4] text-black px-4 py-2 rounded shadow-lg animate-slide-in">
      {message}
    </div>
  );
};

export default Toast;
