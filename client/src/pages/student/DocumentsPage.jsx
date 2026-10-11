import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Modal } from '../../components/Modal';
import { FileText, Upload, Download, ExternalLink, Trash2, Calendar, User, FileCheck } from 'lucide-react';

export function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [project, setProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('SRS');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      if (projects.length > 0) {
        setProject(projects[0]);
        const docs = await api.getDocuments(projects[0].id);
        setDocuments(docs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await api.uploadDocument(project.id, {
        name,
        type,
        fileSize
      });
      setIsModalOpen(false);
      setName('');
      setType('SRS');
      await fetchDocuments();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await api.deleteDocument(project.id, docId);
      await fetchDocuments();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading project documents...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Project Documents & Artifacts</h1>
            <span className="badge badge-amber">Manual Upload Feature</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Upload SRS, architecture specifications, and final report deliverables required by Milestone criteria.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Upload size={16} /> Upload Document
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Artifact Category</th>
              <th>File Size</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No documents uploaded yet. Upload SRS or Architecture documents to fulfill milestone requirements.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc._id || doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: '#38bdf8'
                      }}>
                        <FileText size={16} />
                      </div>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>{doc.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-cyan">{doc.type}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {doc.fileSize || '1.5 MB'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                      {doc.uploadedByName || 'Student Lead'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => alert(`Viewing document: ${doc.name}`)}
                        className="btn btn-secondary btn-sm"
                        title="View Document"
                      >
                        <ExternalLink size={13} /> View
                      </button>
                      <button
                        onClick={() => alert(`Downloading artifact file: ${doc.name}`)}
                        className="btn btn-secondary btn-sm"
                        title="Download Document"
                      >
                        <Download size={13} /> Download
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id || doc.id)}
                        className="btn-icon"
                        title="Delete Document"
                        style={{ color: '#fb7185' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Academic Document">
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label className="form-label">Document Title / File Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Software Architecture Specification v1.0.pdf"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Artifact Classification</label>
            <select
              className="form-control"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="SRS">SRS (Software Requirements Specification)</option>
              <option value="Architecture Design">Architecture Design & UML Diagrams</option>
              <option value="Final Report">Final Capstone Report & Testing Log</option>
              <option value="User Manual">User Manual & Deployment Guide</option>
              <option value="Other">Other Supporting Artifact</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">File Size Estimate</label>
            <input
              type="text"
              className="form-control"
              value={fileSize}
              onChange={e => setFileSize(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Upload
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
