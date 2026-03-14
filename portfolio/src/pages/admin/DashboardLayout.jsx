import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Briefcase, Code, GraduationCap,
    MessageSquare, Settings, LogOut, Code2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// We'll map these routes to actual components in succeeding steps.
// For now, placeholder views.
import SkillsAdmin from './SkillsAdmin';
import ProjectsAdmin from './ProjectsAdmin';
import ExperienceAdmin from './ExperienceAdmin';
import EducationAdmin from './EducationAdmin';
import MessagesAdmin from './MessagesAdmin';
import SettingsAdmin from './SettingsAdmin';

const DashboardLayout = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navItems = [
        { path: '/admin/skills', label: 'Skills', icon: <Code2 size={18} /> },
        { path: '/admin/projects', label: 'Projects', icon: <Briefcase size={18} /> },
        { path: '/admin/experience', label: 'Experience', icon: <Code size={18} /> },
        { path: '/admin/education', label: 'Education', icon: <GraduationCap size={18} /> },
        { path: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
        { path: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
    ];

    return (
        <div className="min-h-screen flex bg-transparent text-[#F0F0FF] relative z-50">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 flex flex-col border-r border-[#8B5CF6]/20 bg-[#12121A]/40 backdrop-blur-xl">
                <div className="p-6 border-b border-[#8B5CF6]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-bold">
                            <LayoutDashboard size={18} />
                        </div>
                        <span className="font-bold tracking-wide">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-[#8B5CF6]/15 text-white shadow-sm ring-1 ring-[#8B5CF6]/30'
                                        : 'text-[#8B8BAA] hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className={isActive ? 'text-[#8B5CF6]' : ''}>{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#8B5CF6]/10">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-[#F87171] hover:bg-[#F87171]/10 text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                    <Link
                        to="/"
                        className="w-full flex mt-2 items-center gap-3 px-4 py-3 rounded-xl transition-colors text-[#6B6B8A] hover:bg-white/5 hover:text-white text-sm font-medium"
                    >
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        <Routes>
                            <Route path="/" element={<div className="p-8 text-center text-[#8B8BAA]">Welcome to Admin Dashboard.<br />Select an item from the sidebar to manage.</div>} />
                            <Route path="skills" element={<SkillsAdmin />} />
                            <Route path="projects" element={<ProjectsAdmin />} />
                            <Route path="experience" element={<ExperienceAdmin />} />
                            <Route path="education" element={<EducationAdmin />} />
                            <Route path="messages" element={<MessagesAdmin />} />
                            <Route path="settings" element={<SettingsAdmin />} />
                        </Routes>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
