import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { validationResult } from 'express-validator';

// Función para crear un token
export const createToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

//===============================================================================
//                            REGISTRO DE USUARIO
//===============================================================================

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

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

    if (req.body.dni && req.body.dni.trim() !== "") {
      user.dni = req.body.dni.trim();
    }

    try {
      await user.save();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      return res.status(400).json({ message: 'Error al guardar el usuario', error });
    }

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
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

//===============================================================================
//                          INICIO DE SESION DE USUARIO
//===============================================================================

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    console.log('Buscando usuario por email: ', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    console.log('Hash de la contraseña almacenada: ', user.password);
    console.log('Verificando contraseña...');
    console.log('Contraseña ingresada por el usuario: ', password);

    const isMatch = await user.comparePassword(password);
    console.log('Resultado de la comparacion: ', isMatch);
    if (!isMatch) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const token = createToken(user);
    console.log('Token creado: ', token);
    res.status(200).json({
      token,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "",
        dni: user.dni || "",
        province: user.province || "",
        address: user.address || {},
      }
    });
  } catch (error) {
    console.log('Error en el login: ', error);
    res.status(500).json({ message: 'Error al iniciar sesion', error });
  }
};
