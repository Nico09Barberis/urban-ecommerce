const mongoose = require('mongoose'); // Importación de Mongoose, una librería para modelar y trabajar con datos en MongoDB

// Definicion del esquema para variantes y talles
const variantSchema = new mongoose.Schema({
  size: {
    type: mongoose.Schema.Types.Mixed, // puede ser numero (39, 40) o un string (S, M, L)
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false }); 

// Definición del esquema para los productos
const productSchema = new mongoose.Schema({
  name: {
    type: String, // Nombre del producto
    required: true, 
  },
  description: {
    type: String, // Descripción del producto
    required: true, 
  },
  price: {
    type: Number, // Precio del producto
    required: true, 
  },
  offerPrice: {
    type: Number, // Precio de oferta del producto (opcional)
  },
  category: {
    type: String, // Categoría general del producto
    required: true, 
    enum: ['Ropa de Hombre', 'Ropa de Mujer', 'Ropa de Niños', 'Accesorios', 'Calzado'], // Lista de categorías válidas
  },
  subcategory: {
    type: String, // Subcategoría específica del producto
    required: true, 
    enum: [
      // Lista de subcategorías válidas dentro de cada categoría
      'Camisas', 'Polos', 'Camisetas', 'Chaquetas', 'Hoodies', "Parkas",
      'Pantalones', 'Jeans', 'Shorts', 'Bermudas', 'Ropa Interior', 'Calzoncillos',
      'Camisas', 'Polos', 'Pantalones', 'Medias','Sombreros', 'Gorras', 'Bufandas', 
      'Relojes', 'Bolsos', 'Joyeria', 'Vans', 'Converse', 'New Balance', 'DC Shoes'
      // Más subcategorías pueden ser agregadas según sea necesario
    ]
  },
  stock: { 
    type: Number, 
    default: 0, 
    min: [0, 'El stock no puede ser negativo']
  }, // Para productos SIN variantes
  variants: { 
    type: [variantSchema],
    default: undefined,
    validate: {
      validator: function(val) {
        // Si variants existe (no undefined), debe tener al menos 1 elemento
        return !val || val.length > 0;
      },
      message: 'Si se definen variantes, debe haber al menos una (talle y stock).'
    }
  },
  imageUrl: {
    type: String, // URL de la imagen del producto (opcional)
  }
}, { timestamps: true });


// Creación del modelo Product a partir del esquema definido
const Product = mongoose.model('Product', productSchema);

// Exportación del modelo para usarlo en otras partes de la aplicación
module.exports = Product;
