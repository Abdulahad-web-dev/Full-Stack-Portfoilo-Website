import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeHash, setActiveHash] = useState('#home');

    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Update active section based on scroll position
            const sections = navLinks.map(link => link.href.substring(1));
            let current = '';
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && window.scrollY >= element.offsetTop - 150) {
                    current = `#${section}`;
                }
            }
            if (current) setActiveHash(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'py-3'
                : 'bg-transparent py-6'
                }`}
            style={isScrolled ? {
                background: 'rgba(10,10,15,0.85)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 1px 0 rgba(139,92,246,0.15)',
            } : {}}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span
                        className="font-bold text-xl tracking-tight"
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Port<span style={{ WebkitTextFillColor: '#F0F0FF' }}>folio</span>
                    </span>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-all duration-300 relative group ${activeHash === link.href
                                ? 'text-white'
                                : 'text-muted hover:text-white'
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveHash(link.href);
                                const el = document.querySelector(link.href);
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            {link.name}
                            <span
                                className={`absolute -bottom-1 left-0 h-px bg-primary transform origin-left transition-transform duration-300 ${activeHash === link.href
                                    ? 'scale-x-100 w-full'
                                    : 'scale-x-0 w-full group-hover:scale-x-100'
                                    }`}
                            />
                        </a>
                    ))}

                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('contact');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2 rounded-full text-sm font-medium text-white transition-all duration-300 hover:shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                            boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.6)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.3)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Hire Me
                    </a>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-text p-2 rounded-lg"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t"
                        style={{
                            background: 'rgba(10,10,15,0.95)',
                            borderColor: 'rgba(139,92,246,0.2)',
                        }}
                    >
                        <nav className="flex flex-col py-4 px-6 gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={`text-lg font-medium py-2 transition-colors ${activeHash === link.href ? 'text-primary' : 'text-muted'
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveHash(link.href);
                                        setMobileMenuOpen(false);
                                        const el = document.querySelector(link.href);
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
