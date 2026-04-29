import React, { useState } from 'react';
import { analyzeEmail } from '../api/api';

const riskColor = { LOW: '#16a34a', MEDIUM: '#d97706', HIGH: '#dc2626' };
const riskBg = { LOW: '#f0fdf4', MEDIUM: '#fffbeb', HIGH: '#fef2f2' };

export default function EmailAnalyzer() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await analyzeEmail(content);
      setResult(res.data);
    } catch {
      setError('Analysis failed. Make sure the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 24px' }}>
      <h2 style={{ color: '#1e1b4b', marginBottom: '8px' }}>Email Phishing Detector</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
        Paste suspicious email content to check for phishing patterns
      </p>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Paste email content here..."
          style={{ width: '100%', height: '220px', padding: '12px', fontSize: '14px',
            border: '1px solid #e5e7eb', borderRadius: '8px', resize: 'vertical',
            boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.6' }}
        />
        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
        <button onClick={handleAnalyze} disabled={loading || !content.trim()}
          style={{ marginTop: '12px', padding: '10px 28px', background: '#7c3aed',
            color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px',
            fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Scanning...' : 'Scan Email'}
        </button>
      </div>

      {result && (
        <div style={{ background: riskBg[result.riskLevel],
          border: `1.5px solid ${riskColor[result.riskLevel]}`,
          borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ color: '#1e1b4b', marginBottom: '16px' }}>Scan Result</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            {[
              { label: 'Credibility', value: `${(result.credibilityScore * 100).toFixed(0)}%` },
              { label: 'Risk Level', value: result.riskLevel },
              { label: 'Verdict', value: result.isFake ? 'SUSPICIOUS' : 'LIKELY SAFE' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#fff', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>{label}</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: riskColor[result.riskLevel], margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
          {result.suspiciousElements?.length > 0 && (
            <div>
              <p style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>
                Phishing Indicators Found:
              </p>
              {result.suspiciousElements.map((item, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #fca5a5',
                  borderRadius: '6px', padding: '8px 12px', marginBottom: '6px',
                  fontSize: '13px', color: '#991b1b' }}>⚠ {item}</div>
              ))}
            </div>
          )}
          <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '12px' }}>{result.explanation}</p>
        </div>
      )}
    </div>
  );
}