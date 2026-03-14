import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await signIn(email, password);
            navigate('/admin');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to sign in. Check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            await signUp(email, password);
            setSuccess('Account created! Please check your email for confirmation (if required) or try signing in.');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to create account.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px 12px 42px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        color: '#F0F0FF',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease',
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent" style={{ zIndex: 10 }}>
            {/* Background elements */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)', filter: 'blur(60px)' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-8 rounded-2xl relative"
                style={{
                    background: 'rgba(18,18,26,0.8)',
                    border: '1px solid rgba(139,92,246,0.15)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    zIndex: 20
                }}
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.15))',
                            border: '1px solid rgba(139,92,246,0.3)'
                        }}
                    >
                        <Lock size={28} color="#8B5CF6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Admin Access
                    </h1>
                    <p className="mt-2 text-sm text-[#8B8BAA]">Sign in securely to manage your portfolio</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B8A] group-focus-within:text-[#8B5CF6] transition-colors" size={18} />
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                            className="focus:border-[#8B5CF6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B8A] group-focus-within:text-[#8B5CF6] transition-colors" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                            className="focus:border-[#8B5CF6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
                        />
                    </div>

                    <div className="mt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                                boxShadow: '0 8px 25px rgba(139,92,246,0.3)',
                                opacity: isLoading ? 0.7 : 1,
                                transform: isLoading ? 'scale(0.98)' : 'scale(1)',
                            }}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Sign In securely <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <a href="/" className="text-sm transition-colors hover:text-white" style={{ color: '#6B6B8A' }}>
                            &larr; Back to Portfolio
                        </a>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
