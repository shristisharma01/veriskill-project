import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.email);
      localStorage.setItem('role', res.data.role);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f0f2ff' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '360px' }}>
        <h2 style={{ textAlign: 'center', color: '#1e1b4b', marginBottom: '8px' }}>VeriSkill</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '28px', fontSize: '14px' }}>
          Sign in to your account
        </p>
        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px',
          borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input type="email" style={inputStyle} value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label style={labelStyle}>Password</label>
          <input type="password" style={inputStyle} value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
          No account? <Link to="/register" style={{ color: '#4f46e5' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', color: '#374151',
  marginBottom: '4px', marginTop: '14px', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' };
const btnStyle = { width: '100%', padding: '11px', background: '#4f46e5', color: '#fff',
  border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
  cursor: 'pointer', marginTop: '20px' };