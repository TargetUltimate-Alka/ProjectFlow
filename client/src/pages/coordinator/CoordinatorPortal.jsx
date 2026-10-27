import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, Building2, CalendarDays, CheckCircle2,
  ClipboardList, Globe2, GraduationCap, MapPin, Plus, RefreshCw, School, Users
} from 'lucide-react';

const emptyInstitution = { name: '', type: 'college', city: '', state: '', country: '', address: '', website: '', description: '', logoUrl: '', coverUrl: '', galleryUrls: '' };

function Field({ label, children }) {
  return <label className="coord-field"><span>{label}</span>{children}</label>;
}

function PublicInstitutionPage({ institutionId }) {
  const { user } = useAuth();
  const [institution, setInstitution] = useState(null);
  const [error, setError] = useState('');
  const [slide, setSlide] = useState(0);
  const [membership, setMembership] = useState('none');
  const [membershipBusy, setMembershipBusy] = useState(false);
  const [membershipMessage, setMembershipMessage] = useState('');
  useEffect(() => {
    api.getInstitution(institutionId).then(setInstitution).catch(err => setError(err.message));
  }, [institutionId]);
  useEffect(() => {
    if (user?.role?.toLowerCase() === 'faculty') api.getInstitutionMembership(institutionId).then(result => setMembership(result.status)).catch(() => {});
  }, [institutionId, user?.role]);
  const requestMembership = async () => {
    setMembershipBusy(true); setMembershipMessage('');
    try { const result = await api.requestInstitutionMembership(institutionId); setMembership(result.status); setMembershipMessage(result.message); }
    catch (err) { setMembershipMessage(err.message); }
    finally { setMembershipBusy(false); }
  };
  const images = useMemo(() => [institution?.coverUrl, ...(institution?.gallery || []).map(item => typeof item === 'string' ? item : item.url)].filter(Boolean), [institution]);
  if (error) return <section className="coord-public-shell"><p role="alert">{error}</p><a href="/">Return to ProjectFlow</a></section>;
  if (!institution) return <section className="coord-public-shell" aria-live="polite">Loading institution profile…</section>;
  return (
    <main className="coord-public-shell">
      <a className="coord-back-link" href="/">← ProjectFlow</a>
      <section className="coord-public-hero" style={images[slide] ? { backgroundImage: `linear-gradient(90deg, rgba(9,13,22,.94), rgba(9,13,22,.30)), url("${images[slide]}")` } : undefined}>
        <div className="coord-public-identity">
          {institution.logoUrl ? <img className="coord-institution-logo" src={institution.logoUrl} alt={`${institution.name} logo`} /> : <div className="coord-institution-logo coord-logo-fallback"><Building2 /></div>}
          <div><span className="coord-eyebrow">{institution.type} profile</span><h1>{institution.name}</h1><p><MapPin size={16} /> {[institution.city, institution.state, institution.country].filter(Boolean).join(', ') || 'Location not provided'}</p></div>
          {user?.role?.toLowerCase() === 'faculty' && <div className="coord-membership-action"><button className="btn btn-primary" disabled={membershipBusy || membership !== 'none'} onClick={requestMembership}>{membershipBusy ? 'Sending…' : membership === 'pending' ? 'Request pending' : membership === 'approved' ? 'Institution member' : membership === 'rejected' ? 'Request declined' : 'Request to join'}</button>{membershipMessage && <small role="status">{membershipMessage}</small>}</div>}
        </div>
        {images.length > 1 && <div className="coord-carousel-controls"><button aria-label="Previous image" onClick={() => setSlide((slide + images.length - 1) % images.length)}><ArrowLeft /></button><span>{slide + 1} / {images.length}</span><button aria-label="Next image" onClick={() => setSlide((slide + 1) % images.length)}><ArrowRight /></button></div>}
      </section>
      {!images.length && <div className="coord-empty-gallery"><Building2 /><span>No campus photographs have been published yet.</span></div>}
      <div className="coord-public-grid">
        <section className="coord-panel coord-public-about"><span className="coord-eyebrow">About the institution</span><h2>Learning, research and community</h2><p>{institution.description || 'This institution has not published an overview yet.'}</p>{institution.website && <a href={institution.website} target="_blank" rel="noreferrer"><Globe2 size={16} /> Official website</a>}</section>
        <section className="coord-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">Academic structure</span><h2>Branches & programs</h2></div><span className="coord-count">{institution.branches?.length || 0}</span></div>{institution.branches?.length ? <div className="coord-program-list">{institution.branches.map(branch => <article key={branch.id}><School size={18} /><div><strong>{branch.name}</strong><small>{branch.code || 'Branch'}{branch.programs?.length ? ` · ${branch.programs.join(', ')}` : ''}</small></div></article>)}</div> : <p className="coord-muted">Academic programs have not been published.</p>}</section>
        <section className="coord-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">Institution leadership</span><h2>Coordinators</h2></div><span className="coord-count">{institution.coordinatorCount || 0}</span></div>{institution.coordinators?.length ? <div className="coord-people-list">{institution.coordinators.map(person => <article key={person.id}><div className="coord-avatar">{person.name?.split(' ').map(part => part[0]).join('').slice(0, 2)}</div><div><strong>{person.name}</strong><small>{person.designation || 'Institution coordinator'}{person.department ? ` · ${person.department}` : ''}</small>{person.bio && <p>{person.bio}</p>}</div></article>)}</div> : <p className="coord-muted">No public coordinator profiles are available.</p>}</section>
        <section className="coord-panel"><span className="coord-eyebrow">Placement information</span><h2>Published reports</h2><p className="coord-muted">Placement information has not been published by this institution.</p></section>
      </div>
    </main>
  );
}

export { PublicInstitutionPage };

export function InstitutionDirectoryPage() {
  const [search, setSearch] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const timer = setTimeout(() => api.getInstitutions(search).then(rows => { if (active) setInstitutions(rows); }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); }), 180);
    return () => { active = false; clearTimeout(timer); };
  }, [search]);
  return <main className="coord-public-shell"><a className="coord-back-link" href="/">← ProjectFlow</a><div className="coord-page-head"><div><span className="coord-eyebrow">PROJECTFLOW DIRECTORY</span><h1>Find your institution</h1><p>Browse institution profiles and their published academic programs.</p></div></div><label className="coord-directory-search"><span className="sr-only">Search institutions</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by institution name" /></label>{error && <div className="coord-alert coord-alert-error" role="alert">{error}</div>}{loading ? <p className="coord-muted">Searching institutions…</p> : institutions.length ? <div className="coord-directory-grid">{institutions.map(row => <a className="coord-directory-card" key={row.id} href={`/institutions/${row.id}`}><div className="coord-directory-cover" style={row.coverUrl ? { backgroundImage: `linear-gradient(90deg,rgba(9,13,22,.4),rgba(9,13,22,.05)),url("${row.coverUrl}")` } : undefined}>{row.logoUrl ? <img src={row.logoUrl} alt="" /> : <Building2 />}</div><span className="coord-eyebrow">{row.type}</span><h2>{row.name}</h2><p><MapPin size={14} /> {[row.city, row.state, row.country].filter(Boolean).join(', ') || 'Location not provided'}</p><span className="coord-directory-cta">View profile <ArrowRight size={15} /></span></a>)}</div> : <section className="coord-panel"><h2>No matching institutions</h2><p className="coord-muted">Try a different name, or ask an authorized coordinator to create the institution profile.</p></section>}</main>;
}

export function CoordinatorPortal({ activeTab, user }) {
  const [overview, setOverview] = useState(null);
  const [branches, setBranches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [institutionForm, setInstitutionForm] = useState(emptyInstitution);
  const [branchForm, setBranchForm] = useState({ name: '', code: '', programs: '' });
  const [sessionForm, setSessionForm] = useState({ name: '', startYear: '', endYear: '' });
  const [batchForm, setBatchForm] = useState({ name: '', branchId: '', sessionId: '', cohortYear: '', description: '' });
  const [membershipRequests, setMembershipRequests] = useState([]);
  const [editingInstitution, setEditingInstitution] = useState(false);

  const refresh = async () => {
    setLoading(true); setError('');
    try {
      const [summary, branchRows, sessionRows, batchRows, requests] = await Promise.all([
        api.getCoordinatorOverview(), api.getCoordinatorBranches(), api.getCoordinatorSessions(), api.getCoordinatorBatches(), api.getCoordinatorMemberships()
      ]);
      setOverview(summary); setBranches(branchRows); setSessions(sessionRows); setBatches(batchRows); setMembershipRequests(requests);
      if (summary.institution) setInstitutionForm({ ...emptyInstitution, ...summary.institution, galleryUrls: (summary.institution.gallery || []).join(', ') });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const save = async (action, message, reset) => {
    setBusy(true); setError(''); setSuccess('');
    try { await action(); reset?.(); setSuccess(message); await refresh(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const institution = overview?.institution;
  const pageMap = {
    'coordinator-overview': ['Your institution, at a glance', 'A clear view of your academic setup and recent activity.'],
    'coordinator-institution': ['Institution profile', 'Set up the official profile shown to your community.'],
    'coordinator-branches': ['Branches & programs', 'Organize departments and the programs each branch offers.'],
    'coordinator-sessions': ['Academic sessions', 'Manage the academic calendar for your institution.'],
    'coordinator-batches': ['Batches', 'Create cohorts and keep their branch and session connected.'],
    'coordinator-faculty': ['Faculty directory', 'Faculty associated with your institution.'],
    'coordinator-coordinators': ['Coordinator directory', 'People with coordinator access at your institution.'],
    'coordinator-activity': ['Activity & monitoring', 'Recent changes within your authorized scope.']
  };
  const [title, subtitle] = pageMap[activeTab] || pageMap['coordinator-overview'];

  if (loading && !overview) return <div className="coord-loading" role="status"><RefreshCw className="coord-spin" /> Loading your coordinator workspace…</div>;
  return (
    <div className="coord-page">
      <div className="coord-page-head"><div><span className="coord-eyebrow">COORDINATOR WORKSPACE</span><h1>{title}</h1><p>{subtitle}</p></div><button className="btn btn-secondary" onClick={refresh} aria-label="Refresh coordinator data"><RefreshCw size={16} /> Refresh</button></div>
      {error && <div className="coord-alert coord-alert-error" role="alert">{error}<button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
      {success && <div className="coord-alert coord-alert-success" role="status"><CheckCircle2 size={17} />{success}<button onClick={() => setSuccess('')} aria-label="Dismiss message">×</button></div>}

      {activeTab === 'coordinator-overview' && <>
        {!institution ? <section className="coord-panel coord-setup-banner"><div className="coord-setup-icon"><Building2 /></div><div><span className="coord-eyebrow">FIRST STEP</span><h2>Set up your institution</h2><p>Create its official profile, then add branches, academic sessions and batches as you are ready.</p></div><button className="btn btn-primary" onClick={() => document.getElementById('institution-setup')?.scrollIntoView({ behavior: 'smooth' })}><Plus size={16} /> Create institution</button></section> : <section className="coord-welcome"><div className="coord-welcome-copy"><span className="coord-eyebrow">{institution.type} · {institution.city || 'Institution workspace'}</span><h2>Welcome back, {user?.name?.split(' ')[0] || 'Coordinator'}.</h2><p>{institution.name} is ready for your next setup step.</p></div><div className="coord-welcome-mark"><Building2 /></div></section>}
        <div className="coord-stat-grid">
          {[['Branches', overview?.stats?.branches || 0, School, 'coordinator-branches'], ['Academic sessions', overview?.stats?.sessions || 0, CalendarDays, 'coordinator-sessions'], ['Batches', overview?.stats?.batches || 0, ClipboardList, 'coordinator-batches'], ['Faculty', overview?.stats?.faculty || 0, Users, 'coordinator-faculty'], ['Coordinators', overview?.stats?.coordinators || 0, GraduationCap, 'coordinator-coordinators']].map(([label, value, Icon, target]) => <button className="coord-stat-card" key={label} onClick={() => window.dispatchEvent(new CustomEvent('projectflow:navigate', { detail: target }))}><span className="coord-stat-icon"><Icon size={20} /></span><span className="coord-stat-value">{value}</span><span className="coord-stat-label">{label}</span><ArrowRight className="coord-stat-arrow" size={16} /></button>)}
        </div>
        {!institution && <InstitutionForm id="institution-setup" form={institutionForm} setForm={setInstitutionForm} busy={busy} onSubmit={e => { e.preventDefault(); const { galleryUrls, ...details } = institutionForm; details.gallery = galleryUrls.split(',').map(url => url.trim()).filter(Boolean); save(() => api.createInstitution(details), 'Institution profile created.', () => { setInstitutionForm(emptyInstitution); window.location.reload(); }); }} />}
        <div className="coord-content-grid"><section className="coord-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">RECENT SETUP</span><h2>Recently created batches</h2></div><button className="coord-text-button" onClick={() => window.dispatchEvent(new CustomEvent('projectflow:navigate', { detail: 'coordinator-batches' }))}>View all <ArrowRight size={15} /></button></div>{overview?.batches?.length ? <div className="coord-batch-list">{overview.batches.map(batch => <article key={batch._id || batch.id}><span className="coord-batch-symbol"><BookOpen size={18} /></span><div><strong>{batch.name}</strong><small>{batch.branchName} · {batch.sessionName}</small></div><span className="coord-status">Active</span></article>)}</div> : <p className="coord-muted">No batches created yet. Set up a session and branch to get started.</p>}</section><section className="coord-panel coord-activity-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">NEXT STEPS</span><h2>Setup checklist</h2></div><Activity size={18} /></div><div className="coord-checklist">{[['Create institution profile', Boolean(institution)], ['Add an academic branch', branches.length > 0], ['Configure an academic session', sessions.length > 0], ['Create your first batch', batches.length > 0]].map(([label, done]) => <div key={label}><span className={done ? 'coord-check coord-check-done' : 'coord-check'}>{done ? <CheckCircle2 size={16} /> : <span />}</span><span>{label}</span><small>{done ? 'Done' : 'To do'}</small></div>)}</div></section></div>
      </>}

      {activeTab === 'coordinator-institution' && <>{institution && !editingInstitution ? <><InstitutionSummary institution={institution} /><section className="coord-panel coord-public-link-panel"><div><span className="coord-eyebrow">PROFILE MANAGEMENT</span><h2>Keep public details current</h2></div><button className="btn btn-secondary" onClick={() => setEditingInstitution(true)}>Edit institution profile</button></section></> : <InstitutionForm form={institutionForm} setForm={setInstitutionForm} busy={busy} submitLabel={institution ? 'Save changes' : 'Create institution'} onSubmit={e => { e.preventDefault(); const { galleryUrls, ...details } = institutionForm; details.gallery = galleryUrls.split(',').map(url => url.trim()).filter(Boolean); if (institution) save(() => api.updateCoordinatorInstitution(institution.id || institution._id, details), 'Institution profile updated.', () => setEditingInstitution(false)); else save(() => api.createInstitution(details), 'Institution profile created.', () => window.location.reload()); }} />}</>}
      {activeTab === 'coordinator-branches' && <><form className="coord-panel coord-form" onSubmit={e => { e.preventDefault(); save(() => api.createCoordinatorBranch({ ...branchForm, programs: branchForm.programs.split(',').map(x => x.trim()).filter(Boolean) }), 'Branch added.', () => setBranchForm({ name: '', code: '', programs: '' })); }}><div className="coord-section-heading"><div><span className="coord-eyebrow">ACADEMIC STRUCTURE</span><h2>Add a branch</h2></div></div><div className="coord-form-grid"><Field label="Branch name"><input required value={branchForm.name} onChange={e => setBranchForm({ ...branchForm, name: e.target.value })} placeholder="Computer Science & Engineering" /></Field><Field label="Branch code"><input value={branchForm.code} onChange={e => setBranchForm({ ...branchForm, code: e.target.value })} placeholder="CSE" /></Field><Field label="Programs offered"><input value={branchForm.programs} onChange={e => setBranchForm({ ...branchForm, programs: e.target.value })} placeholder="B.Tech, M.Tech (comma separated)" /></Field><button className="btn btn-primary" disabled={busy || !institution}><Plus size={16} /> Add branch</button></div>{!institution && <p className="coord-muted">Create an institution profile first.</p>}</form><BranchList branches={branches} /></>}
      {activeTab === 'coordinator-sessions' && <><form className="coord-panel coord-form" onSubmit={e => { e.preventDefault(); save(() => api.createCoordinatorSession(sessionForm), 'Academic session added.', () => setSessionForm({ name: '', startYear: '', endYear: '' })); }}><div className="coord-section-heading"><div><span className="coord-eyebrow">ACADEMIC CALENDAR</span><h2>Add an academic session</h2></div></div><div className="coord-form-grid"><Field label="Session name"><input required value={sessionForm.name} onChange={e => setSessionForm({ ...sessionForm, name: e.target.value })} placeholder="2026–2027" /></Field><Field label="Start year"><input type="number" min="1900" max="2200" value={sessionForm.startYear} onChange={e => setSessionForm({ ...sessionForm, startYear: e.target.value })} /></Field><Field label="End year"><input type="number" min="1900" max="2200" value={sessionForm.endYear} onChange={e => setSessionForm({ ...sessionForm, endYear: e.target.value })} /></Field><button className="btn btn-primary" disabled={busy || !institution}><Plus size={16} /> Add session</button></div></form><section className="coord-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">YOUR SESSIONS</span><h2>Academic sessions</h2></div></div>{sessions.length ? <div className="coord-program-list">{sessions.map(row => <article key={row._id || row.id}><CalendarDays size={18} /><div><strong>{row.name}</strong><small>{row.startYear && row.endYear ? `${row.startYear} – ${row.endYear}` : 'Active session'}</small></div><span className="coord-status">{row.status}</span></article>)}</div> : <p className="coord-muted">No academic sessions have been created.</p>}</section></>}
      {activeTab === 'coordinator-batches' && <><form className="coord-panel coord-form" onSubmit={e => { e.preventDefault(); save(() => api.createCoordinatorBatch(batchForm), 'Batch created.', () => setBatchForm({ name: '', branchId: '', sessionId: '', cohortYear: '', description: '' })); }}><div className="coord-section-heading"><div><span className="coord-eyebrow">COHORT MANAGEMENT</span><h2>Create a batch</h2></div></div><div className="coord-form-grid"><Field label="Batch name"><input required value={batchForm.name} onChange={e => setBatchForm({ ...batchForm, name: e.target.value })} placeholder="CSE 2026" /></Field><Field label="Branch"><select required value={batchForm.branchId} onChange={e => setBatchForm({ ...batchForm, branchId: e.target.value })}><option value="">Select branch</option>{branches.map(row => <option key={row._id || row.id} value={row._id || row.id}>{row.name}</option>)}</select></Field><Field label="Academic session"><select required value={batchForm.sessionId} onChange={e => setBatchForm({ ...batchForm, sessionId: e.target.value })}><option value="">Select session</option>{sessions.map(row => <option key={row._id || row.id} value={row._id || row.id}>{row.name}</option>)}</select></Field><Field label="Cohort year"><input type="number" min="1900" max="2200" value={batchForm.cohortYear} onChange={e => setBatchForm({ ...batchForm, cohortYear: e.target.value })} /></Field><Field label="Description"><input value={batchForm.description} onChange={e => setBatchForm({ ...batchForm, description: e.target.value })} /></Field><button className="btn btn-primary" disabled={busy || !institution || !branches.length || !sessions.length}><Plus size={16} /> Create batch</button></div>{(!branches.length || !sessions.length) && <p className="coord-muted">Add a branch and academic session before creating a batch.</p>}</form><section className="coord-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">SAVED COHORTS</span><h2>All batches <span className="coord-count">{batches.length}</span></h2></div><input className="coord-search" aria-label="Search batches" placeholder="Search batches" onChange={e => document.querySelectorAll('[data-batch]').forEach(item => { item.hidden = !item.dataset.batch.toLowerCase().includes(e.target.value.toLowerCase()); })} /></div>{batches.length ? <div className="coord-table-wrap"><table className="data-table"><thead><tr><th>Batch</th><th>Branch</th><th>Academic session</th><th>Students</th><th>Status</th></tr></thead><tbody>{batches.map(row => <tr key={row._id || row.id} data-batch={`${row.name} ${row.branchName} ${row.sessionName}`}><td><strong>{row.name}</strong>{row.cohortYear && <small className="coord-cell-sub">Cohort {row.cohortYear}</small>}</td><td>{row.branchName}</td><td>{row.sessionName}</td><td>—</td><td><span className="coord-status">{row.status}</span></td></tr>)}</tbody></table></div> : <p className="coord-muted">No batches yet. Add a branch and academic session, then create your first batch.</p>}</section></>}
      {activeTab === 'coordinator-faculty' && <><PeopleList title="Faculty directory" people={overview?.faculty || []} empty="No faculty accounts are associated with this institution yet." />{institution && <section className="coord-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">MEMBERSHIP REVIEW</span><h2>Faculty join requests <span className="coord-count">{membershipRequests.length}</span></h2></div></div>{membershipRequests.length ? <div className="coord-people-list">{membershipRequests.map(request => <article key={request.id}><div className="coord-avatar">{request.faculty.name?.split(' ').map(part => part[0]).join('').slice(0, 2)}</div><div><strong>{request.faculty.name}</strong><small>{request.faculty.department || 'Faculty'} · Requested {new Date(request.requestedAt).toLocaleDateString()}</small></div><button className="btn btn-sm btn-emerald" disabled={busy} onClick={() => save(() => api.reviewCoordinatorMembership(request.id, 'approved'), 'Faculty membership approved.')}>Approve</button><button className="btn btn-sm btn-secondary" disabled={busy} onClick={() => save(() => api.reviewCoordinatorMembership(request.id, 'rejected'), 'Membership request declined.')}>Decline</button></article>)}</div> : <p className="coord-muted">There are no pending faculty join requests.</p>}</section>}</>}
      {activeTab === 'coordinator-coordinators' && <PeopleList title="Coordinator directory" people={overview?.coordinators || []} empty="No coordinator accounts are associated with this institution yet." />}
      {activeTab === 'coordinator-activity' && <section className="coord-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">RECENT CHANGES</span><h2>Activity in your institution</h2></div><Activity size={18} /></div><p className="coord-muted">Academic project and evaluation monitoring will appear here when institution-linked course records are available.</p></section>}
      {activeTab === 'coordinator-institution' && institution && <section className="coord-panel coord-public-link-panel"><div><span className="coord-eyebrow">PUBLIC PROFILE</span><h2>Share your institution profile</h2><p>Visitors can see public academic information and coordinator names.</p></div><a className="btn btn-secondary" href={`/institutions/${institution.id || institution._id}`} target="_self"><Globe2 size={16} /> View public page</a></section>}
    </div>
  );
}

function InstitutionForm({ id, form, setForm, busy, onSubmit, submitLabel = 'Create institution' }) {
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  return <form id={id} className="coord-panel coord-form" onSubmit={onSubmit}><div className="coord-section-heading"><div><span className="coord-eyebrow">OFFICIAL PROFILE</span><h2>Institution details</h2><p>Public details can be updated later. Fields are saved to the institution profile.</p></div></div><div className="coord-form-grid coord-form-grid-wide"><Field label="Official institution name"><input required maxLength="140" value={form.name || ''} onChange={e => update('name', e.target.value)} placeholder="Institution name" /></Field><Field label="Institution type"><select value={form.type || 'college'} onChange={e => update('type', e.target.value)}><option value="college">College</option><option value="university">University</option><option value="school">School</option></select></Field><Field label="City"><input value={form.city || ''} onChange={e => update('city', e.target.value)} /></Field><Field label="State"><input value={form.state || ''} onChange={e => update('state', e.target.value)} /></Field><Field label="Country"><input value={form.country || ''} onChange={e => update('country', e.target.value)} /></Field><Field label="Address"><input value={form.address || ''} onChange={e => update('address', e.target.value)} /></Field><Field label="Official website"><input type="url" value={form.website || ''} onChange={e => update('website', e.target.value)} placeholder="https://example.edu" /></Field><Field label="Logo image URL"><input type="url" value={form.logoUrl || ''} onChange={e => update('logoUrl', e.target.value)} placeholder="https://…" /></Field><Field label="Cover image URL"><input type="url" value={form.coverUrl || ''} onChange={e => update('coverUrl', e.target.value)} placeholder="https://…" /></Field><Field label="Gallery image URLs (comma separated)"><input value={form.galleryUrls || ''} onChange={e => update('galleryUrls', e.target.value)} placeholder="https://…/campus.jpg, https://…/library.jpg" /></Field><Field label="Public description"><textarea rows="4" maxLength="1200" value={form.description || ''} onChange={e => update('description', e.target.value)} /></Field></div><div className="coord-form-footer"><span>Only enter information authorized for public display. Gallery links should show real campus images.</span><button className="btn btn-primary" disabled={busy}><Plus size={16} /> {submitLabel}</button></div></form>;
}

function InstitutionSummary({ institution }) {
  return <section className="coord-institution-summary"><div className="coord-cover" style={institution.coverUrl ? { backgroundImage: `linear-gradient(90deg,rgba(9,13,22,.88),rgba(9,13,22,.2)),url("${institution.coverUrl}")` } : undefined}><div className="coord-summary-logo">{institution.logoUrl ? <img src={institution.logoUrl} alt="" /> : <Building2 />}</div><div><span className="coord-eyebrow">{institution.type} · {institution.city || 'Location pending'}</span><h2>{institution.name}</h2></div></div><div className="coord-summary-details"><p>{institution.description || 'Add an overview to introduce your institution to visitors.'}</p><div>{institution.website && <a href={institution.website} target="_blank" rel="noreferrer"><Globe2 size={16} /> {institution.website}</a>}<span><MapPin size={16} /> {[institution.city, institution.state, institution.country].filter(Boolean).join(', ') || 'Location not provided'}</span></div></div></section>;
}

function BranchList({ branches }) {
  return <section className="coord-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">YOUR STRUCTURE</span><h2>Branches <span className="coord-count">{branches.length}</span></h2></div></div>{branches.length ? <div className="coord-program-list">{branches.map(row => <article key={row._id || row.id}><School size={18} /><div><strong>{row.name}</strong><small>{row.code || 'No branch code'}{row.programs?.length ? ` · ${row.programs.join(', ')}` : ''}</small></div><span className="coord-status">{row.status}</span></article>)}</div> : <p className="coord-muted">No branches configured yet.</p>}</section>;
}

function PeopleList({ title, people, empty }) {
  return <section className="coord-panel"><div className="coord-section-heading"><div><span className="coord-eyebrow">INSTITUTION MEMBERS</span><h2>{title} <span className="coord-count">{people.length}</span></h2></div></div>{people.length ? <div className="coord-people-list">{people.map(person => <article key={person.id}><div className="coord-avatar">{person.name?.split(' ').map(part => part[0]).join('').slice(0, 2)}</div><div><strong>{person.name}</strong><small>{person.designation || person.department || 'Member'}</small></div><span className="coord-status">Active</span></article>)}</div> : <p className="coord-muted">{empty}</p>}</section>;
}
