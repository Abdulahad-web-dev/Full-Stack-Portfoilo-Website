import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, Check, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceAdmin = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        period: '',
        description: '',
        order: 0
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('experience')
                .select('*')
                .order('order', { ascending: true });

            if (error) throw error;
            setExperiences(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (experience = null) => {
        if (experience) {
            setFormData({
                title: experience.title,
                company: experience.company,
                period: experience.period,
                description: experience.description,
                order: experience.order || 0
            });
            setEditingId(experience.id);
        } else {
            setFormData({
                title: '',
                company: '',
                period: '',
                description: '',
                order: experiences.length
            });
            setEditingId(null);
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase
                    .from('experience')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('experience')
                    .insert([formData]);
                if (error) throw error;
            }
            fetchExperiences();
            handleCloseForm();
        } catch (err) {
            alert('Error saving experience: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            try {
                const { error } = await supabase
                    .from('experience')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                fetchExperiences();
            } catch (err) {
                alert('Error deleting experience: ' + err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#12121A] p-6 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Experience</h2>
                    <p className="text-[#8B8BAA] text-sm">Manage your work history and positions.</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#06B6D4] hover:bg-[#0891B2] text-white rounded-xl text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Add Experience
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader className="animate-spin text-[#06B6D4]" size={32} />
                </div>
            ) : error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                    {error}
                </div>
            ) : (
                <div className="space-y-4">
                    {experiences.map((exp, index) => (
                        <div key={exp.id} className="group bg-[#12121A] p-5 rounded-2xl border border-white/5 hover:border-[#06B6D4]/30 transition-colors flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-[#8B8BAA] mt-1 mb-3">
                                    <span className="font-medium text-[#06B6D4]">{exp.company}</span>
                                    <span>•</span>
                                    <span>{exp.period}</span>
                                </div>
                                <p className="text-[#6B6B8A] text-sm leading-relaxed">{exp.description}</p>
                            </div>

                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenForm(exp)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {experiences.length === 0 && (
                        <div className="text-center py-12 text-[#8B8BAA] border border-dashed border-white/10 rounded-2xl">
                            No experience items found. Add one to get started.
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
                            className="bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
                                <h3 className="text-xl font-bold text-white">
                                    {editingId ? 'Edit Experience' : 'Add New Experience'}
                                </h3>
                                <button onClick={handleCloseForm} className="text-[#8B8BAA] hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#06B6D4] transition-colors"
                                        placeholder="e.g. Senior Frontend Developer"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Company</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#06B6D4] transition-colors"
                                            placeholder="e.g. Tech Corp"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Period</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.period}
                                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#06B6D4] transition-colors"
                                            placeholder="e.g. Jan 2021 - Present"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#06B6D4] transition-colors resize-none"
                                        placeholder="Describe your responsibilities and achievements..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Sort Order (lower appears first)</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#06B6D4] transition-colors"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-white/5 shrink-0 pt-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseForm}
                                        className="px-5 py-2.5 text-sm font-medium text-[#8B8BAA] hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-2.5 bg-[#06B6D4] hover:bg-[#0891B2] text-white rounded-xl text-sm font-medium transition-colors"
                                    >
                                        <Check size={16} />
                                        {editingId ? 'Save Changes' : 'Create Experience'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExperienceAdmin;
