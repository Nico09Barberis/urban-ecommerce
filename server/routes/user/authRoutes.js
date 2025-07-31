const express = require('express'); 
const jwt = require('jsonwebtoken'); // Librería para generar y verificar tokens JWT
const { body, validationResult, check } = require('express-validator'); // Middleware para validar datos enviados en las solicitudes
const User = require('../models/User'); 
const router = express.Router(); 
const { register, login } = require('../controllers/authController'); // Importación de los controladores de autenticación
const { verifyToken } = require('../middlewares/roleMiddleware'); // Middleware para verificar autenticación

//==============================================================================
//                            RUTA PARA EL REGISTRO
//==============================================================================

// Permite crear un nuevo usuario, validando datos como el correo y la contraseña
router.post(
  '/register',
  [
    check('email')
      .isEmail()
      .withMessage('Por favor, ingresa un correo electrónico válido'),
    
    check('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    
    check('firstName')
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),

    check('lastName')
      .notEmpty()
      .withMessage('El apellido es obligatorio')
      .isLength({ min: 2 })
      .withMessage('El apellido debe tener al menos 2 caracteres'),
  ],
  register
);

//=====================================================================
//                        RUTA PARA INICIO DE SESION
//=====================================================================

// Permite que un usuario existente inicie sesión proporcionando correo y contraseña válidos
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Por ingresa un correo electronico valido'), // Validación de formato de email
    check('password').not().isEmpty().withMessage('La contraseña es obligatoria') // Verifica que la contraseña no esté vacía
  ], 
  login // Llama al controlador de inicio de sesión
);

//=====================================================================
//                RUTA PARA OBTENER LOS DATOS DEL USUARIO
//=====================================================================

// Protegida mediante verifyToken; retorna información del perfil del usuario
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Busca el usuario por su ID obtenido del token
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Manejo de error si el usuario no existe
    }
    res.json({
      firstName: user.firstName, // Retorna el nombre
      lastName: user.lastName,  // Retorna el apellido
      email: user.email,        // Retorna el correo electrónico
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error }); // Manejo de errores generales
  }
});

//=====================================================================
//              RUTA PARA ACTUALIZAR LOS DATOS DEL USUARIO
//=====================================================================

// Protegida mediante verifyToken; permite editar información del usuario
router.put('/update', verifyToken, async (req, res) => {
  const { firstName, lastName, email, dni, phone, province } = req.body; // Datos enviados en la solicitud
  try {
    const user = await User.findById(req.user.userId); // Busca el usuario por su ID obtenido del token
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Manejo de error si el usuario no existe
    }

    // Actualización de datos, usando valores enviados o manteniendo los actuales
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.dni = dni || user.dni;
    user.phone = phone || user.phone;
    user.province = province || user.province;

    await user.save(); // Guarda los cambios en la base de datos

    res.status(200).json({ message: 'Datos actualizados con éxito' }); // Respuesta exitosa
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error }); // Manejo de errores generales
  }
});

//=====================================================================
//              RUTA PARA OBTENER LA DIRECCION DEL USUARIO
//=====================================================================

// Protegida mediante verifyToken; retorna la dirección completa del usuario
router.get('/address', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Obtiene el ID del usuario desde el token
    const user = await User.findById(userId); // Busca el usuario en la base de datos

    if (!user || !user.address) {
      return res.status(404).json({ message: 'Dirección no encontrada.' }); // Manejo de error si la dirección no existe
    }

    res.status(200).json({ address: user.address }); // Retorna el objeto de dirección completo
  } catch (error) {
    console.error('Error al obtener la dirección:', error); // Log de errores
    res.status(500).json({ message: 'Error del servidor.', error }); // Manejo de errores generales
  }
});

//=====================================================================
//              RUTA PARA ACTUALIZAR LA DIRECCION DEL USUARIO
//=====================================================================

// Protegida mediante verifyToken; valida los datos antes de actualizar la dirección
router.put('/update-address', verifyToken, async (req, res) => {
  const { street, number, department, floor, city, postalCode } = req.body; // Datos enviados en la solicitud
  try {
    const user = await User.findById(req.user.userId); // Busca el usuario por su ID obtenido del token
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' }); // Manejo de error si el usuario no existe
    }

    // Validaciones opcionales para los datos
    if (street && street.length < 3) {
      return res.status(400).json({ message: 'La calle debe tener al menos 3 caracteres.' });
    }
    if (number && !/^[0-9]+$/.test(number)) {
      return res.status(400).json({ message: 'El número debe ser un valor numérico.' });
    }
    if (postalCode && !/^[0-9]{4,6}$/.test(postalCode)) {
      return res.status(400).json({ message: 'El código postal debe ser un número entre 4 y 6 dígitos.' });
    }

    // Actualización de campos de la dirección
    user.address.street = street || user.address.street;
    user.address.number = number || user.address.number;
    user.address.department = department || user.address.department;
    user.address.floor = floor || user.address.floor;
    user.address.city = city || user.address.city;
    user.address.postalCode = postalCode || user.address.postalCode;

    await user.save(); // Guarda los cambios en la base de datos

    res.status(200).json({ message: 'Dirección actualizada con éxito.', address: user.address }); // Respuesta exitosa con la dirección actualizada
  } catch (error) {
    console.error('Error al actualizar la dirección:', error); // Log de errores
    res.status(500).json({ message: 'Error del servidor.', error }); // Manejo de errores generales
  }
});


module.exports = router; // Exporta el router para usarlo en otros módulos de la aplicación
