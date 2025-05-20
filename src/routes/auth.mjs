import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import UserSchema from '../models/user.mjs';
import authenticateToken from '../middleware/auth.mjs';
import { validateLogin, validateRegister } from '../middleware/validators.mjs';

dotenv.config();

const AuthRoutes = (connect) => {
  const router = express.Router();
  const User = connect.model('User', UserSchema);

  router.post('/register', validateRegister, async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    await user.save();
    return res.status(201).json({ message: 'User created succesfully' });
  });

  router.post('/login', validateLogin, async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Wrong ID' });
    }

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Wrong ID' });
    }

    const token = jwt.sign({ name: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  });

  router.get('/secure-data', authenticateToken, (req, res) => res.json({ message: `Welcome ${req.user.name}` }));

  return router;
};

export default AuthRoutes;
