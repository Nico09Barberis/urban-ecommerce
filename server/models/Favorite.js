const mongoose = require('mongoose'); // Importación de Mongoose, una librería para interactuar con MongoDB

const User = require('./User'); // Importación del modelo de usuario
const Product = require('./Product'); // Importación del modelo de producto

// Definición del esquema para los favoritos
const favoriteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Referencia al modelo User para identificar al usuario
    ref: "User", // Relación con el modelo User
    required: true, 
    unique: true, // Cada usuario tiene solo una lista de favoritos
  },
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, // Referencia al modelo Product para identificar el producto
        ref: "Product", // Relación con el modelo Product
        required: true, 
      },
      addedAt: { 
        type: Date, // Fecha en la que el producto fue agregado a favoritos
        default: Date.now // Valor predeterminado: fecha y hora actual
      }
    }
  ]
});

// Creación del modelo Favorite basado en el esquema definido
const Favorite = mongoose.model("Favorite", favoriteSchema);

// Exportación del modelo Favorite para su uso en otras partes de la aplicación
module.exports = Favorite;
