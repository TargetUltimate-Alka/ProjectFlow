import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import {
  FolderGit2,
  Users,
  Award,
  Github,
  CheckCircle2,
  ExternalLink,
  Clock,
  ArrowRight,
  School,
  FileCheck
} from 'lucide-react';

export function FacultyDashboard({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedProjects();
  }, []);

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading assigned projects...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Faculty Supervision Dashboard</h1>
            <span className="badge badge-cyan">Capstone Supervisor</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Monitor assigned software engineering capstone teams, audit GitHub activity, and submit rubric evaluations.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {projects.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#64748b' }}>
            No projects assigned to your supervision roster.
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="glass-panel glass-panel-hoverable"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: '3px solid #38bdf8'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-cyan">{proj.status}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981' }}>
                    <Github size={14} />
                    <span>GitHub Connected</span>
                  </div>
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '14px', color: '#fff' }}>
                  {proj.name}
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.5, maxHeight: '60px', overflow: 'hidden' }}>
                  {proj.description || 'No description provided.'}
                </p>

                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94a3b8' }}>Milestone Progress</span>
                    <strong style={{ color: '#38bdf8' }}>{proj.progressPercentage || 0}%</strong>
                  </div>
                  <div className="progress-bar-track" style={{ marginTop: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${proj.progressPercentage || 0}%` }} />
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginTop: '18px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  fontSize: '0.75rem'
                }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Team Members</span>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', marginTop: '2px' }}>{proj.teamSize} Students</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Milestones Done</span>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', marginTop: '2px' }}>
                      {proj.milestonesCompleted} / {proj.totalMilestones} Delivered
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => onSelectProject(proj.id, 'details')}
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.8rem' }}
                >
                  View Project <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => onSelectProject(proj.id, 'evaluation')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                  title="Score Rubric Evaluation"
                >
                  <Award size={15} /> Evaluate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
