import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl text-gray-600 mt-4">Oops, la página que buscas no existe.</p>
      <Link to="/home" className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;
