import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import {
  Search,
  X,
  Globe,
  Cpu,
  Database,
  Layers,
  BookOpen,
  ArrowRight,
  Megaphone,
  Calendar,
  User,
  AlertCircle,
  RefreshCw,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export function StudentDashboard({ onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const fetchCoursesAndBroadcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesData, broadcastsData] = await Promise.all([
        api.getCourses(),
        api.getCourseBroadcasts().catch(() => [])
      ]);
      setCourses(coursesData || []);
      setBroadcasts(broadcastsData || []);
    } catch (err) {
      console.error('Failed to load student courses:', err);
      setError(err.message || 'Unable to load authorized courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndBroadcasts();
  }, []);

  // Filter courses locally in real time as student types
  const filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      (course.code || '').toLowerCase().includes(q) ||
      (course.name || '').toLowerCase().includes(q) ||
      (course.facultyName || '').toLowerCase().includes(q) ||
      (course.batch || '').toLowerCase().includes(q) ||
      (course.semester || '').toLowerCase().includes(q)
    );
  });

  // Helper to pick the appropriate themed icon for each course
  const getCourseIcon = (iconName, color) => {
    const props = { size: 26, style: { color: color || '#38bdf8' } };
    switch ((iconName || '').toLowerCase()) {
      case 'globe':
      case 'server':
        return <Globe {...props} />;
      case 'cpu':
      case 'algo':
        return <Cpu {...props} />;
      case 'database':
        return <Database {...props} />;
      case 'layers':
      case 'workflow':
        return <Layers {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  return (
    <div className="student-dashboard-classroom" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Header Bar: Title + Real-time Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            My Courses
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>
            Academic software lifecycle & capstone project courses
          </p>
        </div>

        {/* Search Bar matching Google Classroom UX */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '360px'
        }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b'
            }}
          />
          <input
            id="course-search-input"
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 40px 11px 42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0284c7';
              e.target.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Announcements From Faculties Section (Panel 3 reference mockup) */}
      {broadcasts.length > 0 && !error && (
        <section style={{
          marginBottom: '32px',
          borderRadius: '16px',
          background: 'rgba(18, 24, 38, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Header of Announcements */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(2, 132, 199, 0.08) 0%, transparent 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444'
              }}>
                <Megaphone size={16} />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                Announcements from Faculties
              </h2>
            </div>
            <button
              onClick={() => setShowAllAnnouncements(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              View All ({broadcasts.length})
            </button>
          </div>

          {/* Broadcast Items List */}
          <div style={{ padding: '8px 16px' }}>
            {broadcasts.slice(0, 3).map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => setSelectedAnnouncement(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  margin: '4px 0',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.color || '#38bdf8',
                    flexShrink: 0
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ color: item.color || '#38bdf8', fontWeight: 600 }}>{item.courseCode}</span>
                      <span>•</span>
                      <span>{item.facultyName}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                <div style={{ color: '#64748b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Read</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ERROR STATE */}
      {error && (
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <AlertCircle size={36} style={{ color: '#ef4444', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fca5a5' }}>Failed to Load Courses</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '6px 0 16px 0' }}>{error}</p>
          <button
            onClick={fetchCoursesAndBroadcasts}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* LOADING SKELETON STATE */}
      {loading && !error && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                borderRadius: '16px',
                background: 'rgba(18, 24, 38, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                minHeight: '260px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: '60%', height: '18px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', marginBottom: '8px' }} />
                  <div style={{ width: '80%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)' }} />
                </div>
              </div>
              <div style={{ width: '100%', height: '40px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }} />
              <div style={{ marginTop: 'auto', width: '100%', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)' }} />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY SEARCH STATE */}
      {!loading && !error && filteredCourses.length === 0 && searchQuery && (
        <div style={{
          padding: '60px 24px',
          textAlign: 'center',
          borderRadius: '16px',
          background: 'rgba(18, 24, 38, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Search size={44} style={{ color: '#64748b', margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
            No courses matching "{searchQuery}"
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '6px', maxWidth: '420px', margin: '6px auto 20px auto' }}>
            Check for typos or try searching with a course code (e.g., CS543) or faculty name.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <X size={16} />
            <span>Clear Search Filter</span>
          </button>
        </div>
      )}

      {/* EMPTY AUTHORIZED COURSES STATE (Zero courses enrolled) */}
      {!loading && !error && courses.length === 0 && !searchQuery && (
        <div style={{
          padding: '60px 24px',
          textAlign: 'center',
          borderRadius: '16px',
          background: 'rgba(18, 24, 38, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <GraduationCap size={48} style={{ color: '#0284c7', margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc' }}>
            No Enrolled Courses Found
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '460px', margin: '8px auto 0 auto' }}>
            You are not currently enrolled in any academic courses for this semester. Contact your course instructor or department administrator for access authorization.
          </p>
        </div>
      )}

      {/* MAIN COURSES GRID (Google Classroom Pattern) */}
      {!loading && !error && filteredCourses.length > 0 && (
        <div>
          {searchQuery && (
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
              Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} for <strong style={{ color: '#38bdf8' }}>"{searchQuery}"</strong>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredCourses.map((course) => {
              const themeColor = course.color || '#0284c7';
              return (
                <div
                  key={course.id || course.code}
                  className="glass-panel glass-panel-hoverable"
                  style={{
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(18, 24, 38, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    minHeight: '270px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = themeColor;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 30px -4px ${themeColor}25, 0 4px 12px rgba(0, 0, 0, 0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
                  }}
                >
                  {/* Subtle Top Gradient Accent Strip */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${themeColor} 0%, ${themeColor}88 100%)`
                  }} />

                  {/* Card Body */}
                  <div>
                    {/* Course Code & Visual Identifier Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '14px',
                        background: `${themeColor}18`,
                        border: `1px solid ${themeColor}35`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getCourseIcon(course.icon, themeColor)}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: `${themeColor}20`,
                          color: themeColor,
                          letterSpacing: '0.04em',
                          marginBottom: '4px'
                        }}>
                          {course.code}
                        </div>
                        <h3 style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: '#fff',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {course.name}
                        </h3>
                      </div>
                    </div>

                    {/* Metadata: Faculty & Batch/Semester */}
                    <div style={{
                      padding: '12px 0',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '0.825rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                        <User size={14} style={{ color: '#94a3b8' }} />
                        <span>Faculty: <strong style={{ color: '#f1f5f9' }}>{course.facultyName}</strong></span>
                      </div>

                      {(course.batch || course.semester) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                          <Calendar size={14} style={{ color: '#64748b' }} />
                          <span>
                            {course.batch && `Batch: ${course.batch}`}
                            {course.batch && course.semester && ' • '}
                            {course.semester && course.semester}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* "View Course" Action Button */}
                  <div style={{ marginTop: '16px' }}>
                    <button
                      onClick={() => onSelectCourse && onSelectCourse(course)}
                      className="btn"
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${themeColor} 0%, #0284c7 100%)`,
                        border: 'none',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: `0 4px 14px ${themeColor}35`,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(1.1)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'brightness(1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <span>View Course</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Announcement Detail / All Announcements Modal */}
      {(showAllAnnouncements || selectedAnnouncement) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '24px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Megaphone size={20} style={{ color: '#38bdf8' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                  {selectedAnnouncement ? 'Course Announcement' : 'All Faculty Announcements'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAllAnnouncements(false);
                  setSelectedAnnouncement(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {selectedAnnouncement ? (
              <div>
                <div style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(2, 132, 199, 0.15)',
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '8px'
                }}>
                  {selectedAnnouncement.courseCode} — {selectedAnnouncement.courseName}
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                  {selectedAnnouncement.title}
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
                  Posted by <strong>{selectedAnnouncement.facultyName}</strong> on {selectedAnnouncement.date}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {selectedAnnouncement.content}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {broadcasts.map((ann, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAnnouncement(ann)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: ann.color || '#38bdf8', fontWeight: 700 }}>
                      {ann.courseCode} • {ann.date}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: '4px 0' }}>
                      {ann.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Faculty: {ann.facultyName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
