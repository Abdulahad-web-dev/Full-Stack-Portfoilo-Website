import React from 'react';
import LiquidEther from './LiquidEther';

const Background3D = () => {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
            {/* Base dark background */}
            <div className="absolute inset-0 bg-[#0A0A0F]" />
            
            {/* Liquid Ether animation layer */}
            <div className="absolute inset-0 opacity-60">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={true}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>

            {/* Subtle gradient overlays for depth */}
            <div className="absolute inset-0 pointer-events-none">
                <div 
                    className="absolute inset-0 opacity-40"
                    style={{
                        background: 'radial-gradient(circle at 20% 30%, rgba(82, 39, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 159, 252, 0.1) 0%, transparent 50%)'
                    }}
                />
            </div>
            
            {/* Vignette effect */}
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, transparent 0%, rgba(10, 10, 15, 0.4) 100%)'
                }}
            />
        </div>
    );
};

export default Background3D;

