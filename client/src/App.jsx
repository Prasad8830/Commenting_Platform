import React, { useState } from 'react';
// import './App.css';
import LoginPage from './LoginPage';
import PostPage from './PostPage';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  if (!token) {
    return <LoginPage onAuth={(t, u) => { setToken(t); setUser(u); localStorage.setItem('token', t); }} />;
  }
  return <PostPage token={token} user={user} onLogout={() => { setToken(''); setUser(null); localStorage.removeItem('token'); }} />;
}
