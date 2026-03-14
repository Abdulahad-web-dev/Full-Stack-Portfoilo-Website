import React from 'react';
import { motion } from 'framer-motion';

// Dynamic import using useSupabaseQuery hook
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

const SkillBar = ({ name, level, index, color }) => (
    <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" style={{ color: '#C4C4E0' }}>{name}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                color,
                background: `${color}15`,
                border: `1px solid ${color}30`,
            }}>
                {level}%
            </span>
        </div>
        <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${level}%` }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.2, delay: 0.15 * index, ease: "easeOut" }}
                className="h-full rounded-full relative overflow-hidden"
                style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
            >
                <div className="absolute right-0 top-0 bottom-0 w-8" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3))',
                    filter: 'blur(3px)',
                }} />
            </motion.div>
        </div>
    </div>
);

const Skills = () => {
    const { data: skillsData, loading } = useSupabaseQuery('skills', {
        order: { column: 'order', ascending: true }
    });

    // Group skills by category based on predefined order
    const categoriesMap = {
        'Frontend': { title: 'Frontend', icon: '🎨', color: '#8B5CF6', skills: [] },
        'Backend': { title: 'Backend & Database', icon: '⚙️', color: '#06B6D4', skills: [] },
        'Tools': { title: 'Tools & Others', icon: '🛠️', color: '#F59E0B', skills: [] },
    };

    if (skillsData) {
        skillsData.forEach(skill => {
            const cat = skill.category === 'Frontend' ? 'Frontend'
                : (skill.category === 'Backend' || skill.category === 'Database') ? 'Backend'
                    : 'Tools';
            if (categoriesMap[cat]) {
                categoriesMap[cat].skills.push({ name: skill.name, level: skill.level });
            }
        });
    }

    const groupedCategories = Object.values(categoriesMap).filter(c => c.skills.length > 0);

    return (
        <section id="skills" className="py-24 relative overflow-hidden">
            {/* Section bg */}
            <div
                className="absolute inset-0 -z-10"
                style={{ background: 'rgba(139,92,246,0.02)' }}
            />

            <div className="container mx-auto px-6 md:px-12">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: '#8B5CF6' }}>
                        My Technical Expertise
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Skills & Technologies
                    </h2>
                    <div className="mt-4 mx-auto w-16 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />
                </motion.div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {groupedCategories.map((cat, catIdx) => (
                            <motion.div
                                key={cat.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: catIdx * 0.15 }}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-2xl relative overflow-hidden"
                                style={{
                                    background: 'rgba(18,18,26,0.9)',
                                    border: `1px solid ${cat.color}20`,
                                    boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                {/* Glow */}
                                <div
                                    className="absolute top-0 left-0 w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ background: `radial-gradient(circle, ${cat.color}15, transparent 70%)` }}
                                />

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                        style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-base font-semibold text-white">{cat.title}</h3>
                                </div>

                                {cat.skills.map((skill, idx) => (
                                    <SkillBar
                                        key={skill.name}
                                        name={skill.name}
                                        level={skill.level}
                                        index={idx}
                                        color={cat.color}
                                    />
                                ))}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
