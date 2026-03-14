import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ subtitle, title, alignment = 'center', className = '' }) => {
    return (
        <div className={`mb-12 ${alignment === 'center' ? 'text-center' : 'text-left'} ${className}`}>
            {subtitle && (
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-secondary font-medium tracking-wider uppercase text-sm mb-2 block"
                >
                    {subtitle}
                </motion.span>
            )}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold font-sans text-text tracking-tight"
            >
                {title}
            </motion.h2>
            <div className={`w-20 h-1 bg-gradient-to-r from-primary to-secondary mt-6 rounded-full ${alignment === 'center' ? 'mx-auto' : ''}`} />
        </div>
    );
};

export default SectionTitle;
