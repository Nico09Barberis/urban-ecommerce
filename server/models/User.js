const mongoose = require('mongoose'); // Importación de Mongoose para modelar y trabajar con MongoDB
const bcrypt = require('bcryptjs'); // Librería bcrypt para encriptar y comparar contraseñas

// Definición del esquema para los usuarios
const userSchema = new mongoose.Schema({
  email: {
    type: String, // Correo electrónico del usuario
    required: true, 
    unique: true, // El correo debe ser único en la base de datos
  },
  password: {
    type: String, // Contraseña del usuario
    required: true, 
  },
  role: {
    type: String, // Rol del usuario (ejemplo: 'admin', 'user')
    default: 'user', // Valor predeterminado: 'user'
  },
  firstName: {
    type: String, // Nombre del usuario
    required: true, 
    minlength: 2, // Longitud mínima de 2 caracteres
  },
  lastName: {
    type: String, // Apellido del usuario
    required: true, 
    minlength: 2, // Longitud mínima de 2 caracteres
  },
  phone: {
    type: String, // Teléfono del usuario (opcional)
    required: false,
    match: /^\+?[1-9]\d{1,14}$/, // Validación del formato del número telefónico (E.164)
  },
  dni: {
    type: String, // Documento Nacional de Identidad (opcional)
    unique: true, // El DNI debe ser único
    sparse: true, // Permitir valores nulos y mantener unicidad
    default: undefined,
    match: /^[0-9]{7,8}$/, // Validación del formato (7 u 8 dígitos) 
  },
  province: {
    type: String, // Provincia del usuario (opcional)
    required: false,
  },

  // Dirección del usuario como un objeto anidado
  address: {
    street: {
      type: String, // Nombre de la calle
      required: false,
      minlength: 3, // Longitud mínima de 3 caracteres
      default: "N/A", // Valor predeterminado si no se proporciona
    },
    number: {
      type: String, // Número de la dirección
      required: false,
      match: /^[0-9]+$/, // Validación: solo números
    },
    department: {
      type: String, // Departamento o unidad (opcional)
      maxlength: 10, // Longitud máxima de 10 caracteres
    },
    floor: {
      type: String, // Piso de la dirección (opcional)
      maxlength: 5, // Longitud máxima de 5 caracteres
    },
    city: {
      type: String, // Ciudad de residencia
      required: false,
      minlength: 2, // Longitud mínima de 2 caracteres
      default: "N/A", // Valor predeterminado si no se proporciona
    },
    postalCode: {
      type: String, // Código postal
      required: false,
      match: /^[0-9]{4,6}$/, // Validación: entre 4 y 6 dígitos
    },
  },
}, { timestamps: true }); // Agrega automáticamente campos createdAt y updatedAt

// Middleware pre-guardado para encriptar la contraseña antes de almacenar el usuario
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next(); // Si la contraseña no ha cambiado, continúa sin encriptarla
  }
  try {
    const salt = await bcrypt.genSalt(10); // Genera un salt para la encriptación
    const hash = await bcrypt.hash(user.password, salt); // Encripta la contraseña
    user.password = hash; // Reemplaza la contraseña original con la encriptada
    next(); // Continúa con la operación de guardado
  } catch (error) {
    next(error); // Manejo de errores durante la encriptación
  }
});

// Método para comparar contraseñas ingresadas con la almacenada
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compara la contraseña ingresada con la encriptada
};

// Creación del modelo User a partir del esquema definido
const User = mongoose.model('User', userSchema);

// Exportación del modelo para usarlo en otras partes de la aplicación
module.exports = User;
