
import React, { useState, useEffect } from "react"; // Hooks de React
import { Link } from "react-router-dom"; // Link para redirigir a páginas internas
import { IoSearch } from "react-icons/io5"; // Icono de lupa de búsqueda


export default function Search() {
  // Estados del componente
  const [search, setSearch] = useState(""); // Guarda el texto ingresado por el usuario en el input
  const [results, setResults] = useState([]); // Guarda los resultados devueltos por el backend

  // ================================================================================
  //              FUNCION QUE MANEJA EL CAMBIO EN EL INPUT DE BUSQUEDA
  // ================================================================================

  const handleSearch = async (event) => {
    const value = event.target.value; // Valor actual del input
    setSearch(value); // Actualizar el estado con lo que escribe el usuario

    // Si el texto ingresado tiene más de 1 carácter, hacer la búsqueda
    if (value.length > 1) {
      try {
        // Llamada al backend con el valor de búsqueda como query param
        const response = await fetch(`http://localhost:5000/api/home/search?q=${value}`);
        
        console.log("Estado de respuesta:", response.status);
        console.log("Cabeceras de respuesta:", response.headers.get("content-type"));

        // Si la respuesta no fue exitosa, lanzar un error
        if (!response.ok) throw new Error(`Error en la búsqueda: ${response.status}`);

        // Parsear la respuesta como JSON
        const data = await response.json();
        console.log("Datos obtenidos:", data);

        // Verificar que la respuesta sea un array antes de actualizar el estado
        if (!Array.isArray(data)) {
          console.error("La API no devolvió un array:", data);
          setResults([]); // Si no es un array, resetear los resultados
          return;
        }

        // Guardar los resultados en el estado
        setResults(data);
      } catch (error) {
        // En caso de error en la petición, mostrar el error y limpiar los resultados
        console.error("Error en la búsqueda:", error);
        setResults([]);
      }
    } else {
      // Si el usuario borra el input o escribe poco, limpiar los resultados
      setResults([]);
    }
  };

  // useEffect para depurar cambios en los resultados
  useEffect(() => {
    console.log("Resultados actualizados:", results);
  }, [results]); // Se ejecuta cada vez que results cambia

  // Limpia los resultados poco después de hacer clic en un producto
  const handleClickProduct = () => {
    setTimeout(() => setResults([]), 100); // Se espera un pequeño tiempo para que Link funcione antes de limpiar
  };


  return (
    <div className="relative flex items-center max-w-56 w-fit h-fit px-2 border-2 border-none text-gray-800 bg-[#4a4b58]">
      {/* Icono de búsqueda */}
      < IoSearch className="text-gray-400"/>

      {/* Input de búsqueda */}
      <input
        className="bg-transparent text-gray-300 outline-none w-full border-0 px-4 py-2 text-sm placeholder-gray-400"
        type="text"
        placeholder="Buscar"
        value={search}
        onChange={handleSearch}
      />

      {/* Lista de resultados */}
      {results.length > 0 && (
        <ul className="absolute left-0 top-full w-full bg-white border mt-2 shadow-lg z-50">
          {results.map((product, index) => (
            <li key={product._id || index} className="p-2 hover:bg-gray-200 flex items-center">
              <img src={product.imageUrl} alt={product.name} className="w-14 h-14 mr-2 rounded" />
              <div className="text-left">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-700">{product.description}</p>
                <Link
                  to={`/products/${product.category}/${product.subcategory}/${product._id}`}
                  className="mb-2 text-black text-sm font-bold tracking-wider border-b-2 border-black hover:bg-gray-300 transition duration-300"
                  onClick={handleClickProduct}
                >
                  Ver más
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}