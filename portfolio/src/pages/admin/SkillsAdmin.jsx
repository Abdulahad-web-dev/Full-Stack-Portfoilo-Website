import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, Check, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillsAdmin = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend', // Default category
        level: 80,
        color: '#8B5CF6'
    });

    const categories = ['Frontend', 'Backend', 'Database', 'Tools'];

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .order('category')
                .order('name');

            if (error) throw error;
            setSkills(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (skill = null) => {
        if (skill) {
            setFormData({
                name: skill.name,
                category: skill.category,
                level: skill.level,
                color: skill.color || '#8B5CF6'
            });
            setEditingId(skill.id);
        } else {
            setFormData({
                name: '',
                category: 'Frontend',
                level: 80,
                color: '#8B5CF6'
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
                    .from('skills')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('skills')
                    .insert([formData]);
                if (error) throw error;
            }
            fetchSkills();
            handleCloseForm();
        } catch (err) {
            alert('Error saving skill: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this skill?')) {
            try {
                const { error } = await supabase
                    .from('skills')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                fetchSkills();
            } catch (err) {
                alert('Error deleting skill: ' + err.message);
            }
        }
    };

    // Group skills for display
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#12121A] p-6 rounded-2xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Skills</h2>
                    <p className="text-[#8B8BAA] text-sm">Manage your technical skills and proficiency levels.</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Add Skill
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
                    {Object.entries(groupedSkills).map(([category, items]) => (
                        <div key={category} className="bg-[#12121A] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                                <h3 className="font-semibold text-white">{category}</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {items.map(skill => (
                                    <div key={skill.id} className="group relative">
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-sm font-medium text-[#C4C4E0]">{skill.name}</span>
                                            <span className="text-sm font-bold" style={{ color: skill.color || '#8B5CF6' }}>{skill.level}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${skill.level}%`, background: skill.color || '#8B5CF6' }}
                                            />
                                        </div>

                                        {/* Actions Overlay */}
                                        <div className="absolute inset-y-0 right-0 flex items-center justify-end gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-[#12121A] via-[#12121A] to-transparent pl-8">
                                            <button
                                                onClick={() => handleOpenForm(skill)}
                                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(skill.id)}
                                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
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
                            className="bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-white/5">
                                <h3 className="text-xl font-bold text-white">
                                    {editingId ? 'Edit Skill' : 'Add New Skill'}
                                </h3>
                                <button onClick={handleCloseForm} className="text-[#8B8BAA] hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Skill Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                        placeholder="e.g. React"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors appearance-none"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#8B8BAA] mb-1.5">Proficiency (%)</label>
                                        <input
                                            type="number"
                                            min="0" max="100"
                                            required
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                        />
                                    </div>
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
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                            placeholder="#8B5CF6"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseForm}
                                        className="px-5 py-2.5 text-sm font-medium text-[#8B8BAA] hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-medium transition-colors"
                                    >
                                        <Check size={16} />
                                        {editingId ? 'Save Changes' : 'Create Skill'}
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

export default SkillsAdmin;
