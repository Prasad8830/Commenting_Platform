import { Router } from 'express';
import { getComments, addComment, upvoteComment, deleteComment, updateComment } from '../controllers/comment.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/:postId', getComments);
router.post('/:postId', auth, addComment);
router.post('/upvote/:id', auth, upvoteComment);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

export default router;
