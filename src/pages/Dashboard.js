import React, { useEffect, useState } from 'react';
import { getResumeHistory } from '../api/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || 'User';

  useEffect(() => {
    getResumeHistory().then(r => setHistory(r.data)).catch(() => {});
  }, []);

  const total = history.length;
  const highRisk = history.filter(h => h.riskLevel === 'HIGH').length;
  const avgScore = history.length
    ? (history.reduce((s, h) => s + (h.credibilityScore || 0), 0) / history.length * 100).toFixed(0)
    : 0;

  const chartData = [
    { name: 'Low Risk', count: history.filter(h => h.riskLevel === 'LOW').length, color: '#16a34a' },
    { name: 'Medium Risk', count: history.filter(h => h.riskLevel === 'MEDIUM').length, color: '#d97706' },
    { name: 'High Risk', count: history.filter(h => h.riskLevel === 'HIGH').length, color: '#dc2626' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 24px' }}>
      <h2 style={{ color: '#1e1b4b', marginBottom: '4px' }}>Welcome back 👋</h2>
      <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '14px' }}>{email}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Analyses', value: total, color: '#4f46e5' },
          { label: 'High Risk Detected', value: highRisk, color: '#dc2626' },
          { label: 'Avg Credibility', value: `${avgScore}%`, color: '#16a34a' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: '12px', padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px', fontWeight: '500' }}>{label}</p>
            <p style={{ fontSize: '36px', fontWeight: '700', color, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1e1b4b', marginBottom: '16px', fontSize: '16px' }}>Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1e1b4b', marginBottom: '16px', fontSize: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => navigate('/resume')} style={actionBtn('#4f46e5')}>
              Analyze a Resume
            </button>
            <button onClick={() => navigate('/email')} style={actionBtn('#7c3aed')}>
              Scan an Email
            </button>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1e1b4b', marginBottom: '16px', fontSize: '16px' }}>Recent Analyses</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                {['Type', 'Score', 'Risk', 'Date'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left',
                    color: '#9ca3af', fontWeight: '500', fontSize: '12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 6).map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px',
                      background: r.type === 'RESUME' ? '#ede9fe' : '#e0f2fe',
                      color: r.type === 'RESUME' ? '#5b21b6' : '#0369a1' }}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: '600', color: '#1f2937' }}>
                    {r.credibilityScore ? `${(r.credibilityScore * 100).toFixed(0)}%` : 'N/A'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '12px',
                      fontWeight: '600',
                      background: { LOW: '#f0fdf4', MEDIUM: '#fffbeb', HIGH: '#fef2f2' }[r.riskLevel],
                      color: { LOW: '#16a34a', MEDIUM: '#d97706', HIGH: '#dc2626' }[r.riskLevel] }}>
                      {r.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#9ca3af', fontSize: '12px' }}>
                    {new Date(r.analyzedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const actionBtn = (bg) => ({
  padding: '12px 20px', background: bg, color: '#fff', border: 'none',
  borderRadius: '8px', fontSize: '14px', fontWeight: '600',
  cursor: 'pointer', textAlign: 'left'
});