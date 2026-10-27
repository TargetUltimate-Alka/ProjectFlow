import React, { useState, useEffect, useRef } from 'react';
import {
  FolderGit2, BookOpen, Users, ListTodo, CheckSquare, GitBranch, MessageSquare,
  Award, ArrowRight, ChevronDown, Menu, X, GraduationCap, School, ShieldCheck,
  Layers, Clock, Target, FileText, Bell, BarChart3, Zap, Globe, Sparkles,
  CircleCheck, XCircle, CheckCircle2, ArrowUpRight, Heart
} from 'lucide-react';
import './homepage.css';

/* ─────────────────────────────────────────────
   ProductVisualization — 3D Floating Workspace
   ───────────────────────────────────────────── */
function ProductVisualization() {
  return (
    <div className="hp-hero__visual" aria-hidden="true">
      <div className="hp-viz">
        {/* Dashboard Card */}
        <div className="hp-viz__card hp-viz__card--dashboard">
          <div className="hp-viz__card-header">
            <div className="hp-viz__card-header-icon" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
              <BookOpen size={12} />
            </div>
            <span>Course Dashboard</span>
          </div>
          <div className="hp-viz__card-body">
            <div className="hp-viz__row">
              <div className="hp-viz__avatar" style={{ background: 'linear-gradient(135deg,#0284c7,#6366f1)' }}>CS</div>
              <div style={{ flex: 1 }}>
                <div className="hp-viz__text-md">CS543 — Web Services</div>
                <div className="hp-viz__text-sm" style={{ marginTop: 2 }}>Dr. R. Sharma · 3 Projects</div>
              </div>
              <div className="hp-viz__tag" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>Active</div>
            </div>
            <div className="hp-viz__row" style={{ marginTop: 4 }}>
              <div className="hp-viz__avatar" style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>SE</div>
              <div style={{ flex: 1 }}>
                <div className="hp-viz__text-md">SE601 — Software Engineering</div>
                <div className="hp-viz__text-sm" style={{ marginTop: 2 }}>Prof. K. Patel · 5 Projects</div>
              </div>
              <div className="hp-viz__tag" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>Review</div>
            </div>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="hp-viz__card hp-viz__card--tasks">
          <div className="hp-viz__card-header">
            <div className="hp-viz__card-header-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
              <ListTodo size={12} />
            </div>
            <span>Tasks</span>
          </div>
          <div className="hp-viz__card-body">
            <div className="hp-viz__row">
              <CheckSquare size={12} style={{ color: '#34d399', flexShrink: 0 }} />
              <span className="hp-viz__text-md" style={{ flex: 1 }}>API Gateway Setup</span>
              <div className="hp-viz__tag" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>Done</div>
            </div>
            <div className="hp-viz__row" style={{ marginTop: 4 }}>
              <Clock size={12} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <span className="hp-viz__text-md" style={{ flex: 1 }}>Auth Middleware</span>
              <div className="hp-viz__tag" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>In Progress</div>
            </div>
            <div className="hp-viz__row" style={{ marginTop: 4 }}>
              <Target size={12} style={{ color: '#64748b', flexShrink: 0 }} />
              <span className="hp-viz__text-md" style={{ flex: 1 }}>Unit Tests</span>
              <div className="hp-viz__tag" style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>Pending</div>
            </div>
          </div>
        </div>

        {/* Team Card */}
        <div className="hp-viz__card hp-viz__card--team">
          <div className="hp-viz__card-header">
            <div className="hp-viz__card-header-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
              <Users size={12} />
            </div>
            <span>Team Alpha</span>
          </div>
          <div className="hp-viz__card-body" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['AS', 'RK', 'AC', 'SP'].map((initials, i) => (
              <div key={i} className="hp-viz__avatar" style={{
                background: ['#0284c7', '#6366f1', '#059669', '#d97706'][i],
                width: 28, height: 28, fontSize: '0.55rem'
              }}>
                {initials}
              </div>
            ))}
            <div className="hp-viz__bar" style={{ width: '100%', marginTop: 6 }}>
              <div className="hp-viz__bar-fill" style={{ width: '72%', background: 'linear-gradient(90deg,#0284c7,#38bdf8)' }} />
            </div>
            <div className="hp-viz__text-sm" style={{ width: '100%' }}>4 / 5 members · 72% progress</div>
          </div>
        </div>

        {/* GitHub Card */}
        <div className="hp-viz__card hp-viz__card--github">
          <div className="hp-viz__card-header">
            <div className="hp-viz__card-header-icon" style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }}>
              <GitBranch size={12} />
            </div>
            <span>GitHub</span>
          </div>
          <div className="hp-viz__card-body">
            <div className="hp-viz__row">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />
              <span className="hp-viz__text-sm" style={{ color: '#cbd5e1' }}>3 commits today</span>
            </div>
            <div className="hp-viz__row" style={{ marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', flexShrink: 0 }} />
              <span className="hp-viz__text-sm" style={{ color: '#cbd5e1' }}>2 PRs merged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────
   FAQ Accordion Item
   ───────────────────────── */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hp-faq__item ${open ? 'hp-faq__item--open' : ''}`}>
      <button
        className="hp-faq__question"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <ChevronDown size={18} className={`hp-faq__chevron ${open ? 'hp-faq__chevron--open' : ''}`} />
      </button>
      {open && <div className="hp-faq__answer">{answer}</div>}
    </div>
  );
}

/* ─────────────────────────
   Product Showcase Section
   ───────────────────────── */
function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Course Dashboard', icon: BookOpen },
    { label: 'Team Workspace', icon: Users },
    { label: 'Task Tracker', icon: ListTodo },
    { label: 'Submissions', icon: FileText },
    { label: 'Evaluation', icon: Award },
  ];

  const panels = [
    // Course Dashboard
    <div key="course">
      <div className="hp-mock-row">
        <div className="hp-mock-avatar" style={{ background: '#0284c7' }}>CS</div>
        <div className="hp-mock-col">
          <div className="hp-mock-title">CS543 — Web Services</div>
          <div className="hp-mock-subtitle">Semester 1 · Dr. R. Sharma · 28 students enrolled</div>
        </div>
        <div className="hp-mock-badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>Active</div>
      </div>
      <div className="hp-mock-row">
        <div className="hp-mock-avatar" style={{ background: '#6366f1' }}>SE</div>
        <div className="hp-mock-col">
          <div className="hp-mock-title">SE601 — Software Engineering Lab</div>
          <div className="hp-mock-subtitle">Semester 1 · Prof. K. Patel · 35 students enrolled</div>
        </div>
        <div className="hp-mock-badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>Review Phase</div>
      </div>
      <div className="hp-mock-row">
        <div className="hp-mock-avatar" style={{ background: '#059669' }}>AI</div>
        <div className="hp-mock-col">
          <div className="hp-mock-title">AI502 — Machine Learning</div>
          <div className="hp-mock-subtitle">Semester 2 · Dr. M. Kumar · 22 students enrolled</div>
        </div>
        <div className="hp-mock-badge" style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8' }}>Upcoming</div>
      </div>
    </div>,
    // Team Workspace
    <div key="team">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {['Aarav S.', 'Rohit K.', 'Alex C.', 'Sneha P.'].map((name, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="hp-mock-avatar" style={{ background: ['#0284c7','#6366f1','#059669','#d97706'][i], width: 32, height: 32 }}>
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="hp-mock-title">{name}</div>
              <div className="hp-mock-subtitle">{i === 0 ? 'Team Lead' : 'Member'}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="hp-mock-row">
        <div className="hp-mock-col">
          <div className="hp-mock-title">Team Alpha — Microservices Architecture</div>
          <div style={{ marginTop: 6 }}>
            <div className="hp-mock-progress">
              <div className="hp-mock-progress__fill" style={{ width: '68%', background: 'linear-gradient(90deg,#0284c7,#38bdf8)' }} />
            </div>
            <div className="hp-mock-subtitle" style={{ marginTop: 4 }}>68% overall progress · 4 / 5 members</div>
          </div>
        </div>
      </div>
    </div>,
    // Task Tracker
    <div key="tasks">
      {[
        { title: 'API Gateway Setup', status: 'Completed', color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
        { title: 'JWT Auth Middleware', status: 'In Progress', color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
        { title: 'Database Schema Design', status: 'Completed', color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
        { title: 'Unit Testing Suite', status: 'Pending', color: '#94a3b8', bg: 'rgba(255,255,255,0.06)' },
      ].map((task, i) => (
        <div className="hp-mock-row" key={i}>
          <CheckSquare size={14} style={{ color: task.color, flexShrink: 0 }} />
          <div className="hp-mock-col">
            <div className="hp-mock-title">{task.title}</div>
          </div>
          <div className="hp-mock-badge" style={{ background: task.bg, color: task.color }}>{task.status}</div>
        </div>
      ))}
    </div>,
    // Submissions
    <div key="submissions">
      {[
        { title: 'Project Proposal', date: 'Oct 15, 2026', status: 'Submitted', color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
        { title: 'Architecture Design Doc', date: 'Oct 22, 2026', status: 'Under Review', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
        { title: 'Sprint 1 Deliverable', date: 'Nov 5, 2026', status: 'Upcoming', color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
      ].map((sub, i) => (
        <div className="hp-mock-row" key={i}>
          <FileText size={14} style={{ color: sub.color, flexShrink: 0 }} />
          <div className="hp-mock-col">
            <div className="hp-mock-title">{sub.title}</div>
            <div className="hp-mock-subtitle">Due: {sub.date}</div>
          </div>
          <div className="hp-mock-badge" style={{ background: sub.bg, color: sub.color }}>{sub.status}</div>
        </div>
      ))}
    </div>,
    // Evaluation
    <div key="evaluation">
      <div className="hp-mock-row">
        <Award size={14} style={{ color: '#a78bfa', flexShrink: 0 }} />
        <div className="hp-mock-col">
          <div className="hp-mock-title">Code Quality</div>
          <div style={{ marginTop: 4 }}>
            <div className="hp-mock-progress">
              <div className="hp-mock-progress__fill" style={{ width: '85%', background: 'linear-gradient(90deg,#6366f1,#a78bfa)' }} />
            </div>
          </div>
        </div>
        <div className="hp-mock-badge" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>85/100</div>
      </div>
      <div className="hp-mock-row">
        <Award size={14} style={{ color: '#34d399', flexShrink: 0 }} />
        <div className="hp-mock-col">
          <div className="hp-mock-title">Documentation</div>
          <div style={{ marginTop: 4 }}>
            <div className="hp-mock-progress">
              <div className="hp-mock-progress__fill" style={{ width: '92%', background: 'linear-gradient(90deg,#059669,#10b981)' }} />
            </div>
          </div>
        </div>
        <div className="hp-mock-badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>92/100</div>
      </div>
      <div className="hp-mock-row">
        <Award size={14} style={{ color: '#fbbf24', flexShrink: 0 }} />
        <div className="hp-mock-col">
          <div className="hp-mock-title">Team Collaboration</div>
          <div style={{ marginTop: 4 }}>
            <div className="hp-mock-progress">
              <div className="hp-mock-progress__fill" style={{ width: '78%', background: 'linear-gradient(90deg,#d97706,#f59e0b)' }} />
            </div>
          </div>
        </div>
        <div className="hp-mock-badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>78/100</div>
      </div>
    </div>,
  ];

  return (
    <section className="hp-showcase" id="showcase">
      <div className="hp-showcase__container">
        <div className="hp-section__header">
          <div className="hp-section__eyebrow">
            <Layers size={14} /> Product Preview
          </div>
          <h2 className="hp-section__title">See ProjectFlow in Action</h2>
          <p className="hp-section__desc">
            Explore the key interfaces that make academic project management seamless and organized.
          </p>
        </div>

        <div className="hp-showcase__tabs" role="tablist" aria-label="Product showcase tabs">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button
                key={i}
                role="tab"
                aria-selected={activeTab === i}
                className={`hp-showcase__tab ${activeTab === i ? 'hp-showcase__tab--active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon size={14} /> {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hp-showcase__panel" role="tabpanel">
          <div className="hp-showcase__panel-header">
            <div className="hp-showcase__panel-dots">
              <div className="hp-showcase__panel-dot" style={{ background: '#f43f5e' }} />
              <div className="hp-showcase__panel-dot" style={{ background: '#f59e0b' }} />
              <div className="hp-showcase__panel-dot" style={{ background: '#10b981' }} />
            </div>
            <span className="hp-showcase__panel-title">ProjectFlow — {tabs[activeTab].label}</span>
          </div>
          <div className="hp-showcase__panel-body">
            {panels[activeTab]}
          </div>
          <div className="hp-showcase__illustrative">Illustrative preview for demonstration purposes</div>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════
   MAIN HOMEPAGE COMPONENT
   ═════════════════════════════════ */
export function HomePage({ onNavigateToAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'For Students', id: 'for-students' },
    { label: 'For Faculty', id: 'for-faculty' },
    { label: 'For Coordinators', id: 'for-coordinators' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <div className="hp-page">
      {/* ───── HEADER ───── */}
      <header className={`hp-header ${scrolled ? 'hp-header--scrolled' : ''}`} role="banner">
        <button className="hp-header__logo" onClick={() => scrollTo('hero')} aria-label="ProjectFlow Home">
          <div className="hp-header__logo-icon"><FolderGit2 size={22} /></div>
          <div className="hp-header__logo-text">Project<span>Flow</span></div>
        </button>

        <nav className="hp-header__nav" aria-label="Main navigation">
          {navLinks.map(link => (
            <button key={link.id} className="hp-header__nav-link" onClick={() => scrollTo(link.id)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hp-header__actions">
          <a className="hp-btn-login" href="/institutions" style={{ display: 'inline-flex', alignItems: 'center' }}>Institutions</a>
          <button className="hp-btn-login" onClick={() => onNavigateToAuth('login')}>Log In</button>
          <button className="hp-btn-register" onClick={() => onNavigateToAuth('register')}>Get Started</button>
        </div>

        <button
          className="hp-header__mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu */}
      <div className={`hp-mobile-menu ${mobileMenuOpen ? 'hp-mobile-menu--open' : ''}`}>
        {navLinks.map(link => (
          <button key={link.id} className="hp-mobile-menu__link" onClick={() => scrollTo(link.id)}>
            {link.label}
          </button>
        ))}
        <div className="hp-mobile-menu__actions">
          <a className="hp-btn-login" href="/institutions" style={{ display: 'block', width: '100%', textAlign: 'center' }}>Institutions</a>
          <button className="hp-btn-login" style={{ width: '100%', textAlign: 'center' }} onClick={() => { setMobileMenuOpen(false); onNavigateToAuth('login'); }}>
            Log In
          </button>
          <button className="hp-btn-register" style={{ width: '100%', textAlign: 'center' }} onClick={() => { setMobileMenuOpen(false); onNavigateToAuth('register'); }}>
            Get Started
          </button>
        </div>
      </div>

      {/* ───── HERO SECTION ───── */}
      <section className="hp-hero" id="hero">
        <div className="hp-hero__bg">
          <div className="hp-hero__grid" />
        </div>
        <div className="hp-hero__content">
          <div className="hp-hero__text">
            <div className="hp-hero__badge">
              <div className="hp-hero__badge-dot" />
              Academic Project Management Platform
            </div>
            <h1 className="hp-hero__title">
              Academic Projects,{' '}
              <span className="hp-hero__title-accent">Finally in Flow.</span>
            </h1>
            <p className="hp-hero__subtitle">
              From forming teams to submitting projects and receiving faculty feedback,
              ProjectFlow brings every stage of academic project work into one organized workspace.
            </p>
            <div className="hp-hero__ctas">
              <button className="hp-cta-primary" onClick={() => scrollTo('features')}>
                Explore ProjectFlow <ArrowRight size={18} />
              </button>
              <button className="hp-cta-secondary" onClick={() => onNavigateToAuth('register')}>
                Get Started <ArrowUpRight size={18} />
              </button>
            </div>
          </div>

          <ProductVisualization />
        </div>
      </section>

      {/* ───── FEATURES SECTION ───── */}
      <section className="hp-section" id="features">
        <div className="hp-section__container">
          <div className="hp-section__header">
            <div className="hp-section__eyebrow"><Zap size={14} /> Key Capabilities</div>
            <h2 className="hp-section__title">Everything Your Academic Projects Need</h2>
            <p className="hp-section__desc">
              ProjectFlow simplifies academic project management with tools designed for students, faculty, and coordinators.
            </p>
          </div>

          <div className="hp-features-grid">
            {[
              {
                icon: BookOpen,
                title: 'Organized Courses & Projects',
                desc: 'Keep course-related project work and relevant information organized in one central place.',
                color: '#38bdf8',
                bg: 'rgba(56,189,248,0.1)',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                desc: 'Help students coordinate team activities, understand responsibilities, and work together effectively.',
                color: '#6366f1',
                bg: 'rgba(99,102,241,0.1)',
              },
              {
                icon: ListTodo,
                title: 'Task Management',
                desc: 'Track assigned tasks, deadlines, progress, and completion status across all project milestones.',
                color: '#10b981',
                bg: 'rgba(16,185,129,0.1)',
              },
              {
                icon: FileText,
                title: 'Project Submissions',
                desc: 'Provide a clear workflow for project deliverables, documentation, and submission status tracking.',
                color: '#f59e0b',
                bg: 'rgba(245,158,11,0.1)',
              },
              {
                icon: MessageSquare,
                title: 'Faculty Feedback',
                desc: 'Help students understand feedback, evaluation results, and areas for improvement through structured reviews.',
                color: '#a78bfa',
                bg: 'rgba(139,92,246,0.1)',
              },
              {
                icon: GitBranch,
                title: 'GitHub Activity',
                desc: 'Surface relevant repository activity and integration information to connect code with project milestones.',
                color: '#e2e8f0',
                bg: 'rgba(255,255,255,0.06)',
              },
              {
                icon: Award,
                title: 'Transparent Evaluation',
                desc: 'Present project evaluation and assessment criteria clearly, helping everyone understand expectations.',
                color: '#fb7185',
                bg: 'rgba(244,63,94,0.1)',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div className="hp-feature-card" key={i}>
                  <div className="hp-feature-card__icon" style={{ background: feature.bg, color: feature.color }}>
                    <Icon size={22} />
                  </div>
                  <h3 className="hp-feature-card__title">{feature.title}</h3>
                  <p className="hp-feature-card__desc">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="hp-section" id="how-it-works" style={{ background: 'rgba(15,20,35,0.4)' }}>
        <div className="hp-section__container">
          <div className="hp-section__header">
            <div className="hp-section__eyebrow"><Target size={14} /> How It Works</div>
            <h2 className="hp-section__title">Five Steps to Organized Project Work</h2>
            <p className="hp-section__desc">
              ProjectFlow guides you through the entire academic project lifecycle in a streamlined workflow.
            </p>
          </div>

          <div className="hp-timeline" style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="hp-timeline__line" />
            {[
              {
                num: '1',
                title: 'Join a Course',
                desc: 'Access your academic project workspace by enrolling in a course. See announcements, resources, and project guidelines.',
                bg: 'linear-gradient(135deg,#0284c7,#38bdf8)',
              },
              {
                num: '2',
                title: 'Build Your Team',
                desc: 'Form a project team with classmates. Organize collaboration, assign roles, and get ready to build together.',
                bg: 'linear-gradient(135deg,#6366f1,#818cf8)',
              },
              {
                num: '3',
                title: 'Plan & Assign Tasks',
                desc: 'Break down your project into manageable tasks. Coordinate work, set deadlines, and track responsibilities.',
                bg: 'linear-gradient(135deg,#059669,#10b981)',
              },
              {
                num: '4',
                title: 'Build & Submit',
                desc: 'Manage project progress, connect your GitHub repository, and submit deliverables as you reach milestones.',
                bg: 'linear-gradient(135deg,#d97706,#f59e0b)',
              },
              {
                num: '5',
                title: 'Review & Improve',
                desc: 'Receive faculty feedback and evaluation results. Use insights to improve your project outcomes and skills.',
                bg: 'linear-gradient(135deg,#dc2626,#f43f5e)',
              },
            ].map((step, i) => (
              <div className="hp-timeline__step" key={i}>
                <div className="hp-timeline__number" style={{ background: step.bg, boxShadow: `0 4px 20px ${step.bg.includes('#0284c7') ? 'rgba(2,132,199,0.3)' : 'rgba(0,0,0,0.3)'}` }}>
                  {step.num}
                </div>
                <div className="hp-timeline__info">
                  <h3 className="hp-timeline__title">{step.title}</h3>
                  <p className="hp-timeline__desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FOR STUDENTS ───── */}
      <section className="hp-section" id="for-students">
        <div className="hp-section__container">
          <div className="hp-role-section">
            <div className="hp-role__text">
              <div className="hp-role__badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                <GraduationCap size={13} /> For Students
              </div>
              <h2 className="hp-role__title">Your Academic Projects, Organized</h2>
              <p className="hp-role__desc">
                Stop juggling scattered tools. ProjectFlow gives you one clear workspace to understand requirements,
                coordinate with teammates, and deliver outstanding project work.
              </p>
              <div className="hp-role__features">
                {[
                  'Understand project requirements and guidelines in one place',
                  'Coordinate with teammates on tasks and deadlines',
                  'Track progress across all assigned tasks',
                  'Manage and submit project deliverables',
                  'Follow relevant GitHub activity and commits',
                  'Review faculty feedback and evaluation results',
                ].map((item, i) => (
                  <div className="hp-role__feature-item" key={i}>
                    <div className="hp-role__feature-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button className="hp-role__cta" style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 4px 14px rgba(5,150,105,0.35)' }} onClick={() => onNavigateToAuth('register')}>
                Start as Student <ArrowRight size={16} />
              </button>
            </div>

            <div className="hp-role__preview">
              <div className="hp-role__preview-header">
                <div className="hp-role__preview-dot" style={{ background: '#f43f5e' }} />
                <div className="hp-role__preview-dot" style={{ background: '#f59e0b' }} />
                <div className="hp-role__preview-dot" style={{ background: '#10b981' }} />
                <span style={{ marginLeft: 12, fontSize: '0.72rem', color: '#64748b' }}>Student Dashboard</span>
              </div>
              <div className="hp-role__preview-body">
                <div className="hp-mock-row">
                  <BookOpen size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
                  <div className="hp-mock-col">
                    <div className="hp-mock-title">CS543 — Web Services</div>
                    <div className="hp-mock-subtitle">Team Alpha · 4 members · 12 tasks</div>
                  </div>
                  <div className="hp-mock-badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>Active</div>
                </div>
                <div className="hp-mock-row">
                  <Bell size={14} style={{ color: '#fbbf24', flexShrink: 0 }} />
                  <div className="hp-mock-col">
                    <div className="hp-mock-title">New Announcement: Team Formation Guidelines</div>
                    <div className="hp-mock-subtitle">Dr. R. Sharma · 2 hours ago</div>
                  </div>
                </div>
                <div className="hp-mock-row">
                  <ListTodo size={14} style={{ color: '#a78bfa', flexShrink: 0 }} />
                  <div className="hp-mock-col">
                    <div className="hp-mock-title">Upcoming: Architecture Design Doc</div>
                    <div className="hp-mock-subtitle">Due Oct 22 · High Priority</div>
                  </div>
                  <div className="hp-mock-badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>Due Soon</div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div className="hp-mock-subtitle" style={{ marginBottom: 4 }}>Overall Progress</div>
                  <div className="hp-mock-progress">
                    <div className="hp-mock-progress__fill" style={{ width: '65%', background: 'linear-gradient(90deg,#059669,#10b981)' }} />
                  </div>
                  <div className="hp-mock-subtitle" style={{ marginTop: 4 }}>65% complete · 8 / 12 tasks done</div>
                </div>
              </div>
              <div className="hp-role__preview-label">Illustrative student workspace preview</div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FOR FACULTY ───── */}
      <section className="hp-section" id="for-faculty" style={{ background: 'rgba(15,20,35,0.4)' }}>
        <div className="hp-section__container">
          <div className="hp-role-section hp-role-section--reverse">
            <div className="hp-role__text">
              <div className="hp-role__badge" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.25)' }}>
                <School size={13} /> For Faculty
              </div>
              <h2 className="hp-role__title">Supervise With Clarity</h2>
              <p className="hp-role__desc">
                ProjectFlow helps faculty members organize course projects, communicate with students,
                review submissions, and provide structured evaluations — all from one dashboard.
              </p>
              <div className="hp-role__features">
                {[
                  'Organize course and project information centrally',
                  'Broadcast announcements to enrolled students',
                  'Monitor student project progress and milestones',
                  'Review project submissions and deliverables',
                  'Provide structured feedback and evaluations',
                  'Use configurable assessment criteria',
                ].map((item, i) => (
                  <div className="hp-role__feature-item" key={i}>
                    <div className="hp-role__feature-icon" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button className="hp-role__cta" style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)', boxShadow: '0 4px 14px rgba(2,132,199,0.35)' }} onClick={() => onNavigateToAuth('register')}>
                Start as Faculty <ArrowRight size={16} />
              </button>
            </div>

            <div className="hp-role__preview">
              <div className="hp-role__preview-header">
                <div className="hp-role__preview-dot" style={{ background: '#f43f5e' }} />
                <div className="hp-role__preview-dot" style={{ background: '#f59e0b' }} />
                <div className="hp-role__preview-dot" style={{ background: '#10b981' }} />
                <span style={{ marginLeft: 12, fontSize: '0.72rem', color: '#64748b' }}>Faculty Dashboard</span>
              </div>
              <div className="hp-role__preview-body">
                <div className="hp-mock-row">
                  <FolderGit2 size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
                  <div className="hp-mock-col">
                    <div className="hp-mock-title">Team Alpha — Microservices Architecture</div>
                    <div className="hp-mock-subtitle">CS543 · 4 members · Last activity 2h ago</div>
                  </div>
                  <div className="hp-mock-badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>On Track</div>
                </div>
                <div className="hp-mock-row">
                  <FolderGit2 size={14} style={{ color: '#6366f1', flexShrink: 0 }} />
                  <div className="hp-mock-col">
                    <div className="hp-mock-title">Team Beta — E-Commerce Platform</div>
                    <div className="hp-mock-subtitle">CS543 · 5 members · Submission pending</div>
                  </div>
                  <div className="hp-mock-badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>Review</div>
                </div>
                <div className="hp-mock-row">
                  <Award size={14} style={{ color: '#a78bfa', flexShrink: 0 }} />
                  <div className="hp-mock-col">
                    <div className="hp-mock-title">Evaluations: 4 / 6 completed</div>
                    <div style={{ marginTop: 4 }}>
                      <div className="hp-mock-progress">
                        <div className="hp-mock-progress__fill" style={{ width: '67%', background: 'linear-gradient(90deg,#6366f1,#a78bfa)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hp-role__preview-label">Illustrative faculty dashboard preview</div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FOR COORDINATORS ───── */}
      <section className="hp-section" id="for-coordinators">
        <div className="hp-section__container">
          <div className="hp-role-section">
            <div className="hp-role__text">
              <div className="hp-role__badge" style={{ background: 'rgba(244,63,94,0.1)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.25)' }}>
                <ShieldCheck size={13} /> For Coordinators
              </div>
              <h2 className="hp-role__title">Oversee the Bigger Picture</h2>
              <p className="hp-role__desc">
                Coordinators can manage user accounts, oversee faculty assignments,
                and ensure academic project workflows run smoothly across the institution.
              </p>
              <div className="hp-role__features">
                {[
                  'Manage student and faculty accounts',
                  'Oversee faculty-course assignments',
                  'View all projects across courses',
                  'Ensure evaluation criteria consistency',
                ].map((item, i) => (
                  <div className="hp-role__feature-item" key={i}>
                    <div className="hp-role__feature-icon" style={{ background: 'rgba(244,63,94,0.1)', color: '#fb7185' }}>
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button className="hp-role__cta" style={{ background: 'linear-gradient(135deg,#e11d48,#be123c)', boxShadow: '0 4px 14px rgba(225,29,72,0.35)' }} onClick={() => onNavigateToAuth('login')}>
                Coordinator Access <ArrowRight size={16} />
              </button>
            </div>

            <div className="hp-role__preview">
              <div className="hp-role__preview-header">
                <div className="hp-role__preview-dot" style={{ background: '#f43f5e' }} />
                <div className="hp-role__preview-dot" style={{ background: '#f59e0b' }} />
                <div className="hp-role__preview-dot" style={{ background: '#10b981' }} />
                <span style={{ marginLeft: 12, fontSize: '0.72rem', color: '#64748b' }}>Admin Console</span>
              </div>
              <div className="hp-role__preview-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)' }}>
                    <div className="hp-mock-subtitle">Total Users</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>86</div>
                  </div>
                  <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                    <div className="hp-mock-subtitle">Active Projects</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399', marginTop: 4 }}>12</div>
                  </div>
                </div>
                <div className="hp-mock-row">
                  <Users size={14} style={{ color: '#a78bfa', flexShrink: 0 }} />
                  <div className="hp-mock-col">
                    <div className="hp-mock-title">Faculty Assignments</div>
                    <div className="hp-mock-subtitle">3 faculty · 4 courses · All assigned</div>
                  </div>
                  <div className="hp-mock-badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>Active</div>
                </div>
              </div>
              <div className="hp-role__preview-label">Illustrative coordinator console preview</div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── PRODUCT SHOWCASE ───── */}
      <ShowcaseSection />

      {/* ───── WHY PROJECTFLOW ───── */}
      <section className="hp-section hp-why" id="why">
        <div className="hp-section__container">
          <div className="hp-section__header">
            <div className="hp-section__eyebrow"><Sparkles size={14} /> Why ProjectFlow?</div>
            <h2 className="hp-section__title">From Scattered to Streamlined</h2>
            <p className="hp-section__desc">
              Academic project work often gets scattered across emails, chat groups, spreadsheets, and repositories.
              ProjectFlow brings it all together.
            </p>
          </div>

          <div className="hp-why__content">
            <div className="hp-why__problem">
              <div className="hp-why__problem-title">
                <XCircle size={18} /> Without ProjectFlow
              </div>
              <ul className="hp-why__problem-list">
                {[
                  'Tasks scattered across emails, chats, and spreadsheets',
                  'Unclear project requirements and deadlines',
                  'Disconnected feedback from faculty',
                  'No visibility into team member contributions',
                  'Submissions lost or submitted to wrong channels',
                  'Evaluation criteria unclear until grading time',
                ].map((item, i) => (
                  <li className="hp-why__problem-item" key={i}>
                    <XCircle size={14} style={{ color: '#f43f5e', flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hp-why__solution">
              <div className="hp-why__solution-title">
                <CircleCheck size={18} /> With ProjectFlow
              </div>
              <ul className="hp-why__solution-list">
                {[
                  'All project work organized in one workspace',
                  'Clear requirements, timelines, and deliverables',
                  'Structured faculty feedback and evaluations',
                  'GitHub activity linked to project milestones',
                  'Streamlined submission workflow with status tracking',
                  'Transparent evaluation criteria from the start',
                ].map((item, i) => (
                  <li className="hp-why__solution-item" key={i}>
                    <CircleCheck size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="hp-section" id="reviews" style={{ background: 'rgba(15,20,35,0.4)' }}>
        <div className="hp-section__container">
          <div className="hp-section__header">
            <div className="hp-section__eyebrow"><Heart size={14} /> Reviews</div>
            <h2 className="hp-section__title">What Users Say</h2>
            <p className="hp-section__desc">
              Hear from the students, faculty, and coordinators who use ProjectFlow.
            </p>
          </div>

          <div className="hp-testimonials-grid">
            {[
              {
                quote: 'ProjectFlow made our team project so much easier to manage. We could see all tasks, deadlines, and submissions in one place instead of juggling between apps.',
                name: 'Sample Student',
                role: 'Student, Computer Science',
                initials: 'SS',
                color: '#059669',
              },
              {
                quote: 'Being able to review submissions, provide feedback, and track evaluation all in one platform has saved me significant time during the review cycle.',
                name: 'Sample Faculty',
                role: 'Faculty Member',
                initials: 'SF',
                color: '#0284c7',
              },
              {
                quote: 'As a coordinator, having oversight of all projects and faculty assignments in one dashboard makes academic program management much more transparent.',
                name: 'Sample Coordinator',
                role: 'Program Coordinator',
                initials: 'SC',
                color: '#dc2626',
              },
            ].map((t, i) => (
              <div className="hp-testimonial-card" key={i}>
                <p className="hp-testimonial__quote">{t.quote}</p>
                <div className="hp-testimonial__author">
                  <div className="hp-testimonial__avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="hp-testimonial__name">{t.name}</div>
                    <div className="hp-testimonial__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="hp-testimonials__note">
            Sample testimonials shown for development purposes. Replace with approved real reviews when available.
          </p>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="hp-section" id="faq">
        <div className="hp-section__container">
          <div className="hp-section__header">
            <div className="hp-section__eyebrow"><MessageSquare size={14} /> FAQ</div>
            <h2 className="hp-section__title">Frequently Asked Questions</h2>
          </div>

          <div className="hp-faq">
            <FAQItem
              question="What is ProjectFlow?"
              answer="ProjectFlow is a microservice-based platform for managing academic software projects. It connects students, faculty, and coordinators throughout the academic project lifecycle — from team formation and task management to submissions, GitHub integration, and faculty evaluation."
            />
            <FAQItem
              question="Who can use ProjectFlow?"
              answer="ProjectFlow is designed for three main roles: Students (project members and team leads), Faculty (evaluators and supervisors), and Coordinators/Administrators (who manage users, assignments, and oversight). Each role has a dedicated dashboard and appropriate access permissions."
            />
            <FAQItem
              question="Can visitors explore the website without registering?"
              answer="Yes! This homepage and all public information sections are fully accessible without an account. You can explore features, learn about the platform, and understand how it works. Registration is only required to access protected features like your personal dashboard, courses, teams, and project submissions."
            />
            <FAQItem
              question="How does ProjectFlow support student teams?"
              answer="Students can form teams of 4–5 members within their enrolled courses. The platform validates team composition (same batch, unique roll numbers, course enrollment) and supports team creation, joining, and management through a structured workflow."
            />
            <FAQItem
              question="How do faculty members review projects?"
              answer="Faculty members have a dedicated dashboard to view assigned projects, review submissions, monitor GitHub activity and evidence, provide structured feedback, and complete evaluations using configurable assessment criteria."
            />
            <FAQItem
              question="Does ProjectFlow integrate with GitHub?"
              answer="Yes, ProjectFlow includes a GitHub integration service that can connect to project repositories, surface commit activity, and provide evidence for milestone evaluation. The integration requires proper configuration to function."
            />
            <FAQItem
              question="Do I need an account to access project work?"
              answer="Yes. All project-related data including courses, teams, tasks, submissions, and evaluations are protected and require authentication. You must register and log in with valid credentials to access your academic workspace."
            />
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="hp-final-cta">
        <div className="hp-final-cta__bg" />
        <div className="hp-final-cta__container">
          <h2 className="hp-final-cta__title">
            Bring Your Academic Projects{' '}
            <span className="hp-hero__title-accent">Into Flow.</span>
          </h2>
          <p className="hp-final-cta__desc">
            Join the platform designed to make academic project management clear, organized, and effective for everyone involved.
          </p>
          <div className="hp-final-cta__buttons">
            <button className="hp-cta-primary" onClick={() => onNavigateToAuth('register')}>
              Get Started Free <ArrowRight size={18} />
            </button>
            <button className="hp-cta-secondary" onClick={() => scrollTo('features')}>
              Explore Features <Layers size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="hp-footer" role="contentinfo">
        <div className="hp-footer__container">
          <div className="hp-footer__grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="hp-header__logo-icon" style={{ width: 36, height: 36 }}>
                  <FolderGit2 size={18} />
                </div>
                <span className="hp-header__logo-text" style={{ fontSize: '1.15rem' }}>Project<span>Flow</span></span>
              </div>
              <p className="hp-footer__brand-desc">
                A microservice-based platform for managing academic software projects, tasks, evaluations, and GitHub integrations throughout the project lifecycle.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="hp-footer__col-title">Navigation</h4>
              <ul className="hp-footer__links">
                {['Features', 'How It Works', 'Reviews', 'FAQ'].map(label => (
                  <li key={label}>
                    <button className="hp-footer__link" onClick={() => scrollTo(label.toLowerCase().replace(/ /g, '-'))}>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Roles */}
            <div>
              <h4 className="hp-footer__col-title">For Users</h4>
              <ul className="hp-footer__links">
                <li><button className="hp-footer__link" onClick={() => scrollTo('for-students')}>For Students</button></li>
                <li><button className="hp-footer__link" onClick={() => scrollTo('for-faculty')}>For Faculty</button></li>
                <li><button className="hp-footer__link" onClick={() => scrollTo('for-coordinators')}>For Coordinators</button></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="hp-footer__col-title">Account</h4>
              <ul className="hp-footer__links">
                <li><button className="hp-footer__link" onClick={() => onNavigateToAuth('login')}>Log In</button></li>
                <li><button className="hp-footer__link" onClick={() => onNavigateToAuth('register')}>Register</button></li>
              </ul>
            </div>
          </div>

          <div className="hp-footer__bottom">
            <span className="hp-footer__copyright">© {new Date().getFullYear()} ProjectFlow. Academic Project Management Platform.</span>
            <span className="hp-footer__tag">
              <Zap size={12} /> Built for academic excellence
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
