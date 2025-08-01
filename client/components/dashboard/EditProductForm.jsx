import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditProductForm = () => {
  // Lista de categorías con sus respectivas subcategorías
  const categories = [
    {
      name: "Ropa de Hombre",
      subcategories: ["Camisas", "Polos", "Camisetas", "Hoodies", "Parkas", "Pantalones", "Jeans", "Bermudas", "Ropa Interior"],
    },
    {
      name: "Ropa de Mujer",
      subcategories: ["Camisas", "Hoodies", "Camisetas", "Jeans", "Parkas", "Bermudas", "Pantalones"],
    },
    {
      name: "Ropa de Niños",
      subcategories: ["Camisas", "Vestidos", "Pantalones", "Abrigos", "Zapatos", "Juguetes"],
    },
    {
      name: "Accesorios",
      subcategories: ["Sombreros", "Gorras", "Bufandas", "Medias", "Relojes", "Bolsos", "Joyeria"],
    },
    {
      name: "Calzado",
      subcategories: ["Vans", "Converse", "New Balance", "DC Shoes"],
    },
  ];
  
  
  const categoriesWithVariants = ["Ropa de Hombre", "Ropa de Mujer", "Ropa de Niños", "Calzado"];  // Categorias que requieren variantes (talle y stock)
  const token = localStorage.getItem("token");
  const { id } = useParams();   // Obtener ID del producto desde la URL
  const navigate = useNavigate();   // Navegacion programatica

  // Estado del formulario del producto
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    category: "",
    subcategory: "",
    stock: "",
    imageUrl: "",
  });

  const [variants, setVariants] = useState([]);   // Variants del producto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);   // Imagen seleccionada para subir
  const [filteredSubCategories, setFilterSubCategories] = useState([]);   // Categorias filtradas dinamicamente segun la categoria seleccionada

  // Determinar si el producto necesita variantes
  const needsVariants = useMemo(
    () => categoriesWithVariants.includes(formData.category),
    [formData.category]
  );

  //====================================================================================
  //     CARGAR DATOS DEL PRODUCTO DESDE EL BACKEND CUANDO SE MONTA EL COMPONENTE
  //====================================================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/products/${id}`);
        const data = await response.json();

        // Establecer los valores del formulario con los datos obtenidos
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          offerPrice: data.offerPrice || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
          stock: data.stock || "",
          imageUrl: data.imageUrl || "",
        });
        
        // Cargar variantes si existen
        if (data.variants && data.variants.length > 0) {
          setVariants(data.variants);
        }

        // Filtrar subcategorias segun la categoria del producto
        const selectedCategory = categories.find((cat) => cat.name === data.category);
        if (selectedCategory) {
          setFilterSubCategories(selectedCategory.subcategories);
        } else {
          console.warn(`Categoría no encontrada: ${data.category}`);
          setFilterSubCategories([]);
        }
      } catch (error) {
        console.error("Error al obtener producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  //=====================================================================================
  //                    MANEJAR LOS CAMBIOS EN LOS INPUTS DEL FORMULARIO
  //=====================================================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat.name === value);

      // Validación explícita
      if (!selectedCategory) {
        toast.error("Categoría seleccionada no válida.");
        return;
      }
  
      setFilterSubCategories(selectedCategory.subcategories);

      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: "",
        ...(categoriesWithVariants.includes(value) && { stock: "" }),
      }));

      // Si la categoria requiere variantes, inicializar con una variante vacia
      if (categoriesWithVariants.includes(value)) {
        setVariants([{ size: "", stock: "" }]);
      } else {
        setVariants([]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ===========================================================================================
  //                MANEJAR CAMBIOS EN LOS CAMPOS DE UNA VARIANTE ESPECIFICA
  // ===========================================================================================

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    updatedVariants[index][name] = value;
    setVariants(updatedVariants);
  };

  // Agregar una nueva variante
  const addVariant = () => setVariants([...variants, { size: "", stock: "" }]);

  // Eliminar una variante
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

  // Manejar cambio de archivo de imagen
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Subir imagen a ImgBB y devolver la URL resultante
  const uploadImageToImgBB = async () => {
    const apiKey = "dd7aa4cb621255777d5712296d3bd702";
    const imageFormData = new FormData();
    imageFormData.append("key", apiKey);
    imageFormData.append("image", imageFile);

    try {
      const response = await axios.post("https://api.imgbb.com/1/upload", imageFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data.url;

    } catch (error) {
      console.error("Error al subir la imagen: ", error);
      toast.error("Error al subir la imagen");
      return null;
    }
  };

  // Validaciones de precios ingresados
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
  //========================================================================================
  //                  ENVIAR EL FORMULARIO PARA ACTUALIZAR EL PRODUCTO
  //========================================================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de longitud de caracteres
    if (formData.name.trim().length < 3 || formData.description.trim().length < 3) {
      toast.error("El nombre y la descripción deben tener al menos 3 caracteres");
      return;
    }

    if (!validatePrices()) return;

    // Verifica que el usuario este autenticado
    if (!token) {
      toast("No tienes permiso para editar productos");
      return;
    }

    // Subir imagen si se selecciono una nueva
    let imageUrl = formData.imageUrl;
    if (imageFile) {
      const uploadedImageUrl = await uploadImageToImgBB();
      if (!uploadedImageUrl) return;
      imageUrl = uploadedImageUrl;
    }

    // Validacion de variantes o stock segun la cateogoria
    if (needsVariants && variants.length === 0) {
      toast("Debes agregar al menos una variante (talle + stock)");
      return;
    }

    if (!needsVariants && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      toast("Debes indicar un stock válido para este producto");
      return;
    }

    if (
      needsVariants &&
      variants.some((variant) => !variant.size || isNaN(variant.stock) || parseInt(variant.stock) < 0)
    ) {
      toast("Debes agregar variantes con talle y stock válidos");
      return;
    }

    // Construccion del objeto actualizado
    const updatedProduct = {
      ...formData,
      imageUrl,
      stock: needsVariants ? 0 : parseInt(formData.stock) || 0,
      ...(needsVariants && { variants }),
    };

    // Enviar la solicitud PUT para actualizar el producto
    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        toast.success("Producto actualizado con éxito");
        navigate("/admin/products/list");
      } else {
        toast.error("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error en la solicitud: ", error);
    }
  };

  if (loading) return <p>Cargando producto...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md rounded-lg max-w-lg w-full"
      >
        <h2 className="text-center text-3xl uppercase font-bold text-[#25396f] mb-6">
          Editar Producto
        </h2>
  
        {error && (
          <div className="text-red-600 mb-4 text-center font-semibold">
            {error}
          </div>
        )}
  
        <div className="grid grid-cols-1 gap-4">
          {/* Campos básicos: nombre, descripción, precios */}
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
              placeholder: "Precio en Oferta (Ejemplo: 450)",
            },
          ].map((field) => (
            <input
              key={field.key}
              type={field.type}
              id={field.key}
              name={field.key}
              value={formData[field.key]}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="w-full p-3 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500"
            />
          ))}
  
          {/* Selector de categoría */}
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500"
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
  
          {/* Variantes si es necesario */}
          {needsVariants && (
            <div className="space-y-2">
              <span className="block text-sm text-[#25396f] font-medium">
                Variantes (Talla y Stock)
              </span>
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    name="size"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Talla (Ej: M)"
                    className=" flex-1 p-2 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    name="stock"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Stock"
                    className="w-24 p-2 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="border-2 px-2 py-1 border-black text-[#25396f] font-medium hover:bg-gray-200"
              >
                + Agregar Variante
              </button>
            </div>
          )}

          {!needsVariants && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500 cursor-pointer"
                min="0"
              />
            </div>
          )}

          {/* Imagen actual y nueva imagen */}
          {formData.imageUrl && (
            <div className="mb-2">
              <span className="block text-sm text-[#25396f] font-medium mb-1">
                Imagen actual:
              </span>
              <img
                src={formData.imageUrl}
                alt="Producto actual"
                className="h-32 object-contain rounded border border-gray-300"
              />
            </div>
          )}
  
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 bg-gray-200 border-b-2 border-gray-500 text-[#25396f] placeholder-gray-500 cursor-pointer"
          />
        </div>
  
        <button
          type="submit"
          className="w-full mt-6 py-3 bg-[#25396f] text-white font-semibold rounded-lg shadow-md hover:bg-[#1d2951] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};  
  
export default EditProductForm;
