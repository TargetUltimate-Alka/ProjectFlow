import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { EvidenceList } from '../../components/EvidenceList';
import { Award, RefreshCw, CheckCircle2, Clock, Info, ShieldCheck, Sparkles } from 'lucide-react';

export function MilestonesPage() {
  const [milestones, setMilestones] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      if (projects.length > 0) {
        setProject(projects[0]);
        const data = await api.getMilestones(projects[0].id);
        setMilestones(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleRecalculate = async () => {
    if (!project) return;
    try {
      setRecalculating(true);
      await api.recalculateMilestones(project.id);
      await fetchMilestones();
    } catch (err) {
      alert('Recalculation error: ' + err.message);
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading milestone evaluations...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Capstone Milestones & Evidence</h1>
            <span className="badge badge-emerald">System-Evaluated</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Milestone progress is automatically derived from synchronized GitHub activity and uploaded document artifacts.
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="btn btn-secondary"
        >
          <RefreshCw size={15} className={recalculating ? 'animate-spin' : ''} />
          {recalculating ? 'Evaluating Evidence...' : 'Re-Evaluate Evidence Now'}
        </button>
      </div>

      {/* Mandatory Principle Banner */}
      <div style={{
        padding: '16px 20px',
        borderRadius: '12px',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <Info size={20} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.5 }}>
          <strong style={{ color: '#fff' }}>Core Platform Rule:</strong> Manual "Mark as Completed" buttons are prohibited here. Milestones advance solely when GitHub commits, PRs, closed issues, and required document artifacts fulfill the criteria set by Faculty and Administrators.
        </div>
      </div>

      {/* Milestones Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {milestones.map((ms) => {
          const isDone = ms.status === 'Completed';
          return (
            <div
              key={ms._id || ms.criteriaCode}
              className="glass-panel"
              style={{
                padding: '24px',
                borderLeft: `5px solid ${isDone ? '#10b981' : ms.percentage > 0 ? '#f59e0b' : '#64748b'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge ${isDone ? 'badge-emerald' : 'badge-amber'}`}>
                      {ms.criteriaCode}
                    </span>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                      {ms.name}
                    </h2>
                    {isDone && (
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        <CheckCircle2 size={12} /> Satisfied
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px', maxWidth: '700px' }}>
                    {ms.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: isDone ? '#34d399' : '#f59e0b' }}>
                    {ms.percentage}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status: <strong style={{ color: '#fff' }}>{ms.status}</strong>
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="progress-bar-track" style={{ height: '10px', marginTop: '16px' }}>
                <div
                  className={`progress-bar-fill ${isDone ? 'emerald' : 'amber'}`}
                  style={{ width: `${ms.percentage}%` }}
                />
              </div>

              {/* Evidence Checklist */}
              <EvidenceList evidenceList={ms.evidenceList} lastCheckedAt={ms.lastCheckedAt} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
