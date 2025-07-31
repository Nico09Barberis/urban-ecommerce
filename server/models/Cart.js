const mongoose = require('mongoose'); // Importación de Mongoose, una librería para interactuar con MongoDB

const CartSchema = new mongoose.Schema({
  userId: {
    type: String, // ID del usuario al que pertenece el carrito
    required: true, 
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Referencia al modelo Product 
      }, 
      quantity: { 
        type: Number, 
        required: true, 
        default: 1,
      }, // Cantidad del producto (valor predeterminado: 1)
      size: {
        type: String,
        required: function() {
          // El tamaño solo es requerido si el producto tiene variantes
          return this.productId && this.productId.variants && this.productId.variants.length > 0;
        },
      },
    },
  ],
});

// Creación del modelo Favorite basado en el esquema definido
const CartModel = mongoose.model("Cart", CartSchema);

// Exportación del modelo Favorite para su uso en otras partes de la aplicación
module.exports = CartModel;

