const mongoose = require('mongoose'); // Importación de Mongoose, una librería para interactuar con MongoDB

// Definición del esquema para las órdenes
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al modelo User para identificar al usuario que hizo la orden
    ref: 'User', // Relación con el modelo User
    required: true, // Campo obligatorio
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, // Referencia al modelo Product para identificar el producto
        ref: 'Product', // Relación con el modelo Product
        required: true, // Campo obligatorio
      },
      quantity: { type: Number, required: true }, // Cantidad del producto en la orden
      price: { type: Number, required: true }, // Precio del producto en la orden
      selectedSize: { type: String, required: false }, // Agregado dentro de cada item para el talle seleccionado
    }
  ],
  total: { 
    type: Number, // Monto total de la orden
    required: true, // Campo obligatorio
  },
  status: {  
    type: String, // Estado de la orden (por ejemplo, Pendiente, Enviado, Completado)
    default: 'Pendiente', // Valor predeterminado al crear la orden
  },
  PaymentMethod: { 
    type: String, // Método de pago utilizado (por ejemplo, efectivo, tarjeta)
  },
}, { timestamps: true }); // Configuración para agregar automáticamente campos createdAt y updatedAt

// Exportación del modelo Order para usarlo en otras partes de la aplicación
module.exports = mongoose.model('Order', OrderSchema);
