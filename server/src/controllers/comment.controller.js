import Comment from '../models/Comment.js';
import User from '../models/User.js';

// Helper: build nested comment tree
function buildTree(comments) {
  const map = {};
  comments.forEach(c => (map[c._id] = { ...c._doc, children: [] }));
  const roots = [];
  comments.forEach(c => {
    if (c.parent) {
      map[c.parent]?.children.push(map[c._id]);
    } else {
      roots.push(map[c._id]);
    }
  });
  return roots;
}

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate('user', 'name avatar isAdmin')
      .sort({ created_at: 1 });
    res.json(buildTree(comments));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, parent } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    const comment = await Comment.create({
      post: postId,
      user: req.user.id,
      text,
      parent: parent || null
    });
    await comment.populate('user', 'name avatar isAdmin');
    res.status(201).json(comment);
  } catch (e) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const upvoteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (e) {
    res.status(500).json({ error: 'Failed to upvote comment' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (String(comment.user) !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Comment.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (String(comment.user) !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    comment.text = text;
    comment.edited = true;
    await comment.save();
    await comment.populate('user', 'name avatar isAdmin');
    res.json(comment);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
};
