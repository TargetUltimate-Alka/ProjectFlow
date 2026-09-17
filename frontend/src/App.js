import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeRole, setActiveRole] = useState('student');

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">ProjectFlow</span>
        </div>
        <nav className="nav-links">
          <button className={activeRole === 'student' ? 'btn active' : 'btn'} onClick={() => setActiveRole('student')}>
            Student Portal
          </button>
          <button className={activeRole === 'faculty' ? 'btn active' : 'btn'} onClick={() => setActiveRole('faculty')}>
            Faculty Portal
          </button>
          <button className={activeRole === 'admin' ? 'btn active' : 'btn'} onClick={() => setActiveRole('admin')}>
            Admin Portal
          </button>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h1>Academic Software Project Lifecycle & Evaluation Platform</h1>
          <p className="subtitle">
            Centralized platform uniting students, faculty mentors, and administrators through structured microservices.
          </p>
        </section>

        <section className="role-card-section">
          <div className="role-card">
            <h2>Current View: <span className="highlight">{activeRole.toUpperCase()}</span></h2>
            {activeRole === 'student' && (
              <ul>
                <li>✨ Form Teams & Register Projects</li>
                <li>📝 Manage Requirements & Traceability</li>
                <li>📌 Kanban Task Board & Assignments</li>
                <li>🚀 Submit Milestones & Deliverables</li>
                <li>🐙 GitHub Commits & Activity Tracker</li>
              </ul>
            )}
            {activeRole === 'faculty' && (
              <ul>
                <li>👀 View Assigned Projects & Team Health</li>
                <li>📋 Review Requirements & Architecture</li>
                <li>💬 Provide Milestone Feedback</li>
                <li>📊 Grade Milestones using Custom Rubrics</li>
              </ul>
            )}
            {activeRole === 'admin' && (
              <ul>
                <li>👥 Manage Students & Faculty Rosters</li>
                <li>🎯 Assign Faculty Supervisors to Teams</li>
                <li>⚖️ Configure Evaluation Criteria & Weightage</li>
                <li>📈 System-wide Audit & Final Reports</li>
              </ul>
            )}
          </div>
        </section>

        <section className="services-grid">
          <div className="service-badge">Auth Service (:5001)</div>
          <div className="service-badge">Project Service (:5002)</div>
          <div className="service-badge">Task Service (:5003)</div>
          <div className="service-badge">Evaluation Service (:5004)</div>
          <div className="service-badge">Integration Service (:5005)</div>
          <div className="service-badge">Notification Service (:5006)</div>
        </section>
      </main>

      <footer className="footer">
        <p>ProjectFlow © 2026 — Designed for Academic Software Engineering Projects</p>
      </footer>
    </div>
  );
}

export default App;
