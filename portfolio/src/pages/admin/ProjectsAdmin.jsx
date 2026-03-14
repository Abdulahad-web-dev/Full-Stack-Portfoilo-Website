import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, Check, Loader, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        image: '',
        tags: [],
        color: '#8B5CF6',
        github: '',
        demo: '',
        order: 0
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('order', { ascending: true });

            if (error) throw error;
            setProjects(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (project = null) => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                content: project.content || '',
                image: project.image || '',
                tags: project.tags || [],
                color: project.color || '#8B5CF6',
                github: project.github || '',
                demo: project.demo || '',
                order: project.order || 0
            });
            setEditingId(project.id);
        } else {
            setFormData({
                title: '',
                description: '',
                content: '',
                image: '',
                tags: [],
                color: '#8B5CF6',
                github: '',
                demo: '',
                order: projects.length
            });
            setEditingId(null);
        }
        setTagInput('');
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleImageUpload = async (e) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            setUploading(true);

            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `projects/${fileName}`;

            // Upload the file to Supabase storage
            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get the public URL
            const { data } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image: data.publicUrl }));

        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleAddTag = (e) => {
        e.preventDefault();
        const tag = tagInput.trim();
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase
                    .from('projects')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('projects')
                    .insert([formData]);
                if (error) throw error;
            }
            fetchProjects();
            handleCloseForm();
        } catch (err) {
            alert('Error saving project: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const { error } = await supabase
                    .from('projects')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                fetchProjects();
            } catch (err) {
                alert('Error deleting project: ' + err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#12121A] p-6 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Projects</h2>
                    <p className="text-[#8B8BAA] text-sm">Manage your portfolio projects and case studies.</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Add Project
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader className="animate-spin text-[#8B5CF6]" size={32} />
                </div>
            ) : error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                    {error}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project.id} className="group bg-[#12121A] rounded-2xl border border-white/5 overflow-hidden hover:border-[#8B5CF6]/30 transition-colors flex flex-col">
                            {/* Project Image Header */}
                            <div className="h-40 relative bg-[#1A1A24] overflow-hidden flex-shrink-0">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${project.color || '#8B5CF6'}20, #1A1A24)` }}>
                                        <ImageIcon size={32} style={{ color: project.color || '#8B5CF6' }} className="opacity-50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] to-transparent" />

                                {/* Hover Actions */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenForm(project)}
                                        className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-lg transition-colors text-white border border-white/10"
                                        title="Edit"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-lg transition-colors text-red-400 border border-red-500/20"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Project Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                                <p className="text-[#8B8BAA] text-sm line-clamp-2 mb-3">{project.description}</p>

                                <div className="flex flex-wrap gap-1.5 mt-auto">
                                    {project.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-[#C4C4E0] border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags?.length > 3 && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-[#C4C4E0] border border-white/10">
                                            +{project.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full text-center py-12 text-[#8B8BAA] border border-dashed border-white/10 rounded-2xl">
                            No projects found. Add one to showcase your work.
                        </div>
                    )}
                </div>
            )}

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
                                <h3 className="text-xl font-bold text-white">
                                    {editingId ? 'Edit Project' : 'Add New Project'}
                                </h3>
                                <button onClick={handleCloseForm} className="text-[#8B8BAA] hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">

                                {/* Image Upload Component */}
                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Project Image</label>
                                    <div className="flex items-end gap-4">
                                        <div className="w-32 h-24 rounded-xl border border-white/10 overflow-hidden bg-[#1A1A24] relative flex-shrink-0">
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ImageIcon size={24} className="text-[#6B6B8A]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                                    placeholder="Or enter image URL directly"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={uploading}
                                                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                                                >
                                                    {uploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                                                    Upload File
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageUpload}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </div>
                                            <p className="text-xs text-[#6B6B8A]">16:9 aspect ratio recommended. Uploads go directly to Supabase Storage.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Project Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                            placeholder="e.g. E-Commerce Platform"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Accent Color</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={formData.color}
                                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                                            />
                                            <input
                                                type="text"
                                                value={formData.color}
                                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                                placeholder="#8B5CF6"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Short Description (Cards)</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors resize-none"
                                        placeholder="A brief summary for the project card..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Full Content / Details (Modal)</label>
                                    <textarea
                                        rows={5}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors resize-none font-mono text-sm"
                                        placeholder="Markdown supported. Detailed case study goes here..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">GitHub URL (Optional)</label>
                                        <input
                                            type="url"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Live Demo URL (Optional)</label>
                                        <input
                                            type="url"
                                            value={formData.demo}
                                            onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Technologies / Tags</label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(e); } }}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                            placeholder="React, Next.js, etc... (Press Enter to add)"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl border border-white/5 min-h-[50px]">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-white/10 text-white text-sm font-medium rounded-lg border border-white/10">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="p-0.5 hover:bg-white/20 rounded-md transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                        {formData.tags.length === 0 && (
                                            <span className="text-sm text-[#6B6B8A] self-center pl-2">No tags added yet.</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Technologies / Tags</label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(e); } }}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                            placeholder="React, Next.js, etc... (Press Enter to add)"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl border border-white/5 min-h-[50px]">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-white/10 text-white text-sm font-medium rounded-lg border border-white/10">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="p-0.5 hover:bg-white/20 rounded-md transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                        {formData.tags.length === 0 && (
                                            <span className="text-sm text-[#6B6B8A] self-center pl-2">No tags added yet.</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                    />
                                </div>

                            </form>

                            <div className="p-6 border-t border-white/5 shrink-0 flex justify-end gap-3 bg-[#12121A]">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="px-5 py-2.5 text-sm font-medium text-[#8B8BAA] hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    <Check size={16} />
                                    {editingId ? 'Save Changes' : 'Create Project'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectsAdmin;
