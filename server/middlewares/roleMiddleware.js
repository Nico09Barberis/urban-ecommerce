// Importación del paquete JWT para la generación y verificación de tokens
const jwt = require('jsonwebtoken');

//================================================================================
//           MIDDLEWARE PARA VERIFICAR SI EL TOKEN ES VALIDO
//================================================================================

// Este middleware valida la autenticidad del token JWT enviado en el header de autorización
const verifyToken = (req, res, next) => {
  console.log('verifyToken middleware ejecutado'); // Log para depurar la ejecución del middleware
  console.log(process.env.JWT_SECRET); // Log para verificar que la clave secreta esté configurada correctamente

  const authHeader = req.headers.authorization; // Obtener el header de autorización del cliente

  // Verificamos que el header de autorización esté presente y tenga el formato correcto ('Bearer token')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extraer el token eliminando el prefijo 'Bearer '
    const token = authHeader.split(' ')[1];
    console.log('Token recibido en el servidor: ', token); // Log para depurar el contenido del token

    // Verificar la validez del token utilizando la clave secreta almacenada en las variables de entorno
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Si hay un error en la verificación del token, respondemos con un error 403 (prohibido)
        return res.status(403).json({ msg: 'Token no válido' });
      }
      req.user = decoded; // Asignamos los datos decodificados del token (como userId y rol) al objeto req
      next(); // Continuamos con la ejecución de la siguiente función del middleware
    });
  } else {
    // Si el header no está presente o no tiene el formato correcto, respondemos con un error 401 (no autorizado)
    return res.status(401).json({ msg: 'Autenticación fallida, no se encontró el token' });
  }
};

//================================================================================
//           MIDDLEWARE PARA VERIFICAR SI EL USUARIO ES ADMINISTRADOR
//================================================================================

// Este middleware asegura que el usuario autenticado tiene el rol de 'admin' antes de continuar
const verifyAdmin = (req, res, next) => {
  console.log("rol del usuario: ", req.user.role); // Log para depurar el rol del usuario autenticado
  if (req.user.role !== 'admin') {
    // Si el rol no es 'admin', respondemos con un error 403 (prohibido)
    return res.status(403).json({ msg: 'Acceso restringido: se requiere rol de administrador' });
  }
  next(); // Si el rol es 'admin', continuamos con la ejecución de la siguiente función
};

// Exportacion los middlewares para utilizarlos en otras partes de la aplicación
module.exports = { verifyToken, verifyAdmin };
