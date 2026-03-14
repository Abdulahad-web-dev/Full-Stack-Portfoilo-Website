import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

const Contact = () => {
    const { data: settingsData } = useSupabaseQuery('settings', {
        eq: { column: 'id', value: 1 }
    });
    const siteData = settingsData?.[0] || null;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [focused, setFocused] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        const formData = new FormData(e.target);

        try {
            const { error } = await supabase.from('messages').insert([{
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
            }]);

            if (error) throw error;

            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 5000);
            e.target.reset();
        } catch (err) {
            setErrorMsg(err.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <MapPin size={18} />,
            label: 'Location',
            value: 'Punjab, Multan',
            color: '#8B5CF6',
        },
        {
            icon: <Mail size={18} />,
            label: 'Email',
            value: siteData?.email || 'abdulahadwarraich.web@gmail.com',
            href: `mailto:${siteData?.email || 'abdulahadwarraich.web@gmail.com'}`,
            color: '#06B6D4',
        },
        {
            icon: <Phone size={18} />,
            label: 'Phone',
            value: '03000479696',
            color: '#10B981',
        },
    ];

    const socials = [
        { icon: <Github size={18} />, href: siteData?.github_url || 'https://github.com', label: 'GitHub' },
        { icon: <Linkedin size={18} />, href: siteData?.linkedin_url || 'https://linkedin.com', label: 'LinkedIn' },
        { icon: <Mail size={18} />, href: `mailto:${siteData?.email || 'abdulahadwarraich.web@gmail.com'}`, label: 'Email' },
    ];

    const inputStyle = (name) => ({
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${focused === name ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.06)'}`,
        color: '#F0F0FF',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxShadow: focused === name ? '0 0 0 3px rgba(139,92,246,0.1)' : 'none',
    });

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)', filter: 'blur(60px)' }}
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: '#8B5CF6' }}>
                        Get In Touch
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Contact Me
                    </h2>
                    <p className="mt-4 text-sm" style={{ color: '#8B8BAA' }}>
                        Let's discuss your next project or just say hello
                    </p>
                    <div className="mt-4 mx-auto w-16 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />
                </motion.div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8">

                    {/* Left — Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-white mb-3">Let's Work Together</h3>
                            <p className="text-sm leading-relaxed" style={{ color: '#8B8BAA' }}>
                                I'm always excited to work on creative projects or collaborate on challenging ideas.
                                With my expertise in <strong>Skills & Technologies</strong>, let's build something amazing together.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {contactInfo.map((item) => (
                                <motion.div
                                    key={item.label}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer group"
                                    style={{ background: 'rgba(18,18,26,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = `${item.color}30`;
                                        e.currentTarget.style.background = `${item.color}08`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                                        e.currentTarget.style.background = 'rgba(18,18,26,0.6)';
                                    }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${item.color}15`, color: item.color }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs mb-0.5" style={{ color: '#6B6B8A' }}>{item.label}</p>
                                        {item.href ? (
                                            <a href={item.href} className="text-sm font-medium" style={{ color: '#C4C4E0' }}>
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="text-sm font-medium" style={{ color: '#C4C4E0' }}>{item.value}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social links */}
                        <div>
                            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6B6B8A' }}>Follow Me</p>
                            <div className="flex gap-3">
                                {socials.map((social) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -4, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                                        style={{
                                            background: 'rgba(139,92,246,0.08)',
                                            border: '1px solid rgba(139,92,246,0.2)',
                                            color: '#8B8BAA',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'rgba(139,92,246,0.2)';
                                            e.currentTarget.style.color = '#A78BFA';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                                            e.currentTarget.style.color = '#8B8BAA';
                                        }}
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-3 relative"
                    >
                        <div
                            className="p-6 md:p-8 rounded-2xl relative overflow-hidden"
                            style={{
                                background: 'rgba(18,18,26,0.9)',
                                border: '1px solid rgba(139,92,246,0.1)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <AnimatePresence>
                                {isSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl"
                                        style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(10px)' }}
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
                                        >
                                            <CheckCircle2 size={32} style={{ color: '#10B981' }} />
                                        </motion.div>
                                        <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                                        <p className="text-sm text-center px-6" style={{ color: '#8B8BAA' }}>
                                            Thank you for reaching out. I'll get back to you soon.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errorMsg && (
                                    <div className="p-3 rounded-lg text-sm text-center" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                                        {errorMsg}
                                    </div>
                                )}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs mb-2" style={{ color: '#8B8BAA' }}>Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            required
                                            style={inputStyle('name')}
                                            onFocus={() => setFocused('name')}
                                            onBlur={() => setFocused('')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs mb-2" style={{ color: '#8B8BAA' }}>Your Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            required
                                            style={inputStyle('email')}
                                            onFocus={() => setFocused('email')}
                                            onBlur={() => setFocused('')}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs mb-2" style={{ color: '#8B8BAA' }}>Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="Project Collaboration"
                                        required
                                        style={inputStyle('subject')}
                                        onFocus={() => setFocused('subject')}
                                        onBlur={() => setFocused('')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs mb-2" style={{ color: '#8B8BAA' }}>Your Message</label>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        placeholder="Tell me about your project..."
                                        required
                                        style={{ ...inputStyle('message'), resize: 'none' }}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused('')}
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 disabled:opacity-60"
                                    style={{
                                        background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                                        boxShadow: '0 0 25px rgba(139,92,246,0.3)',
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Send Message
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
