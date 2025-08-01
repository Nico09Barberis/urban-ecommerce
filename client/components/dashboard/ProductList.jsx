import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProductList = () => {
  // Estado principal de listado de productos con filtros y paginacion
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  // Estado para filtros aplicados desde el formulario
  const [filters, setFilters] = useState({
    description: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para controlar la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 20;

  const navigate = useNavigate();

  // ==========================================================================
  //                  EFECTO PARA OBTENER PRODUCTOS DEL BACKEND
  // ==========================================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/products"
        );
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        const data = await response.json();
        console.log("Productos obtenidos: ", data);
        setProducts(data);
        setFilterProducts(data);
      } catch (error) {
        console.error("Error al obtener productos", error);
        setError("Error al obtener productos");
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchProduct();
  }, []);

  // ==========================================================================
  //           EFECTO PARA APLICAR FILTROS CUANDO CAMBIAN LOS FILTROS
  // ==========================================================================

  useEffect(() => {
    const applyFilters = () => {
      let filtered = products;

      // Filtro para descripcion del producto
      if (filters.description && filters.description.trim()) {
        filtered = filtered.filter(
          (product) =>
            typeof product.description === "string" &&
            product.description
              .toLowerCase()
              .includes(filters.description.toLowerCase())
        );
      }

      // Filtro para la categoria
      if (filters.category && filters.category.trim()) {
        filtered = filtered.filter(
          (product) =>
            typeof product.category === "string" &&
            product.category
              .toLowerCase()
              .includes(filters.category.toLowerCase())
        );
      }

      // Filtro para el precio minimo
      if (!isNaN(parseFloat(filters.minPrice))) {
        filtered = filtered.filter(
          (product) =>
            typeof product.price === "number" &&
            product.price >= parseFloat(filters.minPrice)
        );
      }

      // Filtro para el precio maximo
      if (!isNaN(parseFloat(filters.maxPrice))) {
        filtered = filtered.filter(
          (product) =>
            typeof product.price === "number" &&
            product.price <= parseFloat(filters.maxPrice)
        );
      }

      console.log("Productos después de aplicar filtros: ", filtered);
      setFilterProducts(filtered);
      setCurrentPage(1);  // Reiniciar paginacion si se aplican nuevos filtros
    };

    // Aplicar filtros solo cuando los productos esten cargados
    if (!loading && products.length > 0) {
      applyFilters();
    }
  }, [filters, products, loading]);

  // Resetea los filtros a sus valores iniciales
  const resetFilters = () => {
    setFilters({
      description: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    setFilterProducts(products);
  };

  //==========================================================================
  //                    FUNCION PARA ELIMINAR UN PRODUCTO
  //==========================================================================

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="p-2 bg-[#FFF9C4] text-md rounded text-black w-[280px]">
          <p className="text-sm">
            ¿Estás seguro de que deseas eliminar este producto?
          </p>
          <div className="mt-3 flex justify-center text-center gap-2">
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(
                    `http://localhost:5000/api/admin/products/${id}`,
                    {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  if (!res.ok) throw new Error("Error al eliminar");

                  setProducts((prev) => prev.filter((p) => p?._id !== id));
                  setFilterProducts((prev) => prev.filter((p) => p?._id !== id));

                  toast.dismiss(t.id);
                  toast.success("Producto eliminado correctamente");
                } catch (err) {
                  toast.dismiss(t.id);
                  toast.error("Error al eliminar el producto");
                }
              }}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Sí
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-white text-black px-3 py-1 rounded hover:bg-gray-300"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: Infinity } // No se cierra automaticamente, queda abierto hasta que el admin responda
    );
  };

  // ==========================================================================
  //                          LÓGICA DE PAGINACIÓN
  // ==========================================================================

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const currentProducts = filterProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filterProducts.length / productPerPage);

  // ==========================================================================
  //                       RENDERIZADO CONDICIONAL
  // ==========================================================================

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;
  console.log("Productos actuales en la página: ", currentProducts);

  
  // ==========================================================================
  //                     RENDER FINAL DEL COMPONENTE
  // ==========================================================================
  
  return (
    <div className="m-20 sm:m-10 bg-white rounded-lg shadow-md p-6">
      <div className="bg-gradient-to-r from-[#25396f] to-[#1d2951] text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold text-center">Filtrar productos</h2>
      </div>
      <div className="p-6 bg-white rounded-b-lg">
        <form className="space-y-4">
          {[
            {
              label: "Descripcion",
              key: "description",
              type: "text",
              placeholder: "Ejemplo: Camiseta Negra",
            },
            {
              label: "Categoría",
              key: "category",
              type: "text",
              placeholder: "Ejemplo: Accesorios",
            },
            {
              label: "Precio Mínimo",
              key: "minPrice",
              type: "number",
              placeholder: "Ejemplo: 100",
            },
            {
              label: "Precio Máximo",
              key: "maxPrice",
              type: "number",
              placeholder: "Ejemplo: 500",
            },
          ].map((field) => (
            <div key={field.key} className="flex items-center space-x-4">
              <label className="w-1/5 text-sm font-medium text-[#25396f]">
                {field.label}:
              </label>
              <div className="relative w-1/3">
                <input
                  type={field.type}
                  value={filters[field.key]}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    setFilters({ ...filters, [field.key]: e.target.value })
                  }
                  className="w-full pl-3 pr-4 py-2 text-sm border-b-2 border-gray-300 bg-transparent outline-none focus:border-indigo-500 transition-all text-[#25396f] placeholder-gray-400"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 bg-[#25396f] text-white font-semibold rounded-md hover:bg-[#1d2951] transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        </form>
      </div>

      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-[#25396f]">
          <thead className="text-xs text-[#25396f] uppercase bg-gray-200">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3">
                Descripción
              </th>
              <th scope="col" className="px-6 py-3">
                Categoría
              </th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                Subcategoría
              </th>
              <th scope="col" className="px-6 py-3">
                Precio
              </th>
              <th scope="col" className="px-6 py-3">
                Precio Oferta
              </th>
              <th scope="col" className="px-6 py-3">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                Imagen
              </th>
              <th scope="col" className="px-6 py-3">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr
                  className="bg-white border-b hover:bg-gray-50"
                  key={product._id}
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#25396f] whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">{product.description}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    {product.subcategory}
                  </td>

                  <td className="px-6 py-4">
                    {typeof product.price === "number"
                      ? `$${product.price.toLocaleString("es-AR")}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {typeof product.offerPrice === "number"
                      ? `$${product.offerPrice.toLocaleString("es-AR")}`
                      : "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    {product.variants && product.variants.length > 0 ? (
                      <>
                        <span className="font-semibold">
                          {product.variants.reduce(
                            (acc, v) => acc + v.stock,
                            0
                          )}{" "}
                          unidades
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {product.variants.map((variant, index) => (
                            <span key={index}>
                              {variant.size}: {variant.stock}
                              {index < product.variants.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <span className="font-semibold text-gray-700">
                        {product.stock !== undefined
                          ? `${product.stock} unidades`
                          : "Sin stock"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <img
                      src={
                        product.imageUrl && product.imageUrl.trim() !== ""
                          ? product.imageUrl
                          : "../images/product-generic.png"
                      }
                      alt={product.name || "Imagen predeterminada"}
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product._id}`)
                      }
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-[#25396f]">
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <nav
          aria-label="Page navigation example"
          className=" p-4 bg-white rounded-b-lg"
        >
          <ul className="inline-flex -space-x-px text-sm text-gray-800 dark:text-gray-200">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li key={i}>
                <button
                  onClick={() => paginate(i + 1)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${
                    currentPage === i + 1
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-500 bg-white"
                  } border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProductList;
