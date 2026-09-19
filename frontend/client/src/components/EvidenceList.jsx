import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileText, GitCommit, GitPullRequest, CircleDot } from 'lucide-react';

export function EvidenceList({ evidenceList = [], lastCheckedAt }) {
  if (!evidenceList || evidenceList.length === 0) {
    return (
      <div style={{ padding: '12px', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
        No verification facts recorded yet. Connect a repository or trigger sync to inspect evidence.
      </div>
    );
  }

  const getItemIcon = (text) => {
    const isDone = text.startsWith('✓');
    if (text.includes('Commits') || text.includes('commit')) {
      return <GitCommit size={14} style={{ color: isDone ? '#10b981' : '#f59e0b' }} />;
    }
    if (text.includes('Pull') || text.includes('PR')) {
      return <GitPullRequest size={14} style={{ color: isDone ? '#10b981' : '#f59e0b' }} />;
    }
    if (text.includes('Document')) {
      return <FileText size={14} style={{ color: isDone ? '#10b981' : '#38bdf8' }} />;
    }
    if (text.includes('Issues')) {
      return <CircleDot size={14} style={{ color: isDone ? '#10b981' : '#f59e0b' }} />;
    }
    return isDone ? (
      <CheckCircle2 size={14} style={{ color: '#10b981' }} />
    ) : (
      <Clock size={14} style={{ color: '#f59e0b' }} />
    );
  };

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#94a3b8'
          }}>
            Synchronized Evidence Checklist
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
            Auto-Derived
          </span>
        </div>
        {lastCheckedAt && (
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
            Verified: {new Date(lastCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.04)'
      }}>
        {evidenceList.map((item, index) => {
          const isDone = item.startsWith('✓');
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: isDone ? '#e2e8f0' : '#94a3b8'
              }}
            >
              <div style={{ flexShrink: 0 }}>
                {getItemIcon(item)}
              </div>
              <span style={{
                fontFamily: item.includes('commits') || item.includes('PR') ? 'var(--font-mono)' : 'inherit',
                fontSize: item.includes('commits') || item.includes('PR') ? '0.775rem' : '0.8rem'
              }}>
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
