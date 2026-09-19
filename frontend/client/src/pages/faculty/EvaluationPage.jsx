import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Award, CheckCircle2, Save, Info, AlertCircle, FileText, Check } from 'lucide-react';

export function EvaluationPage({ selectedProjectId }) {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(selectedProjectId || '');
  const [rubricTemplate, setRubricTemplate] = useState([]);
  const [scores, setScores] = useState({
    requirements: 18,
    implementation: 23,
    githubDevelopment: 24,
    documentation: 14,
    projectProgress: 14
  });
  const [feedback, setFeedback] = useState('Excellent engineering hygiene and automated milestone progress.');
  const [recommendations, setRecommendations] = useState('Finalize deployment documentation prior to final evaluation defense.');
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [projList, template] = await Promise.all([
          api.getProjects(),
          api.getRubricTemplate().catch(() => [
            { key: 'requirements', name: 'Requirements & Scope Management', maxScore: 20 },
            { key: 'implementation', name: 'Software Architecture & Code Quality', maxScore: 25 },
            { key: 'githubDevelopment', name: 'GitHub Development & Git Hygiene', maxScore: 25 },
            { key: 'documentation', name: 'Documentation & System Artifacts', maxScore: 15 },
            { key: 'projectProgress', name: 'Project Progress & Milestone Delivery', maxScore: 15 }
          ])
        ]);

        setProjects(projList);
        setRubricTemplate(template);

        const activeId = selectedProjectId || (projList.length > 0 ? projList[0].id : '');
        setCurrentProjectId(activeId);

        if (activeId) {
          const evals = await api.getEvaluations(activeId);
          setEvaluations(evals);
          if (evals.length > 0) {
            setScores(evals[0].scores || scores);
            setFeedback(evals[0].feedback || '');
            setRecommendations(evals[0].recommendations || '');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedProjectId]);

  const handleScoreChange = (key, val, max) => {
    const num = Math.min(max, Math.max(0, parseInt(val || 0, 10)));
    setScores(prev => ({ ...prev, [key]: num }));
  };

  const totalScore = rubricTemplate.reduce((acc, item) => acc + (scores[item.key] || 0), 0);
  const maxTotalScore = rubricTemplate.reduce((acc, item) => acc + item.maxScore, 0);
  const percentage = Math.round((totalScore / maxTotalScore) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const activeProj = projects.find(p => p.id === currentProjectId);
      await api.createEvaluation({
        projectId: currentProjectId,
        projectName: activeProj ? activeProj.name : 'Capstone Project',
        scores,
        feedback,
        recommendations,
        status: 'submitted'
      });

      const updatedEvals = await api.getEvaluations(currentProjectId);
      setEvaluations(updatedEvals);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      alert('Failed to save evaluation: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading evaluation rubric...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Capstone Evaluation & Rubric</h1>
            <span className="badge badge-emerald">Faculty Decision Authority</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Grade software architecture, requirements trace, and implementation with faculty commentary.
          </p>
        </div>

        {projects.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Project:</span>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={currentProjectId}
              onChange={async (e) => {
                const newId = e.target.value;
                setCurrentProjectId(newId);
                const evals = await api.getEvaluations(newId);
                setEvaluations(evals);
                if (evals.length > 0) {
                  setScores(evals[0].scores || scores);
                  setFeedback(evals[0].feedback || '');
                  setRecommendations(evals[0].recommendations || '');
                }
              }}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Contractual Principle Banner */}
      <div style={{
        padding: '16px 20px',
        borderRadius: '12px',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <Info size={20} style={{ color: '#818cf8', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>
          <strong style={{ color: '#fff' }}>Academic Rubric Principle:</strong> GitHub evidence informs the score, but the score itself is a <strong>faculty decision</strong>, not an automatic calculation. Faculty retain full academic discretion over grade line-items and qualitative commentary.
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left: Scored Rubric Line-Items */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>Rubric Criteria Scoring</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {rubricTemplate.map((item) => {
              const currentVal = scores[item.key] ?? 0;
              return (
                <div
                  key={item.key}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{item.name}</div>
                      {item.description && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                          {item.description}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        min="0"
                        max={item.maxScore}
                        className="form-control"
                        style={{ width: '68px', padding: '6px 8px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}
                        value={currentVal}
                        onChange={e => handleScoreChange(item.key, e.target.value, item.maxScore)}
                      />
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ {item.maxScore}</span>
                    </div>
                  </div>

                  <div className="progress-bar-track" style={{ marginTop: '10px', height: '6px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(currentVal / item.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Grade Rollup & Narrative Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Total Rollup Card */}
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Auto-Computed Rubric Total
            </span>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginTop: '8px', color: '#38bdf8' }}>
              {totalScore} <span style={{ fontSize: '1.4rem', color: '#94a3b8' }}>/ {maxTotalScore}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
              <span className={`badge ${percentage >= 90 ? 'badge-emerald' : percentage >= 75 ? 'badge-cyan' : 'badge-amber'}`} style={{ fontSize: '0.85rem' }}>
                Overall: {percentage}% ({percentage >= 90 ? 'Grade A (Distinction)' : percentage >= 80 ? 'Grade B (Proficient)' : 'Grade C'})
              </span>
            </div>
          </div>

          {/* Qualitative Feedback & Notes */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Faculty Narrative Feedback</h2>

            <div className="form-group">
              <label className="form-label">Evaluation Commentary</label>
              <textarea
                rows={4}
                required
                className="form-control"
                placeholder="Detail technical strengths, modularity, Git hygiene, and architecture patterns..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recommendations & Required Action Items</label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="Specific recommendations for subsequent milestone sprints..."
                value={recommendations}
                onChange={e => setRecommendations(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px', padding: '12px' }}
            >
              {saving ? 'Saving Evaluation...' : savedSuccess ? '✓ Evaluation Recorded!' : 'Save & Submit Evaluation'}
              <Save size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
