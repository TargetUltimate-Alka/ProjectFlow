import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  CheckSquare,
  Plus,
  Filter,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Upload,
  X,
  RefreshCw,
  Award,
  ChevronRight,
  ArrowLeft,
  FileCheck,
  ShieldAlert
} from 'lucide-react';

export function TasksPage({
  projectId,
  team: propTeam,
  course: propCourse,
  isTeamLead: propIsTeamLead,
  onBackToOverview,
  onBackToCourse,
  hideBreadcrumb = false
}) {
  const { user } = useAuth();
  const userEmail = (user?.email || '').toLowerCase();
  const userRole = (user?.role || '').toLowerCase();

  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState(propTeam || null);
  const [course, setCourse] = useState(propCourse || null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'completed' | 'not_completed'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Add Task Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [submissionReqs, setSubmissionReqs] = useState('');
  const [attachmentFilename, setAttachmentFilename] = useState('');
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Submit Task Work state (Panel 9)
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [submittingWork, setSubmittingWork] = useState(false);
  const [submitWorkError, setSubmitWorkError] = useState(null);

  // Faculty Evaluation state
  const [marksAwarded, setMarksAwarded] = useState('');
  const [facultyFeedback, setFacultyFeedback] = useState('');
  const [submittingEval, setSubmittingEval] = useState(false);
  const [evalError, setEvalError] = useState(null);

  // Helper: Determine if user is authorized team lead or faculty
  const isTeamLead = propIsTeamLead !== undefined ? propIsTeamLead : (
    ((team?.teamLeadEmail || '').toLowerCase() === userEmail) ||
    ((team?.members || []).some(m => (m.email || '').toLowerCase() === userEmail && m.isLeader))
  );
  const isFaculty = userRole === 'faculty';
  const isAdmin = userRole === 'admin';
  const canCreateTask = isTeamLead || isFaculty || isAdmin;

  // Helper: Format deadline remaining time
  const formatDueRemaining = (dueDateStr) => {
    if (!dueDateStr) return null;
    const target = new Date(dueDateStr).getTime();
    if (isNaN(target)) return null;
    const diff = target - Date.now();
    if (diff <= 0) return { expired: true, text: 'Deadline Passed' };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return { expired: false, text: `Due in: ${days} days ${hours} hours` };
    if (hours > 0) return { expired: false, text: `Due in: ${hours} hours ${mins} mins` };
    return { expired: false, text: `Due in: ${mins} mins` };
  };

  const fetchTasksData = async () => {
    try {
      setLoading(true);
      setError(null);

      // If team not provided as prop, attempt to load caller's current team
      let currentTeam = propTeam;
      let currentCourse = propCourse;

      if (!currentTeam) {
        try {
          const courses = await api.getCourses();
          if (courses && courses.length > 0) {
            const firstCourse = courses[0];
            currentCourse = firstCourse;
            setCourse(firstCourse);
            const myTeamRes = await api.getMyCourseTeam(firstCourse.id || firstCourse.code);
            if (myTeamRes?.team) {
              currentTeam = myTeamRes.team;
              setTeam(myTeamRes.team);
            }
          }
        } catch (e) {
          console.warn('[TasksPage] Fallback team resolution error:', e);
        }
      }

      const teamId = currentTeam?.id || currentTeam?._id;
      const projId = projectId || currentTeam?.projectId;

      const taskList = await api.getTasks({
        projectId: projId,
        teamId: teamId,
        status: filterStatus !== 'all' ? filterStatus : undefined
      });

      setTasks(Array.isArray(taskList) ? taskList : []);
    } catch (err) {
      console.error('[TasksPage] Fetch error:', err);
      setError(err.message || 'Failed to load team tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propTeam) setTeam(propTeam);
    if (propCourse) setCourse(propCourse);
  }, [propTeam, propCourse]);

  useEffect(() => {
    fetchTasksData();
  }, [filterStatus, projectId, team?.id]);

  // Handle Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreateError(null);

    if (!title.trim()) {
      setCreateError('Task title is required.');
      return;
    }

    if (!assigneeEmail) {
      setCreateError('Please select a team member from the assignment dropdown.');
      return;
    }

    try {
      setSubmittingCreate(true);
      const teamMembers = Array.isArray(team?.members) ? team.members : [];
      const selectedMember = teamMembers.find(m => (m.email || '').toLowerCase() === assigneeEmail.toLowerCase());

      const payload = {
        projectId: team?.projectId || projectId,
        teamId: team?.id || team?._id,
        courseId: team?.courseId || course?.code,
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim() || description.trim(),
        submissionRequirements: submissionReqs.trim(),
        assigneeId: selectedMember ? (selectedMember.id || selectedMember._id || selectedMember.email) : null,
        assigneeName: selectedMember ? selectedMember.name : 'Unassigned',
        assigneeEmail: assigneeEmail,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        attachments: attachmentFilename.trim() ? [{ name: attachmentFilename.trim(), type: 'document' }] : []
      };

      await api.createTask(payload);

      // Reset and close
      setIsAddModalOpen(false);
      setTitle('');
      setDescription('');
      setInstructions('');
      setAssigneeEmail('');
      setPriority('medium');
      setDueDate('');
      setSubmissionReqs('');
      setAttachmentFilename('');
      setActionSuccess('Task created and assigned successfully.');
      setTimeout(() => setActionSuccess(null), 4000);

      // Refresh list without full reload
      await fetchTasksData();
    } catch (err) {
      setCreateError(err.message || 'Failed to create task');
    } finally {
      setSubmittingCreate(false);
    }
  };

  // Handle Submit Task Work (Panel 9)
  const handleSubmitTaskWork = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    setSubmitWorkError(null);

    const deadlineInfo = formatDueRemaining(selectedTask.dueDate);
    if (deadlineInfo?.expired) {
      setSubmitWorkError('Submission deadline has passed. Submissions are closed.');
      return;
    }

    try {
      setSubmittingWork(true);
      const attachmentPayload = submissionFileName ? {
        name: submissionFileName,
        size: '2.5 MB',
        type: 'zip',
        uploadedAt: new Date().toISOString()
      } : null;

      const res = await api.submitTask(selectedTask.id || selectedTask._id, {
        submissionDescription: submissionNotes.trim() || selectedTask.description,
        attachment: attachmentPayload
      });

      setIsDetailModalOpen(false);
      setSelectedTask(null);
      setSubmissionNotes('');
      setSubmissionFileName('');
      setActionSuccess('Task submitted successfully.');
      setTimeout(() => setActionSuccess(null), 4000);

      await fetchTasksData();
    } catch (err) {
      setSubmitWorkError(err.message || 'Failed to submit task');
    } finally {
      setSubmittingWork(false);
    }
  };

  // Handle Faculty Evaluation
  const handleEvaluateTask = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    setEvalError(null);

    const marksNum = Number(marksAwarded);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 10) {
      setEvalError('Marks must be a number between 0 and 10.');
      return;
    }

    try {
      setSubmittingEval(true);
      await api.evaluateTask(selectedTask.id || selectedTask._id, {
        marksAwarded: marksNum,
        maxMarks: 10,
        feedback: facultyFeedback.trim()
      });

      setIsDetailModalOpen(false);
      setSelectedTask(null);
      setMarksAwarded('');
      setFacultyFeedback('');
      setActionSuccess(`Evaluation saved: ${marksNum}/10 awarded.`);
      setTimeout(() => setActionSuccess(null), 4000);

      await fetchTasksData();
    } catch (err) {
      setEvalError(err.message || 'Failed to evaluate task');
    } finally {
      setSubmittingEval(false);
    }
  };

  // Handle Attachment Download
  const handleDownloadAttachment = async (taskId, filename) => {
    try {
      await api.downloadTaskAttachment(taskId, filename);
    } catch (err) {
      alert(`Download failed: ${err.message}`);
    }
  };

  // Open Details Modal
  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setSubmissionNotes(task.submission?.description || '');
    setSubmissionFileName(task.submission?.attachment?.name || '');
    setMarksAwarded(task.evaluation?.marksAwarded ?? '');
    setFacultyFeedback(task.evaluation?.feedback || '');
    setSubmitWorkError(null);
    setEvalError(null);
    setIsDetailModalOpen(true);
  };

  // Filter options
  const filterTabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'completed', label: 'Completed' },
    { id: 'not_completed', label: 'Not Completed' }
  ];

  const teamMembers = Array.isArray(team?.members) ? team.members : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Success Notification Banner */}
      {actionSuccess && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '10px',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#34d399',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchTasksData}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: 'none',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation: Courses > CS543 > Team Alpha > Tasks matching Panel 8 */}
      {!hideBreadcrumb && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#94a3b8' }}>
          <button
            onClick={onBackToCourse}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            Courses
          </button>
          <ChevronRight size={14} color="#64748b" />
          <button
            onClick={onBackToCourse}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            {course?.code || 'CS543'}
          </button>
          <ChevronRight size={14} color="#64748b" />
          <button
            onClick={onBackToOverview}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            {team?.name || 'Team Alpha'}
          </button>
          <ChevronRight size={14} color="#64748b" />
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>Tasks</span>
        </div>
      )}

      {/* Header Bar matching Panel 8: Tasks title + "+ Add Task" button + "Filter" */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#f8fafc',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Tasks
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>
            Team lead divides assignments into tasks. All members view and submit.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '3px'
          }}>
            {filterTabs.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: filterStatus === f.id ? '#0284c7' : 'transparent',
                  color: filterStatus === f.id ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* "+ Add Task" Button - visible to authorized Team Lead / Faculty */}
          {canCreateTask && (
            <button
              onClick={() => {
                setCreateError(null);
                setIsAddModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '10px',
                backgroundColor: '#0284c7',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Task Table: Exactly 7 Columns matching Panel 8 */}
      <div style={{
        borderRadius: '14px',
        backgroundColor: 'rgba(18, 24, 38, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        {loading && tasks.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={24} className="spinning" style={{ margin: '0 auto 12px auto', display: 'block', color: '#38bdf8' }} />
            <span>Loading task roster and deliverables...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <CheckSquare size={36} style={{ margin: '0 auto 14px auto', display: 'block', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '6px' }}>No Tasks Found</h3>
            <p style={{ fontSize: '0.88rem', margin: 0 }}>
              {filterStatus !== 'all' ? `No tasks found for '${filterStatus}' filter.` : 'No tasks created yet for this project team.'}
            </p>
            {canCreateTask && filterStatus === 'all' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  marginTop: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} /> Create the First Task
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.88rem'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  letterSpacing: '0.01em'
                }}>
                  {/* Exactly seven columns in specified order */}
                  <th style={{ padding: '16px 20px', width: '140px' }}>Status</th>
                  <th style={{ padding: '16px 14px', width: '90px' }}>Task No.</th>
                  <th style={{ padding: '16px 20px', minWidth: '180px' }}>Task</th>
                  <th style={{ padding: '16px 20px', width: '160px' }}>Allotted To</th>
                  <th style={{ padding: '16px 20px', width: '180px' }}>Attachments</th>
                  <th style={{ padding: '16px 20px', minWidth: '220px' }}>Description</th>
                  <th style={{ padding: '16px 20px', width: '100px', textAlign: 'center' }}>Marks</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => {
                  const isCompleted = task.status === 'completed';
                  const firstAttachment = Array.isArray(task.attachments) && task.attachments.length > 0
                    ? task.attachments[0]
                    : null;
                  const attachmentName = typeof firstAttachment === 'string'
                    ? firstAttachment
                    : firstAttachment?.name;

                  return (
                    <tr
                      key={task._id || task.id}
                      onClick={() => openTaskDetail(task)}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background-color 0.15s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* 1. Status Column: Completed vs Not Completed */}
                      <td style={{ padding: '16px 20px' }}>
                        {isCompleted ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 12px',
                            borderRadius: '999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}>
                            Completed
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 12px',
                            borderRadius: '999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                          }}>
                            Not Completed
                          </span>
                        )}
                      </td>

                      {/* 2. Task No. Column */}
                      <td style={{ padding: '16px 14px', color: '#cbd5e1', fontWeight: 700 }}>
                        {task.taskNo || (idx + 1)}
                      </td>

                      {/* 3. Task Title Column */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          color: '#f8fafc',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          display: 'block'
                        }}>
                          {task.title}
                        </span>
                        {task.priority && task.priority === 'critical' && (
                          <span style={{
                            fontSize: '0.7rem',
                            color: '#f43f5e',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}>
                            Critical Priority
                          </span>
                        )}
                      </td>

                      {/* 4. Allotted To Column */}
                      <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600 }}>{task.assigneeName || 'Unassigned'}</span>
                        </div>
                      </td>

                      {/* 5. Attachments Column */}
                      <td style={{ padding: '16px 20px' }}>
                        {attachmentName ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadAttachment(task.id || task._id, attachmentName);
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(56, 189, 248, 0.12)',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                              color: '#38bdf8',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            title="Download attachment"
                          >
                            <FileText size={14} />
                            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {attachmentName}
                            </span>
                          </button>
                        ) : (
                          <span style={{ color: '#64748b' }}>-</span>
                        )}
                      </td>

                      {/* 6. Description Column: Description or Student's Submission Notes */}
                      <td style={{ padding: '16px 20px', color: '#cbd5e1', fontSize: '0.86rem' }}>
                        <span style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.45
                        }}>
                          {task.description && task.description !== '-' ? task.description : '-'}
                        </span>
                      </td>

                      {/* 7. Marks Column: Awarded Marks / - */}
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        {task.marks && task.marks !== '-' ? (
                          <span style={{
                            fontWeight: 800,
                            color: '#f8fafc',
                            fontSize: '0.92rem'
                          }}>
                            {task.marks}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b' }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: Create Task Popup (Add Task) */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '580px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={20} color="#38bdf8" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Create New Task
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {createError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}>
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateTask}>
              {/* Task Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. API Development"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              {/* Task Description & Instructions */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Task Description & Instructions *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setInstructions(e.target.value);
                  }}
                  placeholder="Describe the objective, deliverables, and implementation steps..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              {/* Team Member Assignment Dropdown (Eligible team members only) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Allot To Team Member * (Eligible Team Members)
                </label>
                <select
                  value={assigneeEmail}
                  onChange={(e) => setAssigneeEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                >
                  <option value="">-- Select Member from {team?.name || 'Team'} --</option>
                  {teamMembers.map((member) => (
                    <option key={member.email} value={member.email}>
                      {member.name} {member.isLeader ? '(Team Lead)' : ''} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Reference Attachment */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Reference Attachment Filename (optional)
                </label>
                <input
                  type="text"
                  value={attachmentFilename}
                  onChange={(e) => setAttachmentFilename(e.target.value)}
                  placeholder="e.g. api_spec_v1.pdf"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submission Requirements */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Submission Requirements (optional)
                </label>
                <input
                  type="text"
                  value={submissionReqs}
                  onChange={(e) => setSubmissionReqs(e.target.value)}
                  placeholder="e.g. Upload ZIP containing source code and test suite"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#cbd5e1',
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCreate}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {submittingCreate ? <RefreshCw size={15} className="spinning" /> : <Plus size={15} />}
                  <span>{submittingCreate ? 'Creating...' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: Task Details & Submission Modal (Matching Panel 9)    */}
      {/* ============================================================== */}
      {isDetailModalOpen && selectedTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '620px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Breadcrumb matching Panel 9: Tasks > Submit Task */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
              <span>Tasks</span>
              <ChevronRight size={12} color="#64748b" />
              <span style={{ color: '#38bdf8' }}>Submit Task</span>
            </div>

            {/* Header: Submit Task + Due countdown badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Submit Task
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Due countdown pill matching Panel 9 */}
                {selectedTask.dueDate && (() => {
                  const rem = formatDueRemaining(selectedTask.dueDate);
                  if (!rem) return null;
                  return (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: rem.expired ? 'rgba(239, 68, 68, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: rem.expired ? '#f87171' : '#fb7185',
                      border: rem.expired ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)'
                    }}>
                      <Clock size={13} />
                      {rem.text}
                    </span>
                  );
                })()}

                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Task Info Section */}
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Task</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  {selectedTask.title} (Task No. {selectedTask.taskNo})
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Description</span>
                <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                  {selectedTask.instructions || selectedTask.description || 'No detailed instructions provided.'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.82rem', color: '#94a3b8', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span>Allotted To: <strong style={{ color: '#e2e8f0' }}>{selectedTask.assigneeName}</strong> ({selectedTask.assigneeEmail})</span>
                {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={13} color="#38bdf8" />
                    <span>Reference:</span>
                    <button
                      type="button"
                      onClick={() => handleDownloadAttachment(selectedTask.id || selectedTask._id, selectedTask.attachments[0].name || selectedTask.attachments[0])}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#38bdf8',
                        textDecoration: 'underline',
                        padding: 0,
                        cursor: 'pointer',
                        fontSize: 'inherit'
                      }}
                    >
                      {selectedTask.attachments[0].name || selectedTask.attachments[0]}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Banners */}
            {submitWorkError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}>
                {submitWorkError}
              </div>
            )}

            {/* Student Submission Form matching Panel 9 */}
            <form onSubmit={handleSubmitTaskWork} style={{ marginBottom: '24px' }}>
              {/* Upload Attachment */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Upload Attachment
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                  <input
                    type="file"
                    id="taskFileAttachment"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSubmissionFileName(e.target.files[0].name);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="taskFileAttachment"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={14} />
                    <span>Choose File</span>
                  </label>
                  <span style={{ fontSize: '0.85rem', color: submissionFileName ? '#38bdf8' : '#94a3b8' }}>
                    {submissionFileName || (selectedTask.submission?.attachment?.name ? selectedTask.submission.attachment.name : 'No file chosen')}
                  </span>
                </div>
              </div>

              {/* Your Submission Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Your Submission Description
                </label>
                <textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Implemented user, team and project APIs."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              {/* Action Buttons: Cancel and Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#cbd5e1',
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWork || formatDueRemaining(selectedTask.dueDate)?.expired}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 24px',
                    borderRadius: '8px',
                    backgroundColor: formatDueRemaining(selectedTask.dueDate)?.expired ? '#475569' : '#0284c7',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: formatDueRemaining(selectedTask.dueDate)?.expired ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submittingWork ? <RefreshCw size={15} className="spinning" /> : <FileCheck size={15} />}
                  <span>{submittingWork ? 'Submitting...' : 'Submit'}</span>
                </button>
              </div>
            </form>

            {/* Faculty Evaluation Section */}
            <div style={{
              marginTop: '20px',
              paddingTop: '18px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Award size={18} color="#f59e0b" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Faculty Evaluation & Marks
                </h4>
              </div>

              {selectedTask.evaluation && selectedTask.evaluation.marksAwarded !== undefined ? (
                <div style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Marks Awarded:</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>
                      {selectedTask.evaluation.marksAwarded}/{selectedTask.evaluation.maxMarks || 10}
                    </span>
                  </div>
                  {selectedTask.evaluation.feedback && (
                    <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                      Feedback: {selectedTask.evaluation.feedback}
                    </p>
                  )}
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                    Evaluated by {selectedTask.evaluation.evaluatedBy} on {new Date(selectedTask.evaluation.evaluatedAt).toLocaleDateString()}
                  </div>
                </div>
              ) : isFaculty || isAdmin ? (
                // Faculty Evaluation Input Form
                <form onSubmit={handleEvaluateTask} style={{ marginTop: '10px' }}>
                  {evalError && (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      fontSize: '0.82rem',
                      marginBottom: '10px'
                    }}>
                      {evalError}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                        Marks (out of 10)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={marksAwarded}
                        onChange={(e) => setMarksAwarded(e.target.value)}
                        placeholder="8"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                        Supervisor Feedback
                      </label>
                      <input
                        type="text"
                        value={facultyFeedback}
                        onChange={(e) => setFacultyFeedback(e.target.value)}
                        placeholder="e.g. Great progress on API structure."
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingEval}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#f59e0b',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    {submittingEval ? 'Saving...' : 'Award Marks'}
                  </button>
                </form>
              ) : (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  color: '#94a3b8',
                  fontSize: '0.84rem'
                }}>
                  Marks will appear once the assigned faculty member evaluates the submission. Students cannot self-assign marks.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
