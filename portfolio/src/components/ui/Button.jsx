import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    icon,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 px-6 py-3",
        secondary: "bg-cards border border-white/10 text-text hover:bg-cards/80 hover:border-white/20 px-6 py-3",
        outline: "border-2 border-primary text-primary hover:bg-primary/10 px-6 py-3",
        icon: "p-2 rounded-full hover:bg-white/10 text-muted hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </motion.button>
    );
};

export default Button;
