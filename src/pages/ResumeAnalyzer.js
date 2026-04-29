import React, { useState, useEffect } from 'react';
import { analyzeResume, getResumeHistory } from '../api/api';

const riskColor = { LOW: '#16a34a', MEDIUM: '#d97706', HIGH: '#dc2626' };
const riskBg = { LOW: '#f0fdf4', MEDIUM: '#fffbeb', HIGH: '#fef2f2' };

export default function ResumeAnalyzer() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getResumeHistory().then(r => setHistory(r.data)).catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await analyzeResume(content);
      setResult(res.data);
      const hist = await getResumeHistory();
      setHistory(hist.data);
    } catch (err) {
      setError('Analysis failed. Make sure the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 24px' }}>
      <h2 style={{ color: '#1e1b4b', marginBottom: '8px' }}>Resume Analyzer</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
        Paste resume text below to detect inflated or fake claims
      </p>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Paste resume content here..."
          style={{ width: '100%', height: '200px', padding: '12px', fontSize: '14px',
            border: '1px solid #e5e7eb', borderRadius: '8px', resize: 'vertical',
            boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.6' }}
        />
        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
        <button onClick={handleAnalyze} disabled={loading || !content.trim()}
          style={{ marginTop: '12px', padding: '10px 28px', background: '#4f46e5',
            color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px',
            fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {result && (
        <div style={{ background: riskBg[result.riskLevel], border: `1.5px solid ${riskColor[result.riskLevel]}`,
          borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#1e1b4b', marginBottom: '16px' }}>Analysis Result</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div style={metricCard}>
              <p style={metricLabel}>Credibility Score</p>
              <p style={{ ...metricValue, color: riskColor[result.riskLevel] }}>
                {(result.credibilityScore * 100).toFixed(0)}%
              </p>
            </div>
            <div style={metricCard}>
              <p style={metricLabel}>Risk Level</p>
              <p style={{ ...metricValue, color: riskColor[result.riskLevel] }}>
                {result.riskLevel}
              </p>
            </div>
          </div>
          {result.suspiciousElements?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>
                Suspicious Elements:
              </p>
              {result.suspiciousElements.map((item, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #fca5a5',
                  borderRadius: '6px', padding: '8px 12px', marginBottom: '6px',
                  fontSize: '13px', color: '#991b1b' }}>
                  ⚠ {item}
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '8px' }}>
            {result.explanation}
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1e1b4b', marginBottom: '16px' }}>Analysis History</h3>
          {history.slice(0, 5).map(record => (
            <div key={record.id} style={{ borderBottom: '1px solid #f3f4f6',
              padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#1f2937', marginBottom: '2px' }}>
                  {record.content?.substring(0, 60)}...
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {new Date(record.analyzedAt).toLocaleString()}
                </p>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                fontWeight: '600', background: riskBg[record.riskLevel],
                color: riskColor[record.riskLevel] }}>
                {record.riskLevel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const metricCard = { background: '#fff', borderRadius: '8px', padding: '16px', textAlign: 'center' };
const metricLabel = { fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' };
const metricValue = { fontSize: '32px', fontWeight: '700', margin: 0 };