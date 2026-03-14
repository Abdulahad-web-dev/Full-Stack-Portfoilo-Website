import React from 'react';

const Badge = ({ children, className = '' }) => {
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
