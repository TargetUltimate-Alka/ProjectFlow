import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Modal } from '../../components/Modal';
import { CheckSquare, Plus, Filter, Calendar, User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [team, setTeam] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasksData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      if (projects.length > 0) {
        const proj = projects[0];
        setProject(proj);
        const [taskList, teamList] = await Promise.all([
          api.getTasks(proj.id, { status: filterStatus, priority: filterPriority }),
          api.getTeam(proj.id)
        ]);
        setTasks(taskList);
        setTeam(teamList);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, [filterStatus, filterPriority]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const selectedMember = team.find(m => m._id === assigneeId || m.id === assigneeId);
      await api.createTask({
        projectId: project.id,
        title,
        description,
        assigneeId: assigneeId || null,
        assigneeName: selectedMember ? selectedMember.name : 'Unassigned',
        priority,
        dueDate,
        status: 'todo'
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setAssigneeId('');
      setPriority('medium');
      setDueDate('');
      await fetchTasksData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      await fetchTasksData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && tasks.length === 0) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading project tasks...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Project Task Execution</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Collaborative task assignments, priority schedules, and deliverables
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Create Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={16} style={{ color: '#94a3b8' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Filters:</span>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'todo', 'in_progress', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Priority:</span>
          <select
            className="form-control"
            style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {tasks.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#64748b' }}>
            No tasks match your current filter criteria.
          </div>
        ) : (
          tasks.map((task) => {
            const isCompleted = task.status === 'completed';
            return (
              <div
                key={task._id || task.id}
                className="glass-panel glass-panel-hoverable"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${
                    task.priority === 'critical' ? '#f43f5e' :
                    task.priority === 'high' ? '#f59e0b' : '#38bdf8'
                  }`
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`badge ${
                      task.priority === 'critical' ? 'badge-rose' :
                      task.priority === 'high' ? 'badge-amber' : 'badge-cyan'
                    }`} style={{ textTransform: 'capitalize' }}>
                      {task.priority}
                    </span>

                    <select
                      className="form-control"
                      style={{ padding: '3px 8px', fontSize: '0.75rem', width: 'auto' }}
                      value={task.status}
                      onChange={e => handleStatusUpdate(task._id || task.id, e.target.value)}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Under Review</option>
                      <option value="completed">Completed ✓</option>
                    </select>
                  </div>

                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginTop: '14px',
                    color: isCompleted ? '#94a3b8' : '#fff',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </h3>

                  {task.description && (
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.5 }}>
                      {task.description}
                    </p>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '18px',
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.75rem',
                  color: '#94a3b8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} style={{ color: '#38bdf8' }} />
                    <span style={{ fontWeight: 500, color: '#e2e8f0' }}>{task.assigneeName}</span>
                  </div>

                  {task.dueDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      <span>{task.dueDate}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Software Task">
        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Write unit tests for JWT middleware"
              className="form-control"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Task Details</label>
            <textarea
              rows={3}
              placeholder="Acceptance criteria and implementation goals..."
              className="form-control"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                className="form-control"
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {team.map(m => (
                  <option key={m._id || m.id} value={m._id || m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Due Date</label>
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
