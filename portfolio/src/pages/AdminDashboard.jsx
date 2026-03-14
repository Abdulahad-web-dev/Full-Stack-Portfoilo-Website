import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Globe, Github, RefreshCw, Home } from 'lucide-react';
import ProjectModal from '../components/admin/ProjectModal';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('admin_token');

    const authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/projects`);
            if (!res.ok) throw new Error('Failed to fetch projects');
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!token) { navigate('/admin/login'); return; }
        // Verify token
        fetch(`${API}/auth/verify`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (!res.ok) { localStorage.removeItem('admin_token'); navigate('/admin/login'); }
                else fetchProjects();
            })
            .catch(() => { localStorage.removeItem('admin_token'); navigate('/admin/login'); });
    }, [token, navigate, fetchProjects]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };

    const handleSave = async (formData) => {
        const isEdit = !!editingProject?._id;
        const url = isEdit ? `${API}/projects/${editingProject._id}` : `${API}/projects`;
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: authHeaders,
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Save failed');

        setModalOpen(false);
        setEditingProject(null);
        fetchProjects();
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API}/projects/${id}`, {
                method: 'DELETE',
                headers: authHeaders,
            });
            if (!res.ok) throw new Error('Delete failed');
            setDeleteConfirm(null);
            fetchProjects();
        } catch (err) {
            setError(err.message);
        }
    };

    const openAdd = () => { setEditingProject(null); setModalOpen(true); };
    const openEdit = (p) => { setEditingProject(p); setModalOpen(true); };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0A0A0F',
            fontFamily: "'Inter', sans-serif",
            color: '#F0F0FF',
        }}>
            {/* Background */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.06) 0%, transparent 50%)',
                pointerEvents: 'none',
            }} />

            {/* Navbar */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(10,10,15,0.9)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                padding: '0 24px',
            }}>
                <div style={{
                    maxWidth: 1100, margin: '0 auto',
                    height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>A</span>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>Admin Dashboard</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#6B6B8A' }}>Portfolio Manager</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 14px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 8, color: '#8B8BAA', fontSize: 13,
                                cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            <Home size={14} /> Portfolio
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 14px',
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: 8, color: '#F87171', fontSize: 13,
                                cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700 }}>Projects</h1>
                        <p style={{ margin: 0, color: '#6B6B8A', fontSize: 14 }}>
                            {projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={fetchProjects}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '10px 14px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 10, color: '#8B8BAA', fontSize: 13,
                                cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>
                        <button
                            onClick={openAdd}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                                border: 'none', borderRadius: 10,
                                color: '#fff', fontSize: 14, fontWeight: 600,
                                cursor: 'pointer', fontFamily: 'inherit',
                                boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
                            }}
                        >
                            <Plus size={16} /> Add Project
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 10, padding: '12px 16px', color: '#F87171',
                        fontSize: 14, marginBottom: 20,
                    }}>
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B8A' }}>
                        <div style={{
                            width: 40, height: 40, border: '3px solid rgba(139,92,246,0.2)',
                            borderTop: '3px solid #8B5CF6', borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px',
                        }} />
                        Loading projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '80px 0',
                        background: 'rgba(18,18,26,0.5)',
                        border: '1px dashed rgba(255,255,255,0.08)',
                        borderRadius: 16, color: '#6B6B8A',
                    }}>
                        <Plus size={40} color="rgba(139,92,246,0.3)" style={{ marginBottom: 12 }} />
                        <p style={{ fontSize: 16, margin: '0 0 8px', color: '#8B8BAA' }}>No projects yet</p>
                        <p style={{ fontSize: 13, margin: '0 0 20px' }}>Click "Add Project" to get started</p>
                        <button onClick={openAdd} style={{
                            padding: '10px 24px',
                            background: 'rgba(139,92,246,0.15)',
                            border: '1px solid rgba(139,92,246,0.3)',
                            borderRadius: 10, color: '#8B5CF6', fontSize: 14,
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                            Add Your First Project
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                        {projects.map(project => (
                            <div key={project._id} style={{
                                background: 'rgba(18,18,26,0.9)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 16, overflow: 'hidden',
                                transition: 'border-color 0.2s, transform 0.2s',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = `${project.color}40`;
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Image */}
                                <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
                                    {project.image ? (
                                        <img src={project.image} alt={project.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            background: `linear-gradient(135deg, ${project.color}20, rgba(10,10,15,0.9))`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{ fontSize: 36 }}>📁</span>
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: `linear-gradient(to top, rgba(10,10,15,0.85), transparent)`,
                                    }} />
                                    {/* Order badge */}
                                    <div style={{
                                        position: 'absolute', top: 10, left: 10,
                                        background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(6px)',
                                        border: `1px solid ${project.color}40`, borderRadius: 6,
                                        padding: '2px 8px', fontSize: 11, color: project.color, fontWeight: 600,
                                    }}>
                                        #{project.order || 0}
                                    </div>
                                    {/* Color dot */}
                                    <div style={{
                                        position: 'absolute', top: 10, right: 10,
                                        width: 14, height: 14, borderRadius: '50%',
                                        background: project.color, border: '2px solid rgba(255,255,255,0.3)',
                                    }} />
                                </div>

                                {/* Content */}
                                <div style={{ padding: '16px' }}>
                                    <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#F0F0FF' }}>
                                        {project.title}
                                    </h3>
                                    <p style={{ margin: '0 0 12px', fontSize: 12, color: '#6B6B8A', lineHeight: 1.5 }}>
                                        {project.description.length > 80
                                            ? project.description.slice(0, 80) + '...'
                                            : project.description}
                                    </p>

                                    {/* Tags */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                                        {project.tags?.slice(0, 4).map(tag => (
                                            <span key={tag} style={{
                                                padding: '2px 8px', borderRadius: 20,
                                                fontSize: 11, fontWeight: 500,
                                                background: `${project.color}15`,
                                                border: `1px solid ${project.color}30`,
                                                color: project.color,
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Links row */}
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                                        {project.github && project.github !== '#' && (
                                            <a href={project.github} target="_blank" rel="noreferrer"
                                                style={{ fontSize: 11, color: '#8B8BAA', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                                                <Github size={11} /> GitHub
                                            </a>
                                        )}
                                        {project.demo && project.demo !== '#' && (
                                            <a href={project.demo} target="_blank" rel="noreferrer"
                                                style={{ fontSize: 11, color: '#8B8BAA', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                                                <Globe size={11} /> Demo
                                            </a>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => openEdit(project)}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                padding: '8px', background: 'rgba(139,92,246,0.1)',
                                                border: '1px solid rgba(139,92,246,0.25)',
                                                borderRadius: 8, color: '#8B5CF6', fontSize: 13,
                                                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                                            }}
                                        >
                                            <Edit2 size={13} /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(project._id)}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                padding: '8px', background: 'rgba(239,68,68,0.08)',
                                                border: '1px solid rgba(239,68,68,0.2)',
                                                borderRadius: 8, color: '#F87171', fontSize: 13,
                                                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                                            }}
                                        >
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirm Dialog */}
            {deleteConfirm && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
                }}>
                    <div style={{
                        background: 'rgba(18,18,26,0.98)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 16, padding: '28px 32px',
                        maxWidth: 360, textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}>
                        <Trash2 size={32} color="#F87171" style={{ marginBottom: 12 }} />
                        <h3 style={{ color: '#F0F0FF', margin: '0 0 8px', fontSize: 18 }}>Delete Project?</h3>
                        <p style={{ color: '#6B6B8A', fontSize: 14, lineHeight: 1.5, margin: '0 0 24px' }}>
                            This action cannot be undone. The project will be permanently removed.
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                style={{
                                    padding: '10px 22px', background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                    color: '#8B8BAA', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                style={{
                                    padding: '10px 22px', background: 'rgba(239,68,68,0.15)',
                                    border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8,
                                    color: '#F87171', fontSize: 14, fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <ProjectModal
                    project={editingProject}
                    onClose={() => { setModalOpen(false); setEditingProject(null); }}
                    onSave={handleSave}
                />
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
