import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/api';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.email);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f0f2ff' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '360px' }}>
        <h2 style={{ textAlign: 'center', color: '#1e1b4b', marginBottom: '8px' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
          Join VeriSkill today
        </p>
        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px',
          borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', key: 'fullName', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Password', key: 'password', type: 'password' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input type={type} style={inputStyle} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })} required />
            </div>
          ))}
          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
          Already have an account? <Link to="/login" style={{ color: '#4f46e5' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', color: '#374151',
  marginBottom: '4px', marginTop: '14px', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '11px', background: '#4f46e5', color: '#fff',
  border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
  cursor: 'pointer', marginTop: '20px' };