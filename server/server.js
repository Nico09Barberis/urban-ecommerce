import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Importación de rutas (AJUSTADAS si las escribiste en CommonJS, también deberías convertirlas a ES Modules)
import authRoutes from './routes/user/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Test route
app.get('/', (req, res) => {
  res.send('Backend corriendo...');
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error en la conexión:', err));

// Rutas
app.use('/api/auth', authRoutes);
/*app.use('/api/admin', adminRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/sales', salesRoutes);
app.use('/api/admin/users', registeredUsersRoutes);
app.use('/api/admin/notifications', notificationsRoutes);
app.use('/api/user', authRoutes);
app.use('/api/products', userProductRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/home', homeRoutes);
*/

// Inicialización
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
