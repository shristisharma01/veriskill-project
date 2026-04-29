import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 32px', background: '#1e1b4b', color: '#fff'
  },
  brand: { fontSize: '20px', fontWeight: '700', color: '#a5b4fc', textDecoration: 'none' },
  links: { display: 'flex', gap: '24px', alignItems: 'center' },
  link: { color: '#e0e7ff', textDecoration: 'none', fontSize: '14px' },
  logout: {
    background: '#ef4444', border: 'none', color: '#fff',
    padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  }
};

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>VeriSkill</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/resume" style={styles.link}>Resume Analyzer</Link>
        <Link to="/email" style={styles.link}>Email Analyzer</Link>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
}