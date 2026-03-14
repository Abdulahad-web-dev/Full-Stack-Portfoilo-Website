import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen } from 'lucide-react';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

const EducationPage = () => {
    const { data: educationData, loading, error } = useSupabaseQuery('education', {
        order: { column: 'order', ascending: true }
    });

    const staticEducation = [
        {
            degree: "BS Computer Science",
            institution: "University Name",
            period: "2022 - 2026",
            description: "Major subjects, thesis, achievements...",
            icon: <GraduationCap size={20} />,
            color: '#8B5CF6'
        },
        {
            degree: "Intermediate in Pre-Engineering",
            institution: "College Name",
            period: "2020 - 2022",
            description: "High grades in core sciences",
            icon: <BookOpen size={20} />,
            color: '#06B6D4'
        }
    ];

    const displayData = educationData?.length > 0 ? educationData.map((ed, i) => ({
        ...ed,
        icon: i % 2 === 0 ? <GraduationCap size={20} /> : <BookOpen size={20} />,
        color: i % 2 === 0 ? '#8B5CF6' : '#06B6D4'
    })) : staticEducation;

    return (
        <section id="education" className="py-24 relative overflow-hidden min-h-screen">
            <div
                className="absolute inset-0 -z-10"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.03), transparent)' }}
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10 pt-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: '#06B6D4' }}>
                        Academic Background
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Education
                    </h2>
                    <div className="mt-4 mx-auto w-16 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        {displayData.map((ed, index) => (
                            <motion.div
                                key={ed.id || ed.degree}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="relative flex gap-6 mb-8 last:mb-0 group"
                            >
                                {/* Timeline line */}
                                {index < displayData.length - 1 && (
                                    <div
                                        className="absolute left-5 top-12 bottom-[-2rem] w-px pointer-events-none"
                                        style={{ background: `linear-gradient(to bottom, ${ed.color}40, transparent)` }}
                                    />
                                )}

                                {/* Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300"
                                    style={{
                                        background: `${ed.color}15`,
                                        border: `1px solid ${ed.color}30`,
                                        color: ed.color,
                                    }}
                                >
                                    {ed.icon}
                                </motion.div>

                                {/* Content */}
                                <div
                                    className="flex-1 p-6 rounded-2xl transition-all duration-300"
                                    style={{
                                        background: 'rgba(18,18,26,0.8)',
                                        border: `1px solid rgba(255,255,255,0.05)`,
                                        backdropFilter: 'blur(10px)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = `${ed.color}30`;
                                        e.currentTarget.style.boxShadow = `0 4px 24px ${ed.color}10`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{ed.degree}</h3>
                                            <p className="text-base" style={{ color: ed.color }}>{ed.institution}</p>
                                        </div>
                                        <span
                                            className="text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 self-start"
                                            style={{
                                                background: `${ed.color}10`,
                                                border: `1px solid ${ed.color}25`,
                                                color: ed.color,
                                            }}
                                        >
                                            {ed.period}
                                        </span>
                                    </div>

                                    {ed.description && (
                                        <div className="text-sm mt-3" style={{ color: '#8B8BAA' }}>
                                            <p>{ed.description}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default EducationPage;
