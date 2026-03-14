import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, Database, Bot } from 'lucide-react';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

const experiences = [
    {
        title: "Computer Science Student",
        company: "University",
        duration: "2022 – Present",
        description: "Developing a strong foundation in software engineering, algorithms, data structures, and system design through rigorous academic coursework and projects.",
        icon: <GraduationCap size={20} />,
        color: '#8B5CF6',
    },
    {
        title: "Web Development Journey",
        company: "Self-Taught",
        duration: "2021 – Present",
        description: "Mastering modern frontend and backend technologies including React, Node.js, Tailwind CSS, and modern development workflows and deployment practices.",
        icon: <Code2 size={20} />,
        color: '#06B6D4',
    },
    {
        title: "Database Systems Projects",
        company: "Academic",
        duration: "2023 – Present",
        description: "Building robust data pipelines and analyzing complex datasets using MongoDB, aggregation frameworks, and advanced query optimization techniques.",
        icon: <Database size={20} />,
        color: '#10B981',
    },
    {
        title: "AI Assistant Development",
        company: "Personal Project",
        duration: "2024 – Present",
        description: "Exploring artificial intelligence, speech processing, and LLM integrations to build intelligent assistants and automate workflows.",
        icon: <Bot size={20} />,
        color: '#F59E0B',
    }
];

const Experience = () => {
    const { data: dbExperiences, loading } = useSupabaseQuery('experience', {
        order: { column: 'order', ascending: true }
    });

    // Map DB items to UI items and assign icons based on index
    const icons = [<Code2 size={20} />, <Database size={20} />, <Bot size={20} />, <GraduationCap size={20} />];
    const colors = ['#06B6D4', '#10B981', '#F59E0B', '#8B5CF6'];

    const displayData = dbExperiences?.length > 0 ? dbExperiences.map((exp, i) => ({
        ...exp,
        icon: icons[i % icons.length],
        color: colors[i % colors.length]
    })) : experiences;

    return (
        <section id="experience" className="py-24 relative overflow-hidden">
            <div
                className="absolute inset-0 -z-10"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.03), transparent)' }}
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
                        My Journey
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Experience
                    </h2>
                    <div className="mt-4 mx-auto w-16 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : displayData.map((exp, index) => (
                        <motion.div
                            key={exp.title}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative flex gap-6 mb-8 last:mb-0 group"
                        >
                            {/* Timeline line */}
                            {index < experiences.length - 1 && (
                                <div
                                    className="absolute left-5 top-12 bottom-[-2rem] w-px pointer-events-none"
                                    style={{ background: `linear-gradient(to bottom, ${exp.color}40, transparent)` }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300"
                                style={{
                                    background: `${exp.color}15`,
                                    border: `1px solid ${exp.color}30`,
                                    color: exp.color,
                                    boxShadow: `0 0 0 0 ${exp.color}40`,
                                }}
                                whileInView={{
                                    boxShadow: [`0 0 0px ${exp.color}00`, `0 0 20px ${exp.color}30`, `0 0 0px ${exp.color}00`],
                                    transition: { delay: index * 0.1 + 0.3, duration: 1 }
                                }}
                            >
                                {exp.icon}
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="flex-1 p-5 rounded-2xl transition-all duration-300"
                                style={{
                                    background: 'rgba(18,18,26,0.8)',
                                    border: `1px solid rgba(255,255,255,0.05)`,
                                    backdropFilter: 'blur(10px)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = `${exp.color}30`;
                                    e.currentTarget.style.boxShadow = `0 4px 24px ${exp.color}10`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="text-base font-bold text-white">{exp.title}</h3>
                                        <p className="text-sm" style={{ color: exp.color }}>{exp.company}</p>
                                    </div>
                                    <span
                                        className="text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 self-start"
                                        style={{
                                            background: `${exp.color}10`,
                                            border: `1px solid ${exp.color}25`,
                                            color: exp.color,
                                        }}
                                    >
                                        {exp.duration}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: '#6B6B8A' }}>
                                    {exp.description}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
