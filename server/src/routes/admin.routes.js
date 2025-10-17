import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Secure make-admin endpoint: only works when server is started with ADMIN_SECRET set
const ADMIN_SECRET = process.env.ADMIN_SECRET || null;

router.post('/make-admin', async (req, res) => {
  try {
    // If ADMIN_SECRET isn't configured the endpoint is disabled (safe-by-default)
    if (!ADMIN_SECRET) {
      return res.status(403).json({ error: 'Admin endpoint disabled. Set ADMIN_SECRET in server/.env to enable.' });
    }

    const { email, secret } = req.body;
    if (!secret || secret !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid secret' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ 
      message: 'User is now an admin!', 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        isAdmin: user.isAdmin 
      } 
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to make admin' });
  }
});

export default router;
