import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import {
  Award,
  CheckCircle2,
  Save,
  Info,
  AlertCircle,
  FileText,
  Check,
  User,
  Users,
  Sliders,
  Sparkles,
  GitCommit,
  GitPullRequest,
  Clock,
  ArrowRight
} from 'lucide-react';

const DEFAULT_INDIVIDUAL_RUBRIC = [
  { key: 'technicalContribution', name: 'Individual Code & Architecture Contribution', maxScore: 25, description: 'Modularity, clean code practices, and complex feature implementation.' },
  { key: 'gitCommitHygiene', name: 'Git Commit Quality & Task Delivery', maxScore: 25, description: 'Meaningful commit messages, regular cadence, and completed tasks.' },
  { key: 'collaboration', name: 'PR Reviews & Team Collaboration', maxScore: 25, description: 'Constructive pull request reviews, team communication, and code reviews.' },
  { key: 'vivaDefense', name: 'Viva Defense & Domain Comprehension', maxScore: 25, description: 'Ability to explain design patterns, architecture decisions, and code.' }
];

export function EvaluationPage({ selectedProjectId, onNavigateToCriteria }) {
  const [activeTab, setActiveTab] = useState('team'); // 'team' | 'individual'
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(selectedProjectId || '');
  const [rubricTemplate, setRubricTemplate] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Team Evaluation State
  const [scores, setScores] = useState({
    requirements: 18,
    implementation: 23,
    githubDevelopment: 24,
    documentation: 14,
    projectProgress: 14
  });
  const [feedback, setFeedback] = useState('Excellent engineering hygiene and automated milestone progress.');
  const [recommendations, setRecommendations] = useState('Finalize deployment documentation prior to final evaluation defense.');

  // Individual Student Evaluation State
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [individualEvaluations, setIndividualEvaluations] = useState({});
  const [savingIndividual, setSavingIndividual] = useState(false);
  const [individualSuccess, setIndividualSuccess] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [projList, templateData, critList] = await Promise.all([
          api.getProjects().catch(() => []),
          api.getRubricTemplate().catch(() => [
            { key: 'requirements', name: 'Requirements & Scope Management', maxScore: 20 },
            { key: 'implementation', name: 'Software Architecture & Code Quality', maxScore: 25 },
            { key: 'githubDevelopment', name: 'GitHub Development & Git Hygiene', maxScore: 25 },
            { key: 'documentation', name: 'Documentation & System Artifacts', maxScore: 15 },
            { key: 'projectProgress', name: 'Project Progress & Milestone Delivery', maxScore: 15 }
          ]),
          api.getCriteria().catch(() => [])
        ]);

        // Defensive normalization to prevent "rubricTemplate.reduce is not a function"
        const rawList = Array.isArray(templateData) ? templateData : (templateData?.categories || []);
        const normalizedTemplate = rawList.map(item => ({
          key: item.key,
          name: item.name || item.label || item.key,
          maxScore: item.maxScore || 20,
          description: item.description || ''
        }));

        setProjects(projList);
        setRubricTemplate(normalizedTemplate);
        setCriteria(critList);

        const activeId = selectedProjectId || (projList.length > 0 ? projList[0].id : '');
        setCurrentProjectId(activeId);

        if (activeId) {
          await loadProjectDetails(activeId);
        }
      } catch (err) {
        console.error('Failed to load evaluation data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedProjectId]);

  const loadProjectDetails = async (projectId) => {
    try {
      const [evals, msList, team] = await Promise.all([
        api.getEvaluations(projectId).catch(() => []),
        api.getMilestones(projectId).catch(() => []),
        api.getTeam(projectId).catch(() => [])
      ]);

      setMilestones(msList);
      setTeamMembers(team);

      if (team.length > 0 && !selectedMemberId) {
        setSelectedMemberId(team[0]._id || team[0].id);
      }

      if (evals.length > 0) {
        const latest = evals[0];
        setScores(latest.scores || scores);
        setFeedback(latest.feedback || '');
        setRecommendations(latest.recommendations || '');

        if (latest.individualEvaluations && Array.isArray(latest.individualEvaluations)) {
          const indivMap = {};
          latest.individualEvaluations.forEach(ie => {
            indivMap[ie.memberId] = ie;
          });
          setIndividualEvaluations(indivMap);
        }
      }
    } catch (err) {
      console.error('Error loading project details:', err);
    }
  };

  const handleScoreChange = (key, val, max) => {
    const num = Math.min(max, Math.max(0, parseInt(val || 0, 10)));
    setScores(prev => ({ ...prev, [key]: num }));
  };

  const handleIndividualScoreChange = (memberId, key, val, max) => {
    const num = Math.min(max, Math.max(0, parseInt(val || 0, 10)));
    setIndividualEvaluations(prev => {
      const current = prev[memberId] || {
        scores: { technicalContribution: 22, gitCommitHygiene: 23, collaboration: 21, vivaDefense: 22 },
        feedback: ''
      };
      return {
        ...prev,
        [memberId]: {
          ...current,
          scores: {
            ...current.scores,
            [key]: num
          }
        }
      };
    });
  };

  const handleIndividualFeedbackChange = (memberId, text) => {
    setIndividualEvaluations(prev => {
      const current = prev[memberId] || {
        scores: { technicalContribution: 22, gitCommitHygiene: 23, collaboration: 21, vivaDefense: 22 }
      };
      return {
        ...prev,
        [memberId]: {
          ...current,
          feedback: text
        }
      };
    });
  };

  // Safe totals using Array.isArray
  const safeRubric = Array.isArray(rubricTemplate) ? rubricTemplate : [];
  const totalScore = safeRubric.reduce((acc, item) => acc + (scores[item.key] || 0), 0);
  const maxTotalScore = safeRubric.reduce((acc, item) => acc + item.maxScore, 0) || 100;
  const percentage = Math.round((totalScore / maxTotalScore) * 100);

  const selectedMember = teamMembers.find(m => (m._id || m.id) === selectedMemberId) || teamMembers[0];
  const activeMemberEval = selectedMember ? (individualEvaluations[selectedMember._id || selectedMember.id] || {
    scores: { technicalContribution: 22, gitCommitHygiene: 23, collaboration: 21, vivaDefense: 22 },
    feedback: 'Consistent code contribution and clear architectural comprehension.'
  }) : null;

  const activeMemberTotal = activeMemberEval
    ? Object.values(activeMemberEval.scores || {}).reduce((a, b) => a + Number(b || 0), 0)
    : 0;

  const handleSaveTeamEvaluation = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const activeProj = projects.find(p => p.id === currentProjectId);
      const indivList = Object.entries(individualEvaluations).map(([mId, data]) => ({
        memberId: mId,
        ...data
      }));

      await api.createEvaluation({
        projectId: currentProjectId,
        projectName: activeProj ? activeProj.name : 'Capstone Project',
        scores,
        feedback,
        recommendations,
        individualEvaluations: indivList,
        status: 'submitted'
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      alert('Failed to save team evaluation: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveIndividualEvaluation = async () => {
    setSavingIndividual(true);
    setIndividualSuccess(false);
    try {
      const activeProj = projects.find(p => p.id === currentProjectId);
      const indivList = Object.entries(individualEvaluations).map(([mId, data]) => ({
        memberId: mId,
        ...data
      }));

      await api.createEvaluation({
        projectId: currentProjectId,
        projectName: activeProj ? activeProj.name : 'Capstone Project',
        scores,
        feedback,
        recommendations,
        individualEvaluations: indivList,
        status: 'submitted'
      });

      setIndividualSuccess(true);
      setTimeout(() => setIndividualSuccess(false), 4000);
    } catch (err) {
      alert('Failed to save individual evaluation: ' + err.message);
    } finally {
      setSavingIndividual(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading evaluation rubric and milestone criteria...</div>;
  }

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
            Grade software architecture, requirements trace, and implementation with faculty commentary for both the complete team and individual students.
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
                await loadProjectDetails(newId);
              }}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Mode Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('team')}
            className={`btn ${activeTab === 'team' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            <Users size={16} /> Complete Team Evaluation
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`btn ${activeTab === 'individual' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            <User size={16} /> Individual Student Evaluation ({teamMembers.length} Members)
          </button>
        </div>

        {onNavigateToCriteria && (
          <button
            onClick={onNavigateToCriteria}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            <Sliders size={14} style={{ color: '#38bdf8' }} /> Configure Milestone Criteria Rules &rarr;
          </button>
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
          <strong style={{ color: '#fff' }}>Academic Rubric Principle:</strong> GitHub evidence and milestone criteria rules directly inform the score, but the final grade is an <strong>academic faculty decision</strong>. Faculty evaluate both the team's cooperative milestone delivery and each student's verified individual contribution.
        </div>
      </div>

      {/* TEAM EVALUATION VIEW */}
      {activeTab === 'team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Milestone Criteria Assessment Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} style={{ color: '#38bdf8' }} />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Milestone Criteria Compliance</h2>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                  Quantitative rule verification informing the team's milestone grade
                </p>
              </div>

              {onNavigateToCriteria && (
                <button onClick={onNavigateToCriteria} className="btn btn-secondary btn-sm">
                  <Sliders size={13} /> Edit Milestone Rules
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {criteria.map((rule) => {
                const matchingMilestone = milestones.find(m => m.criteriaCode === rule.code);
                const isCompleted = matchingMilestone?.status === 'Completed';

                return (
                  <div
                    key={rule._id || rule.id}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className={`badge ${isCompleted ? 'badge-emerald' : 'badge-amber'}`}>
                        {rule.code || 'Rule'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isCompleted ? '#34d399' : '#fbbf24' }}>
                        {isCompleted ? '✓ Rule Verified' : 'In Progress'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '10px', color: '#fff' }}>
                      {rule.name}
                    </h3>

                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
                      <div>Min Commits: <strong style={{ color: '#e2e8f0' }}>{rule.minCommits}</strong></div>
                      <div>Min Pull Requests: <strong style={{ color: '#e2e8f0' }}>{rule.minPRs}</strong> ({rule.minMergedPRs} merged)</div>
                      <div>Required Artifact: <strong style={{ color: '#38bdf8' }}>{rule.requiredDocType || 'Specification'}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSaveTeamEvaluation} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {/* Left: Scored Rubric Line-Items */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>Complete Team Rubric Scoring</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {safeRubric.map((item) => {
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
                  Auto-Computed Team Rubric Total
                </span>
                <div style={{ fontSize: '3rem', fontWeight: 800, marginTop: '8px', color: '#38bdf8' }}>
                  {totalScore} <span style={{ fontSize: '1.4rem', color: '#94a3b8' }}>/ {maxTotalScore}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                  <span className={`badge ${percentage >= 90 ? 'badge-emerald' : percentage >= 75 ? 'badge-cyan' : 'badge-amber'}`} style={{ fontSize: '0.85rem' }}>
                    Team Grade: {percentage}% ({percentage >= 90 ? 'Grade A (Distinction)' : percentage >= 80 ? 'Grade B (Proficient)' : 'Grade C'})
                  </span>
                </div>
              </div>

              {/* Qualitative Feedback & Notes */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Team Narrative Feedback</h2>

                <div className="form-group">
                  <label className="form-label">Team Architectural Commentary</label>
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
                  <label className="form-label">Recommendations for Next Milestone</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    placeholder="Specific recommendations for subsequent sprint milestones..."
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
                  {saving ? 'Saving Evaluation...' : savedSuccess ? '✓ Team Evaluation Recorded!' : 'Save & Submit Team Evaluation'}
                  <Save size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* INDIVIDUAL STUDENT EVALUATION VIEW */}
      {activeTab === 'individual' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '24px' }}>
          {/* Member Selection Roster */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Project Team Roster</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
              Select an individual student to evaluate personal milestone deliverables and viva defense.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {teamMembers.map((member) => {
                const mId = member._id || member.id;
                const isSelected = mId === selectedMemberId;
                const mEval = individualEvaluations[mId];
                const score = mEval ? Object.values(mEval.scores || {}).reduce((a, b) => a + Number(b || 0), 0) : null;

                return (
                  <div
                    key={mId}
                    onClick={() => setSelectedMemberId(mId)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(0,0,0,0.2)',
                      border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.04)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? '#0284c7' : 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {member.name ? member.name.charAt(0) : 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#38bdf8' : '#f8fafc' }}>
                            {member.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {member.role || 'Team Member'}
                          </div>
                        </div>
                      </div>

                      {score !== null ? (
                        <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                          {score}/100
                        </span>
                      ) : (
                        <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Member Scoring Form */}
          {selectedMember ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Member Profile Header */}
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedMember.name}</h2>
                    {selectedMember.isLeader && <span className="badge badge-cyan">Team Lead</span>}
                    <span className="badge badge-violet">{selectedMember.role || 'Contributor'}</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>
                    {selectedMember.email} &bull; Individual Rubric Breakdown
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>
                    {activeMemberTotal} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 100</span>
                  </div>
                  <span className={`badge ${activeMemberTotal >= 90 ? 'badge-emerald' : activeMemberTotal >= 75 ? 'badge-cyan' : 'badge-amber'}`}>
                    Individual: {activeMemberTotal}%
                  </span>
                </div>
              </div>

              {/* Rubric Categories */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
                  Individual Performance Criteria
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {DEFAULT_INDIVIDUAL_RUBRIC.map((item) => {
                    const currentVal = activeMemberEval?.scores?.[item.key] ?? 20;

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
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                              {item.description}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="number"
                              min="0"
                              max={item.maxScore}
                              className="form-control"
                              style={{ width: '68px', padding: '6px 8px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}
                              value={currentVal}
                              onChange={e => handleIndividualScoreChange(selectedMember._id || selectedMember.id, item.key, e.target.value, item.maxScore)}
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

                {/* Individual Qualitative Remarks */}
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label className="form-label">Confidential Student Feedback & Guidance</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    placeholder="Specific remarks on individual code commits, architectural ownership, and viva performance..."
                    value={activeMemberEval?.feedback || ''}
                    onChange={e => handleIndividualFeedbackChange(selectedMember._id || selectedMember.id, e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveIndividualEvaluation}
                  disabled={savingIndividual}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '12px', padding: '12px' }}
                >
                  {savingIndividual ? 'Recording Score...' : individualSuccess ? `✓ Saved Evaluation for ${selectedMember.name}!` : `Save Evaluation for ${selectedMember.name}`}
                  <Save size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              Select a team member to score individual contribution.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default EvaluationPage;
