import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';

const DEFAULT_COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#3B82F6'];

const ProjectModal = ({ project, onClose, onSave }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        image: '',
        tags: '',
        github: '',
        demo: '',
        color: '#8B5CF6',
        order: 0,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (project) {
            setForm({
                title: project.title || '',
                description: project.description || '',
                image: project.image || '',
                tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
                github: project.github || '',
                demo: project.demo || '',
                color: project.color || '#8B5CF6',
                order: project.order || 0,
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await onSave({
                ...form,
                order: parseInt(form.order) || 0,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            });
        } catch (err) {
            setError(err.message);
            setSaving(false);
        }
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box',
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        color: '#F0F0FF', fontSize: 14,
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    const labelStyle = {
        display: 'block', color: '#8B8BAA', fontSize: 12,
        fontWeight: 500, marginBottom: 6,
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
        }}>
            <div style={{
                width: '100%', maxWidth: 560,
                background: 'rgba(18,18,26,0.98)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: 18,
                boxShadow: '0 30px 100px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                maxHeight: '90vh',
                display: 'flex', flexDirection: 'column',
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <h2 style={{ color: '#F0F0FF', fontSize: 18, fontWeight: 700, margin: 0 }}>
                        {project?._id ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.06)', border: 'none',
                            borderRadius: 8, padding: 8, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <X size={18} color="#8B8BAA" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1 }}>
                    <div style={{ padding: '24px' }}>
                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: 8, padding: '10px 14px', color: '#F87171',
                                fontSize: 13, marginBottom: 16,
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {/* Title */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Title *</label>
                                <input
                                    name="title" value={form.title} onChange={handleChange}
                                    required placeholder="My Awesome Project"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>

                            {/* Description */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Description *</label>
                                <textarea
                                    name="description" value={form.description} onChange={handleChange}
                                    required placeholder="Brief description of your project..."
                                    rows={3}
                                    style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>

                            {/* Image URL */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Image URL</label>
                                <input
                                    name="image" value={form.image} onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>

                            {/* Tags */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Tags (comma-separated)</label>
                                <input
                                    name="tags" value={form.tags} onChange={handleChange}
                                    placeholder="React, Node.js, MongoDB"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>

                            {/* GitHub */}
                            <div>
                                <label style={labelStyle}>GitHub URL</label>
                                <input
                                    name="github" value={form.github} onChange={handleChange}
                                    placeholder="https://github.com/..."
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>

                            {/* Demo */}
                            <div>
                                <label style={labelStyle}>Live Demo URL</label>
                                <input
                                    name="demo" value={form.demo} onChange={handleChange}
                                    placeholder="https://myproject.com"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>

                            {/* Color */}
                            <div>
                                <label style={labelStyle}>Accent Color</label>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {DEFAULT_COLORS.map(c => (
                                        <button
                                            key={c} type="button"
                                            onClick={() => setForm(prev => ({ ...prev, color: c }))}
                                            style={{
                                                width: 28, height: 28, borderRadius: '50%',
                                                background: c, border: form.color === c
                                                    ? '2px solid #fff'
                                                    : '2px solid transparent',
                                                cursor: 'pointer', transition: 'transform 0.15s',
                                                transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                                            }}
                                        />
                                    ))}
                                    <input
                                        type="color" name="color" value={form.color}
                                        onChange={handleChange}
                                        style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: 'none' }}
                                        title="Custom color"
                                    />
                                </div>
                            </div>

                            {/* Order */}
                            <div>
                                <label style={labelStyle}>Display Order</label>
                                <input
                                    type="number" name="order" value={form.order} onChange={handleChange}
                                    min={0} style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', gap: 12, justifyContent: 'flex-end',
                        flexShrink: 0,
                    }}>
                        <button
                            type="button" onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 8, color: '#8B8BAA',
                                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit" disabled={saving}
                            style={{
                                padding: '10px 24px',
                                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                                border: 'none', borderRadius: 8,
                                color: '#fff', fontSize: 14, fontWeight: 600,
                                cursor: saving ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 8,
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            {saving ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
                            {saving ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
