const BASE_URL = '/api';

export function getToken() {
  return localStorage.getItem('projectflow_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('projectflow_token', token);
  } else {
    localStorage.removeItem('projectflow_token');
  }
}

export function getUser() {
  const data = localStorage.getItem('projectflow_user');
  return data ? JSON.parse(data) : null;
}

export function setUser(user) {
  if (user) {
    localStorage.setItem('projectflow_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('projectflow_user');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  getUsers: () => request('/auth/users'),
  getFaculty: () => request('/auth/faculty'),
  createUser: (userData) => request('/auth/users', { method: 'POST', body: JSON.stringify(userData) }),
  updateUser: (id, data) => request(`/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Projects
  getProjects: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/projects${qs ? '?' + qs : ''}`);
  },
  getProject: (id) => request(`/projects/${id}`),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  getProjectOverview: (id) => request(`/projects/${id}/overview`),

  // Team
  getTeam: (projectId) => request(`/projects/${projectId}/team`),
  addTeamMember: (projectId, memberData) => request(`/projects/${projectId}/team/members`, { method: 'POST', body: JSON.stringify(memberData) }),
  removeTeamMember: (projectId, memberId) => request(`/projects/${projectId}/team/members/${memberId}`, { method: 'DELETE' }),

  // Requirements (manually entered by students per SRS)
  getRequirements: (projectId) => request(`/projects/${projectId}/requirements`),
  createRequirement: (projectId, data) => request(`/projects/${projectId}/requirements`, { method: 'POST', body: JSON.stringify(data) }),
  updateRequirement: (projectId, reqId, data) => request(`/projects/${projectId}/requirements/${reqId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRequirement: (projectId, reqId) => request(`/projects/${projectId}/requirements/${reqId}`, { method: 'DELETE' }),

  // Milestones & Criteria
  getMilestones: (projectId) => request(`/projects/${projectId}/milestones`),
  recalculateMilestones: (projectId) => request(`/projects/${projectId}/milestones/recalculate`, { method: 'POST' }),
  getCriteria: () => request('/criteria'),
  createCriteria: (data) => request('/criteria', { method: 'POST', body: JSON.stringify(data) }),
  updateCriteria: (id, data) => request(`/criteria/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCriteria: (id) => request(`/criteria/${id}`, { method: 'DELETE' }),

  // Documents
  getDocuments: (projectId) => request(`/projects/${projectId}/documents`),
  uploadDocument: (projectId, data) => request(`/projects/${projectId}/documents`, { method: 'POST', body: JSON.stringify(data) }),
  deleteDocument: (projectId, docId) => request(`/projects/${projectId}/documents/${docId}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (projectId, filter = {}) => {
    const qs = new URLSearchParams(filter).toString();
    return request(`/tasks/projects/${projectId}/tasks${qs ? '?' + qs : ''}`);
  },
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // GitHub Integration
  connectGitHub: (data) => request('/github/connect', { method: 'POST', body: JSON.stringify(data) }),
  syncGitHub: (projectId) => request(`/github/${projectId}/sync`, { method: 'POST' }),
  getGitHubStatus: (projectId) => request(`/github/${projectId}/status`),
  getGitHubActivity: (projectId) => request(`/github/${projectId}/activity`),
  getGitHubEvidence: (projectId) => request(`/github/${projectId}/evidence`),

  // Evaluation
  getEvaluations: (projectId) => request(`/evaluations/${projectId}`),
  createEvaluation: (data) => request('/evaluations', { method: 'POST', body: JSON.stringify(data) }),
  updateEvaluation: (id, data) => request(`/evaluations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getRubricTemplate: () => request('/evaluations/rubric-template'),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' })
};
