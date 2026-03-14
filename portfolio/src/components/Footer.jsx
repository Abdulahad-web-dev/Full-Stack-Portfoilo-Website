import React from 'react';
import { Github, Linkedin, Mail, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    const quickLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ];

    const services = [
        'Web Development',
        'UI/UX Design',
        'Mobile Apps',
        'Freelancing',
        'Branding',
    ];

    const socials = [
        { icon: <Github size={16} />, href: 'https://github.com', label: 'GitHub' },
        { icon: <Linkedin size={16} />, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: <Twitter size={16} />, href: 'https://twitter.com', label: 'Twitter' },
        { icon: <Instagram size={16} />, href: 'https://instagram.com', label: 'Instagram' },
        { icon: <Mail size={16} />, href: 'mailto:abdulahadwarraich.web@gmail.com', label: 'Email' },
    ];

    return (
        <footer style={{ background: 'rgba(8,8,12,0.95)', borderTop: '1px solid rgba(139,92,246,0.1)' }}>
            <div className="container mx-auto px-6 md:px-12 py-16">

                {/* Top row */}
                <div className="grid md:grid-cols-3 gap-12 pb-12 border-b" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>

                    {/* Brand */}
                    <div>
                        <a href="#home" className="inline-block mb-4">
                            <span
                                className="font-bold text-2xl"
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Port<span style={{ WebkitTextFillColor: '#F0F0FF' }}>folio</span>
                            </span>
                        </a>
                        <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B6B8A' }}>
                            Creating highly impactful websites that look beautiful. I'm building
                            something extraordinary every single day.
                        </p>
                        <div className="flex gap-3">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                                    style={{
                                        background: 'rgba(139,92,246,0.08)',
                                        border: '1px solid rgba(139,92,246,0.15)',
                                        color: '#8B8BAA',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(139,92,246,0.2)';
                                        e.currentTarget.style.color = '#A78BFA';
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                                        e.currentTarget.style.color = '#8B8BAA';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: '#8B5CF6' }}>
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm transition-all duration-200 hover:pl-2 inline-block"
                                        style={{ color: '#6B6B8A' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = '#A78BFA'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = '#6B6B8A'; }}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: '#8B5CF6' }}>
                            Services
                        </h4>
                        <ul className="space-y-2">
                            {services.map((service) => (
                                <li key={service}>
                                    <span className="text-sm" style={{ color: '#6B6B8A' }}>{service}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs" style={{ color: '#4A4A6A' }}>
                        © {new Date().getFullYear()} Abdulahad Warraich. All Rights Reserved.
                    </p>
                    <p className="text-xs" style={{ color: '#4A4A6A' }}>
                        Built with React & Tailwind CSS
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
