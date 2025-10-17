import Post from '../models/Post.js';

export const getPost = async (req, res) => {
  try {
    // For demo, return the first post
    const post = await Post.findOne();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const createDemoPost = async (req, res) => {
  try {
    const exists = await Post.findOne();
    if (exists) return res.json(exists);
    const post = await Post.create({
      title: 'Welcome to the Nested Commenting Platform!',
      content: 'This is a demo post. Add comments below to start a discussion.',
      image: ''
    });
    res.status(201).json(post);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};
