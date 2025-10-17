import React, { useState } from 'react';
// import './LoginPage.css';

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api';

export default function LoginPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { name, email, password };
      let res, data;
      try {
        res = await fetch(API_BASE + url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        data = await res.json();
      } catch (err) {
        setError('Server unavailable. Please try again later.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        if (!isLogin && res.status === 409) {
          setError('Email already registered. Please login.');
        } else if (isLogin && res.status === 401) {
          setError('Invalid credentials.');
        } else {
          setError(data.error || 'Auth failed');
        }
        setLoading(false);
        return;
      }
      onAuth(data.token, data.user);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <form className="bg-gray-900 rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-md w-full text-white" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <div className="flex flex-col gap-4 mb-5">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>
        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <button 
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>
        <div className="mt-6 text-center text-gray-400">
          {isLogin ? (
            <span>Don&apos;t have an account? <button type="button" className="text-purple-400 font-semibold underline hover:text-white transition ml-1" onClick={() => setIsLogin(false)}>Register</button></span>
          ) : (
            <span>Already have an account? <button type="button" className="text-purple-400 font-semibold underline hover:text-white transition ml-1" onClick={() => setIsLogin(true)}>Login</button></span>
          )}
        </div>
      </form>
    </div>
  );
}
