import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

const AnimatedCounter = ({ value, duration = 2, delay = 0 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                const controls = animate(0, value, {
                    duration,
                    ease: "easeOut",
                    onUpdate(val) { setCount(Math.floor(val)); }
                });
                return () => controls.stop();
            }, delay * 1000);
        }
    }, [value, duration, isInView, delay]);

    return <span ref={ref}>{count}</span>;
};

const SkillBar = ({ name, level, index }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium" style={{ color: '#C4C4E0' }}>{name}</span>
            <span className="text-sm font-bold" style={{ color: '#8B5CF6' }}>{level}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${level}%` }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.1 * index, ease: "easeOut" }}
                className="h-full rounded-full relative overflow-hidden"
                style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }}
            >
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 100%)'
                }} />
            </motion.div>
        </div>
    </div>
);

const About = () => {
    const { data: settingsData } = useSupabaseQuery('settings', {
        eq: { column: 'id', value: 1 }
    });

    const siteData = settingsData?.[0] || null;

    const stats = [
        { label: 'Projects Done', value: 10, suffix: '+' },
        { label: 'Technologies', value: 12, suffix: '+' },
        { label: 'Repositories', value: 20, suffix: '+' },
        { label: 'Years Learning', value: 3, suffix: '+' },
    ];

    const skills = [
        { name: 'Web Development', level: 90 },
        { name: 'UI/UX Design', level: 80 },
        { name: 'JavaScript', level: 85 },
        { name: 'React & CSS', level: 90 },
    ];

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            {/* Section divider */}
            <div className="section-divider mb-0" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: '#8B5CF6' }}>
                        Get To Know Me
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        About Me
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Left - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
                        className="relative group"
                    >
                        <div
                            className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-sm mx-auto"
                            style={{
                                border: '1px solid rgba(139,92,246,0.2)',
                                boxShadow: '0 0 40px rgba(139,92,246,0.15)',
                            }}
                        >
                            <img
                                src={siteData?.profile_image_url || "/profile.png"}
                                alt={siteData?.site_name || "Profile"}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(to top, rgba(10,10,15,0.8) 0%, rgba(139,92,246,0.1) 50%, transparent 100%)'
                                }}
                            />
                            {/* Corner accent */}
                            <div
                                className="absolute top-0 left-0 w-16 h-16 rounded-br-full"
                                style={{ background: 'rgba(139,92,246,0.2)' }}
                            />
                        </div>

                        {/* Glow */}
                        <div
                            className="absolute inset-0 -z-10 rounded-2xl transition-all duration-700"
                            style={{
                                background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.2), transparent 70%)',
                                filter: 'blur(30px)',
                            }}
                        />
                    </motion.div>

                    {/* Right - Text & Skills */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3
                                className="text-2xl font-bold mb-4"
                                style={{
                                    background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Skills & Technologies
                            </h3>
                            <div className="space-y-4 text-sm md:text-base leading-relaxed" style={{ color: '#8B8BAA' }}>
                                {siteData?.bio ? (
                                    <p style={{ whiteSpace: 'pre-line' }}>{siteData.bio}</p>
                                ) : (
                                    <>
                                        <p>
                                            I'm a dedicated front-end developer with a focus on creating exceptional digital experiences.
                                            My approach combines technical expertise with creative problem-solving.
                                        </p>
                                        <p>
                                            I believe in crafting solutions that not only meet but exceed client expectations. I believe
                                            in writing clean, maintainable code and creating intuitive user interfaces.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Skill bars */}
                        <div>
                            {skills.map((skill, idx) => (
                                <SkillBar key={skill.name} name={skill.name} level={skill.level} index={idx} />
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    className="text-center p-3 rounded-xl"
                                    style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}
                                >
                                    <div
                                        className="text-2xl md:text-3xl font-bold"
                                        style={{
                                            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        <AnimatedCounter value={stat.value} delay={i * 0.1} />
                                        {stat.suffix}
                                    </div>
                                    <div className="text-xs mt-1" style={{ color: '#8B8BAA' }}>{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
