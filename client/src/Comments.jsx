
import React, { useEffect, useState } from 'react';
// import './Comments.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function timeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return d.toLocaleDateString();
}

// Count total replies (nested)
function countReplies(comment) {
  if (!comment.children || comment.children.length === 0) return 0;
  return comment.children.reduce((acc, child) => acc + 1 + countReplies(child), 0);
}

function CommentItem({ comment, level, onReply, onUpvote, onDelete, onEdit, user, token }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const canDelete = user && (user.id === comment.user._id || user.isAdmin);
  const canEdit = user && user.id === comment.user._id;
  const replyCount = countReplies(comment);
  const isAuthor = user && user.id === comment.user._id;

  return (
    <div 
      className={`border-l-2 ${level === 0 ? 'border-purple-500' : 'border-gray-700'} pl-5 mb-3 transition-all ${collapsed ? 'opacity-60' : ''}`} 
      style={{ marginLeft: level * 28 }}
    >
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <img 
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-700" 
          src={comment.user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.user.name}`} 
          alt="avatar" 
        />
        <span className="font-semibold text-indigo-200">{comment.user.name}</span>
        {isAuthor && (
          <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">You</span>
        )}
        {user?.isAdmin && comment.user.isAdmin && (
          <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">Admin</span>
        )}
        <span className="text-sm text-gray-500">{timeAgo(comment.created_at)}</span>
        {comment.edited && (
          <span className="text-xs text-gray-600 italic">(edited)</span>
        )}
        {replyCount > 0 && (
          <span className="text-xs text-gray-500">• {replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
        )}
        <button 
          className="ml-auto px-2 py-0 text-gray-400 hover:bg-gray-800 rounded text-xl transition"
          onClick={() => setCollapsed(v => !v)}
        >
          {collapsed ? '+' : '-'}
        </button>
      </div>
      {!collapsed && (
        <>
          {isEditing ? (
            <form 
              className="mb-2" 
              onSubmit={e => { 
                e.preventDefault(); 
                onEdit(comment._id, editText); 
                setIsEditing(false); 
              }}
            >
              <textarea
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                value={editText}
                onChange={e => setEditText(e.target.value)}
                required
                autoFocus
                rows="3"
              />
              <div className="flex gap-2 mt-2">
                <button 
                  className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-sm font-semibold transition"
                  type="submit"
                >
                  Save
                </button>
                <button 
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition"
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.text);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-white text-base mb-2 leading-relaxed">{comment.text}</div>
          )}
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <button 
              className={`flex items-center gap-1 ${comment.upvoted ? 'text-purple-400' : 'text-gray-400'} hover:bg-gray-800 hover:text-white px-2 py-1 rounded transition disabled:text-gray-600 disabled:cursor-not-allowed`}
              onClick={() => onUpvote(comment._id)} 
              disabled={!token}
              title="Upvote"
            >
              ▲ {comment.upvotes}
            </button>
            <button 
              className="text-gray-400 hover:bg-gray-800 hover:text-white px-2 py-1 rounded transition disabled:text-gray-600 disabled:cursor-not-allowed"
              onClick={() => setShowReply(v => !v)} 
              disabled={!token}
            >
              💬 Reply
            </button>
            {canEdit && !isEditing && (
              <button 
                className="text-gray-400 hover:bg-gray-800 hover:text-white px-2 py-1 rounded transition"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit
              </button>
            )}
            {canDelete && (
              <button 
                className="text-red-400 hover:bg-red-900/30 hover:text-white px-2 py-1 rounded transition"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this comment?')) {
                    onDelete(comment._id);
                  }
                }}
              >
                🗑️ Delete
              </button>
            )}
          </div>
          {showReply && (
            <form 
              className="flex gap-2 mt-2" 
              onSubmit={e => { e.preventDefault(); onReply(comment._id, replyText, setReplyText, setShowReply); }}
            >
              <input
                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write a reply..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                required
                autoFocus
              />
              <button 
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-semibold transition"
                type="submit"
              >
                Send
              </button>
            </form>
          )}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-1">
              {comment.children.map(child => (
                <CommentItem key={child._id} comment={child} level={level + 1} onReply={onReply} onUpvote={onUpvote} onDelete={onDelete} onEdit={onEdit} user={user} token={token} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Comments({ postId, token, user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, popular, replies

  // Sort comments based on selected option
  const sortComments = (commentsList) => {
    const sorted = [...commentsList];
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'popular':
        return sorted.sort((a, b) => b.upvotes - a.upvotes);
      case 'replies':
        return sorted.sort((a, b) => countReplies(b) - countReplies(a));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  const sortedComments = sortComments(comments);
  const totalComments = comments.reduce((acc, c) => acc + 1 + countReplies(c), 0);

  async function fetchComments() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/comments/${postId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load comments');
      setComments(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchComments(); }, [postId]);

  async function handleReply(parentId, text, clear, close) {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text, parent: parentId })
      });
      if (!res.ok) throw new Error('Failed to reply');
      clear('');
      close(false);
      fetchComments();
    } catch {}
  }

  async function handleUpvote(id) {
    if (!token) return;
    await fetch(`${API_BASE}/comments/upvote/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchComments();
  }

  async function handleDelete(id) {
    if (!token) return;
    await fetch(`${API_BASE}/comments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchComments();
  }

  async function handleEdit(id, text) {
    if (!token || !text.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/comments/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Failed to edit');
      fetchComments();
    } catch (e) {
      alert('Failed to edit comment');
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!token || !newComment.trim()) return;
    await handleReply(null, newComment, setNewComment, () => {});
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Comments {totalComments > 0 && <span className="text-gray-500 text-lg ml-2">({totalComments})</span>}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select 
            className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Upvotes</option>
            <option value="replies">Most Replies</option>
          </select>
        </div>
      </div>
      <form className="flex gap-3 mb-6" onSubmit={handleAddComment}>
        <input
          className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-700 disabled:text-gray-500"
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          disabled={!token}
          required
        />
        <button 
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit" 
          disabled={!token}
        >
          Comment
        </button>
      </form>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <div className="text-gray-400">Loading comments...</div>
        </div>
      ) : error ? (
        <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 px-4 py-3 rounded">{error}</div>
      ) : (
        <div className="mt-2">
          {sortedComments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💭</div>
              <div className="text-gray-400 text-lg">No comments yet. Be the first to comment!</div>
            </div>
          ) : (
            sortedComments.map(c => (
              <CommentItem 
                key={c._id} 
                comment={c} 
                level={0} 
                onReply={handleReply} 
                onUpvote={handleUpvote} 
                onDelete={handleDelete} 
                onEdit={handleEdit}
                user={user} 
                token={token} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
