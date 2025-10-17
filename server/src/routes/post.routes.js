import { Router } from 'express';
import { getPost, createDemoPost } from '../controllers/post.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', getPost);
router.post('/demo', createDemoPost); // for demo only

export default router;
