import mongoose from 'mongoose'; // Importar mongoose con sintaxis ES Modules
import bcrypt from 'bcryptjs';   // Importar bcrypt

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  firstName: {
    type: String,
    required: true,
    minlength: 2,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
  },
  phone: {
    type: String,
    required: false,
    match: /^\+?[1-9]\d{1,14}$/,
  },
  dni: {
    type: String,
    unique: true,
    sparse: true,
    default: undefined,
    match: /^[0-9]{7,8}$/,
  },
  province: {
    type: String,
    required: false,
  },
  address: {
    street: {
      type: String,
      required: false,
      minlength: 3,
      default: "N/A",
    },
    number: {
      type: String,
      required: false,
      match: /^[0-9]+$/,
    },
    department: {
      type: String,
      maxlength: 10,
    },
    floor: {
      type: String,
      maxlength: 5,
    },
    city: {
      type: String,
      required: false,
      minlength: 2,
      default: "N/A",
    },
    postalCode: {
      type: String,
      required: false,
      match: /^[0-9]{4,6}$/,
    },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
