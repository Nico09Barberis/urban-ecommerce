import React from "react"; // Importación de React para la creación de componentes
import { useState } from "react"; // Importación de useState para gestionar el estado del formulario
import axios from "axios"; // Importación de Axios para hacer solicitudes HTTP
import { toast } from "react-hot-toast";

const AddProductForm = () => {
  // Lista de categorias con sus respectivas subcategorias
  const categories = [
    {
      name: "Ropa de Hombre",
      subcategories: [
        "Camisas",
        "Polos",
        "Camisetas",
        "Hoodies",
        "Parkas",
        "Pantalones",
        "Jeans",
        "Bermudas",
        "Ropa Interior",
      ],
    },
    {
      name: "Ropa de Mujer",
      subcategories: [
        "Camisas",
        "Hoodies",
        "Camisetas",
        "Jeans",
        "Parkas",
        "Bermudas",
        "Pantalones",
      ],
    },
    {
      name: "Ropa de Niños",
      subcategories: [
        "Camisas",
        "Vestidos",
        "Pantalones",
        "Abrigos",
        "Zapatos",
        "Juguetes",
      ],
    },
    {
      name: "Accesorios",
      subcategories: [
        "Sombreros",
        "Gorras",
        "Bufandas",
        "Medias",
        "Relojes",
        "Bolsos",
        "Joyeria",
      ],
    },
    {
      name: "Calzado",
      subcategories: [
        "Vans", 
        "Converse", 
        "New Balance", 
        "DC Shoes"],
    },
  ];


  const categoriesWithVariants = ["Ropa de Hombre", "Ropa de Mujer", "Ropa de Niños", "Calzado"];  // Categorias que necesitan variantes

  const [formData, setFormData] = useState({
    name: "", // Nombre del producto
    description: "", // Descripción del producto
    price: "", // Precio original
    offerPrice: "", // Precio de oferta
    category: "", // Categoría del producto
    subcategory: "", // Subcategoría del producto
    stock: "",
    imageUrl: "", // URL de la imagen del producto
  });

  const [variants, setVariants] = useState([
    { size: "", stock: "" }, // Al menos una variante por defecto
  ]);

  const [error, setError] = useState(""); // Estado para manejar errores
  const [imageFile, setImageFile] = useState(null); // Estado para almacenar la imagen subida
  const [filteredSubCategories, setFilterSubCategories] = useState([]); // Estado para subcategorías filtradas según la categoría seleccionada

  const needsVariants = categoriesWithVariants.includes(formData.category);

  //=================================================================================
  //              MANEJO DE CAMBIOS EN LOS INPUTS DEL FORMULARIO
  //=================================================================================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat.name === value);
      setFilterSubCategories(
        selectedCategory ? selectedCategory.subcategories : []
      );
      setFormData({ ...formData, category: value, subcategory: "" });

      if (categoriesWithVariants.includes(value)) {
        // Si la nueva categoría necesita variantes, reseteamos stock simple
        setFormData((prev) => ({ ...prev, stock: "" }));
        setVariants([{ size: "", stock: "" }]);
      } else {
        // Si no necesita variantes (accesorios), reseteamos variantes
        setVariants([]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //=================================================================================
  //              MANEJO DE CAMBIOS EN LAS VARIANTES (SIZE O STOCK)
  //=================================================================================

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    updatedVariants[index][name] = value;
    setVariants(updatedVariants);
  };

  // Añadir nueva variante
  const addVariant = () => {
    setVariants([...variants, { size: "", stock: "" }]);
  };

  // Eliminar variante
  const removeVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  // Manejo de cambios en la selección de imagen
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  //=================================================================================
  //                      FUNCION PARA SUBIR IMAGEN A ImgBB
  //=================================================================================
  
  const uploadImageToImgBB = async () => {
    const apiKey = "dd7aa4cb621255777d5712296d3bd702"; // API Key de ImgBB
    const formData = new FormData();
    formData.append("key", apiKey);
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.data.url; // Devuelve la URL de la imagen subida
    } catch (error) {
      console.error("Error al subir la imagen: ", error);
      toast.error("Error al subir la imagen");
      return null;
    }
  };

  //=================================================================================
  //                 VALIDACIONES DE PRECIOS PARA LOS CAMPOS DEL FORM
  //=================================================================================

  const validatePrices = () => {
    const priceValue = parseFloat(formData.price);
    const offerPriceValue = parseFloat(formData.offerPrice);
  
    if (isNaN(priceValue) || priceValue < 0) {
      setError("El precio debe ser un número mayor o igual a 0");
      return false;
    }
  
    if (formData.offerPrice !== "") {
      if (isNaN(offerPriceValue) || offerPriceValue < 0) {
        setError("El precio de oferta debe ser un número mayor o igual a 0");
        return false;
      }
  
      if (offerPriceValue > priceValue) {
        setError("El precio de oferta no puede ser mayor que el precio original");
        return false;
      }
    }
  
    // Si todo está bien, limpiar el error
    setError("");
    return true;
  };

  //=================================================================================
  //                      MANEJO DEL ENVIO DEL FORMULARIO
  //=================================================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado");

    // Validación de longitud mínima
    if (formData.name.trim().length < 3 || formData.description.trim().length < 3) {
      toast.error("El nombre y la descripción deben tener al menos 3 caracteres.");
      return;
    }

    if (!validatePrices()) {
      return; // Detiene la ejecución si hay un error en precios
    }

    const token = localStorage.getItem("token"); // Obtiene el token de autenticación

    if (!token) {
      console.log("Token no disponible");
      toast("No tienes permiso para agregar productos");
      return;
    }

    console.log("token enviado en la solicitud: ", token);

    const imageUrl = await uploadImageToImgBB();
    if (!imageUrl) {
      return; // Detiene la ejecución si falla la subida de imagen
    }

    // Validación según tipo de producto
    if (needsVariants && variants.length === 0) {
      toast("Debes agregar al menos una variante (talle + stock)");
      return;
    }

    if (
      !needsVariants &&
      (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)
    ) {
      toast("Debes indicar un stock válido para este producto");
      return;
    }

    // Validación de variantes antes de enviar el formulario
    if (
      needsVariants &&
      variants.some((variant) => !variant.size || !variant.stock)
    ) {
      toast("Debes agregar al menos una variante (talle + stock) válida");
      return;
    }

    const productData = {
      ...formData,
      imageUrl,
      stock: needsVariants ? 0 : parseInt(formData.stock), // stock simple solo si no hay variantes
    };
    
    // Si hay variantes y son necesarias, las agregamos
    if (needsVariants) {
      productData.variants = variants;
    }
    

    try {
      const response = await fetch("http://localhost:5000/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token en la cabecera
        },
        body: JSON.stringify(productData), // Envía los datos del formulario en formato JSON
      });

      console.log("Token a enviar en Authorization:", token);

      const data = await response.json();
      console.log("Respuesta del servidor: ", data);

      if (response.ok) {
        toast.success("Producto agregado con éxito");
        // Resetea el formulario después de una inserción exitosa
        setFormData({
          name: "",
          description: "",
          price: "",
          offerPrice: "",
          category: "",
          subcategory: "",
          stock: "",
          imageUrl: "",
        });
        setImageFile(null);
        setVariants([{ size: "", stock: "" }]);
      } else {
        toast.error("Error al agregar el producto");
      }
    } catch (error) {
      console.error("Error en la solicitud: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md rounded-lg max-w-lg w-full"
      >
        <h1 className="text-center text-3xl font-bold uppercase text-[#25396f] mb-6">
          Cargar Producto
        </h1>

        {error && (
          <div className="text-red-600 mb-4 text-center font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {/* Inputs de texto principales */}
          {[
            {
              key: "name",
              type: "text",
              placeholder: "Nombre del Producto...",
            },
            {
              key: "description",
              type: "text",
              placeholder: "Breve Descripción...",
            },
            {
              key: "price",
              type: "number",
              placeholder: "Precio (Ejemplo: 500)",
            },
            {
              key: "offerPrice",
              type: "number",
              placeholder: "Precio Oferta (Ejemplo: 450)",
            },
          ].map((field) => (
            <input
              key={field.key}
              type={field.type}
              name={field.key}
              value={formData[field.key]}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="w-full p-3 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500"
            />
          ))}

          {/* Categoría */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500 cursor-pointer"
          >
            <option value="">Selecciona una Categoría</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Subcategoría */}
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="w-full p-3 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500 cursor-pointer"
            disabled={!formData.category}
          >
            <option value="">Selecciona una Subcategoría</option>
            {filteredSubCategories.map((subcat, index) => (
              <option key={index} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>

          <div>
            {needsVariants ? (
              <></> // Si la categoría tiene variantes, no mostramos el campo de stock simple
            ) : (
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="w-full p-3 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500"
              />
            )}
          </div>

          {/* Variants (Talle / Stock) */}
          <div>
            <h3 className="text-lg font-semibold text-[#25396f] mb-2">
              Variantes (Talle / Stock)
            </h3>
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  name="size"
                  placeholder="Talle (Ej: S, M, 39)"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="w-1/2 p-2 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500"
                  disabled={!needsVariants}
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="w-1/3 p-2 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500"
                  disabled={!needsVariants}
                />
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  disabled={!needsVariants}
                >
                  X
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className={`mt-2 px-3 py-1 rounded transition ${
              needsVariants
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
              disabled={!needsVariants}
            >
              + Agregar Variante
            </button>

            {!needsVariants && (
              <p className="text-sm text-gray-500 mt-1">
                Esta categoría no requiere variantes.
              </p>
            )}
          </div>

          {/* Imagen */}
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-[#25396f] text-white font-semibold rounded-lg shadow-md hover:bg-[#1d2951] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Agregar Producto
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
