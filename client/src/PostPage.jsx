import React, { useEffect, useState } from 'react';
import Comments from './Comments';

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api';

export default function PostPage({ token, user, onLogout }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(API_BASE + '/post');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load post');
        setPost(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8 bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-white">Commenting Platform</h1>
          {user && (
            <p className="text-sm text-gray-400 mt-1">
              Welcome, <span className="text-purple-400 font-semibold">{user.name}</span>
              {user.isAdmin && <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">Admin</span>}
            </p>
          )}
        </div>
        <button 
          className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-8 mb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <div className="text-gray-400">Loading post...</div>
          </div>
        ) : error ? (
          <p className="bg-red-900/50 border-l-4 border-red-500 text-red-200 px-4 py-3 rounded">{error}</p>
        ) : post && (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">{post.title}</h2>
            <p className="text-gray-300 leading-relaxed">{post.content}</p>
            {post.image && (
              <img 
                src={post.image} 
                alt="Post" 
                className="max-w-full rounded-lg mt-4 shadow-lg"
              />
            )}
          </>
        )}
      </div>
      {post && <Comments postId={post._id} token={token} user={user} />}
    </div>
  );
}
