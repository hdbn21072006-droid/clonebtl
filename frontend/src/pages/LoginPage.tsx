import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import './LoginPage.css';
import { loginSuccess } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err: any) {
      setError('Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Thư Viện PTIT</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <User size={20} />
            <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <Lock size={20} />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-btn">
            <LogIn size={20} /> Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;