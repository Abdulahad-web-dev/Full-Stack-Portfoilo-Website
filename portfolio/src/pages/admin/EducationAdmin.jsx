import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, Check, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EducationAdmin = () => {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        degree: '',
        institution: '',
        period: '',
        description: '',
        color: '#10B981',
        order: 0
    });

    useEffect(() => {
        fetchEducation();
    }, []);

    const fetchEducation = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('education')
                .select('*')
                .order('order', { ascending: true });

            if (error) throw error;
            setEducation(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (edu = null) => {
        if (edu) {
            setFormData({
                degree: edu.degree,
                institution: edu.institution,
                period: edu.period,
                description: edu.description,
                color: edu.color || '#10B981',
                order: edu.order || 0
            });
            setEditingId(edu.id);
        } else {
            setFormData({
                degree: '',
                institution: '',
                period: '',
                description: '',
                color: '#10B981',
                order: education.length
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
                    .from('education')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('education')
                    .insert([formData]);
                if (error) throw error;
            }
            fetchEducation();
            handleCloseForm();
        } catch (err) {
            alert('Error saving education: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this education entry?')) {
            try {
                const { error } = await supabase
                    .from('education')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                fetchEducation();
            } catch (err) {
                alert('Error deleting education: ' + err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#12121A] p-6 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Education</h2>
                    <p className="text-[#8B8BAA] text-sm">Manage your academic background and qualifications.</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Add Education
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader className="animate-spin text-[#10B981]" size={32} />
                </div>
            ) : error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                    {error}
                </div>
            ) : (
                <div className="space-y-4">
                    {education.map((edu, index) => (
                        <div key={edu.id} className="group bg-[#12121A] p-5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 transition-colors flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white" style={{ color: edu.color || '#F0F0FF' }}>{edu.degree}</h3>
                                <div className="flex items-center gap-2 text-sm text-[#8B8BAA] mt-1 mb-3">
                                    <span className="font-medium text-[#10B981]">{edu.institution}</span>
                                    <span>•</span>
                                    <span>{edu.period}</span>
                                </div>
                                <p className="text-[#6B6B8A] text-sm leading-relaxed">{edu.description}</p>
                            </div>

                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenForm(edu)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(edu.id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {education.length === 0 && (
                        <div className="text-center py-12 text-[#8B8BAA] border border-dashed border-white/10 rounded-2xl">
                            No education entries found. Add one to get started.
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
                            className="bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
                                <h3 className="text-xl font-bold text-white">
                                    {editingId ? 'Edit Education' : 'Add New Education'}
                                </h3>
                                <button onClick={handleCloseForm} className="text-[#8B8BAA] hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Degree / Qualification</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.degree}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#10B981] transition-colors"
                                        placeholder="e.g. BS Computer Science"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Institution</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.institution}
                                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#10B981] transition-colors"
                                            placeholder="e.g. University Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Period</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.period}
                                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#10B981] transition-colors"
                                            placeholder="e.g. 2018 - 2022"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Description (Optional)</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#10B981] transition-colors resize-none"
                                        placeholder="Major subjects, thesis, achievements..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
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
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#10B981] transition-colors"
                                                placeholder="#10B981"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Sort Order (lower first)</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#10B981] transition-colors"
                                        />
                                    </div>
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
                                        className="flex items-center gap-2 px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-sm font-medium transition-colors"
                                    >
                                        <Check size={16} />
                                        {editingId ? 'Save Changes' : 'Create Education'}
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

export default EducationAdmin;
