import React, { useState } from "react";
import axios from 'axios';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const[success, setSuccess] = useState('');

  const handleSumbit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/register', {email, password});
      setSuccess('Registro exitoso!');
      setError('');
      console.log('Respuesta del servidor:', response.data);
    }catch(error){
      setError('Hubo un error en el registro, intentelo de nuevo.');
      setSuccess('');
      console.log('Error al registrar:', error.response.data);
    }
  };

return (
  <div className="flex item-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center">Registrarse</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSumbit} className="mt-6">
        <div className="mb-4">
          <label className="block text-gray-700">Correo electronico: </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contraseña:</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition"
        >
        Registrarse
        </button>
      </form>
    </div>
  </div>

  );
};

export default SignUp;