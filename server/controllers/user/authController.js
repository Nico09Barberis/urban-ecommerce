// Importación de librerías y modelos necesarios
const jwt = require('jsonwebtoken'); // Librería para generar y verificar tokens JWT
const User = require('../../models/User'); // Modelo de usuario
const { validationResult } = require('express-validator'); // Middleware para validar datos enviados en la solicitud

// Función para crear un token
// Genera un token JWT basado en el ID del usuario y su rol con una expiración de 2 horas
const createToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

//===============================================================================
//                            REGISTRO DE USUARIO
//===============================================================================

const register = async (req, res) => {
  // Validar los datos de la solicitud utilizando express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Si hay errores, responder con un código 400 y los detalles
  }

  // Extraer los datos del cuerpo de la solicitud
  const { email, password, firstName, lastName } = req.body;

  try {
    // Verificar si ya existe un usuario con el correo proporcionado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' }); // Si existe, responder con un error 400
    }

    // Crear un nuevo usuario con los datos proporcionados y valores predeterminados
    const user = new User({ 
      email, 
      password, 
      firstName, 
      lastName,
      phone: "",
      province: "",
      address: {
        street: "default street",
        number: "",
        department: "",
        floor: "",
        city: "default city",
        postalCode: "",
      },
    });

    // Si el DNI está presente y válido, se agrega
    if (req.body.dni && req.body.dni.trim() !== "") {
        user.dni = req.body.dni.trim();
      }

    try { 
      await user.save(); // Guardar el usuario en la base de datos
    } catch (error) {
      console.error('Error al guardar el usuario:', error); // Manejo de errores al guardar
      return res.status(400).json({ message: 'Error al guardar el usuario', error });
    }
    
    // Crear y devolver el token junto con información del usuario
    const token = createToken(user);
    res.status(201).json({
      token,
      user: { 
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error }); // Manejo de errores generales del servidor
  }
};

//===============================================================================
//                          INICIO DE SESION DE USUARIO
//===============================================================================

const login = async (req, res) => {
  // Validar los datos de la solicitud utilizando express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Si hay errores, responder con un código 400 y los detalles
  }

  // Extraer los datos del cuerpo de la solicitud
  const { email, password } = req.body;

  try {
    // Buscar usuario en la base de datos por correo electrónico
    console.log('Buscando usuario por email: ', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales invalidas' }); // Si no se encuentra, devolver un error 401
    }

    console.log('Hash de la contraseña almacenada: ', user.password);

    // Verificar que la contraseña proporcionada coincida con la guardada
    console.log('Verificando contraseña...');
    console.log('Contraseña ingresada por el usuario: ', password);

    const isMatch = await user.comparePassword(password);
    console.log('Resultado de la comparacion: ', isMatch);
    if (!isMatch) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ message: 'Credenciales invalidas' }); // Si no coinciden, devolver un error 401
    }

    // Crear y devolver un token junto con información del usuario
    const token = createToken(user);
    console.log('Token creado: ', token);
    res.status(200).json({ 
      token, 
      user: { 
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "", // Devolver valores predeterminados si faltan
        dni: user.dni || "",
        province: user.province || "",
        address: user.address || {},
      }
    });
  } catch (error) {
    console.log('Error en el login: ', error);
    res.status(500).json({ message: 'Error al iniciar sesion', error }); // Manejo de errores generales del servidor
  }
};

// Exportar las funciones para ser utilizadas en otros módulos
module.exports = { register, login };
