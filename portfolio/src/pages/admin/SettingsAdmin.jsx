import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, Loader, Image as ImageIcon } from 'lucide-react';

const SettingsAdmin = () => {
    const [formData, setFormData] = useState({
        name: '', title: '', bio: '', career_objective: '',
        github_url: '', linkedin_url: '', email: '',
        profile_image_url: '', cv_url: '', site_name: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Upload state
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingCV, setUploadingCV] = useState(false);
    const imageInputRef = useRef(null);
    const cvInputRef = useRef(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
            if (data) setFormData(data);
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileUpload = async (e, type) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const isImage = type === 'image';

            if (isImage) setUploadingImage(true);
            else setUploadingCV(true);

            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${isImage ? 'profile' : 'cv'}/${fileName}`;

            // Upload the file to Supabase storage
            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get the public URL
            const { data } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            if (isImage) {
                setFormData(prev => ({ ...prev, profile_image_url: data.publicUrl }));
            } else {
                setFormData(prev => ({ ...prev, cv_url: data.publicUrl }));
            }

            setMessage({ type: 'success', text: `${isImage ? 'Image' : 'CV'} uploaded successfully. Don't forget to save settings!` });

        } catch (error) {
            setMessage({ type: 'error', text: 'Upload failed: ' + error.message });
        } finally {
            if (type === 'image') setUploadingImage(false);
            else setUploadingCV(false);

            // Reset inputs
            if (imageInputRef.current) imageInputRef.current.value = '';
            if (cvInputRef.current) cvInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        // Add logic to check if setting 1 exists, insert if not, else update
        const { error } = await supabase.from('settings').upsert({ id: 1, ...formData });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
        setSaving(false);
    };

    const inputClass = "w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] transition-all text-sm";
    const labelClass = "block text-xs font-medium text-[#8B8BAA] mb-1.5 ml-1";

    if (loading) return <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="max-w-4xl pb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Site Settings</h2>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm border ${message.type === 'success' ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]' : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-[#12121A]/80 border border-[#8B5CF6]/20 rounded-2xl p-6 md:p-8">

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-5 border-r border-white/5 pr-8">
                        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
                            Global & Hero
                        </h3>
                        <div>
                            <label className={labelClass}>Site Name (Logo Text)</label>
                            <input type="text" name="site_name" value={formData.site_name || ''} onChange={handleChange} className={inputClass} placeholder="e.g. M. Abdullah" />
                        </div>
                        <div>
                            <label className={labelClass}>Full Name (Hero)</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Hero Title</label>
                            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>CV/Resume URL</label>
                            <div className="flex gap-2">
                                <input type="url" name="cv_url" value={formData.cv_url || ''} onChange={handleChange} placeholder="https://..." className={`${inputClass} flex-1`} />
                                <button
                                    type="button"
                                    onClick={() => cvInputRef.current?.click()}
                                    disabled={uploadingCV}
                                    className="px-4 py-2 bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 text-[#06B6D4] rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border border-[#06B6D4]/30 disabled:opacity-50 whitespace-nowrap"
                                >
                                    {uploadingCV ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                                    Upload
                                </button>
                                <input
                                    type="file"
                                    ref={cvInputRef}
                                    onChange={(e) => handleFileUpload(e, 'cv')}
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                />
                            </div>
                            <p className="text-[10px] text-[#6B6B8A] mt-1.5 ml-1">Upload a PDF or paste a direct link.</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">About Section & Profile</h3>

                        <div>
                            <label className={labelClass}>Profile Image URL</label>
                            <div className="flex items-center gap-4 mb-2 mt-1">
                                <div className="w-16 h-16 rounded-full border border-white/10 overflow-hidden bg-[#1A1A24] flex-shrink-0">
                                    {formData.profile_image_url ? (
                                        <img src={formData.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-[#6B6B8A]">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                        <input type="url" name="profile_image_url" value={formData.profile_image_url || ''} onChange={handleChange} placeholder="https://..." className={`${inputClass} flex-1`} />
                                        <button
                                            type="button"
                                            onClick={() => imageInputRef.current?.click()}
                                            disabled={uploadingImage}
                                            className="px-4 py-2 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border border-[#8B5CF6]/30 disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {uploadingImage ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                                            Upload
                                        </button>
                                        <input
                                            type="file"
                                            ref={imageInputRef}
                                            onChange={(e) => handleFileUpload(e, 'image')}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Career Objective / Short Intro</label>
                            <textarea name="career_objective" value={formData.career_objective || ''} onChange={handleChange} rows="3" className={`${inputClass} resize-none`} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Detailed Bio</h3>
                    <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="6" className={`${inputClass} resize-y leading-relaxed`} placeholder="Detailed biography for the About page. You can use markdown styling." />
                </div>

                <div className="space-y-5">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Links & Contact</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>GitHub URL</label>
                            <input type="url" name="github_url" value={formData.github_url || ''} onChange={handleChange} className={inputClass} placeholder="https://github.com/..." />
                        </div>
                        <div>
                            <label className={labelClass}>LinkedIn URL</label>
                            <input type="url" name="linkedin_url" value={formData.linkedin_url || ''} onChange={handleChange} className={inputClass} placeholder="https://linkedin.com/..." />
                        </div>
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white rounded-xl font-bold shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default SettingsAdmin;
