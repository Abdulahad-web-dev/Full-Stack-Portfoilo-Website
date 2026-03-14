import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if already logged in
        const token = localStorage.getItem('admin_token');
        if (token) navigate('/admin');
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            localStorage.setItem('admin_token', data.token);
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0A0A0F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
            padding: '20px',
        }}>
            {/* Background glows */}
            <div style={{
                position: 'fixed', top: '20%', left: '20%',
                width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'fixed', bottom: '20%', right: '20%',
                width: 300, height: 300, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />

            <div style={{
                width: '100%', maxWidth: 420,
                background: 'rgba(18,18,26,0.95)',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: 20,
                padding: '40px 36px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.05)',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: '50%', margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))',
                        border: '1px solid rgba(139,92,246,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Shield size={28} color="#8B5CF6" />
                    </div>
                    <h1 style={{ color: '#F0F0FF', fontSize: 24, fontWeight: 700, margin: '0 0 6px' }}>
                        Admin Access
                    </h1>
                    <p style={{ color: '#6B6B8A', fontSize: 14, margin: 0 }}>
                        Sign in to manage your portfolio
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 10,
                        padding: '10px 14px',
                        color: '#F87171',
                        fontSize: 13,
                        marginBottom: 20,
                        textAlign: 'center',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ display: 'block', color: '#8B8BAA', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} color="#4B5563" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@portfolio.com"
                                required
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    padding: '12px 14px 12px 42px',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 10,
                                    color: '#F0F0FF', fontSize: 14,
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 28 }}>
                        <label style={{ display: 'block', color: '#8B8BAA', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="#4B5563" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    padding: '12px 44px 12px 42px',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 10,
                                    color: '#F0F0FF', fontSize: 14,
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                }}
                            >
                                {showPassword
                                    ? <EyeOff size={16} color="#6B6B8A" />
                                    : <Eye size={16} color="#6B6B8A" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '13px',
                            background: loading
                                ? 'rgba(139,92,246,0.4)'
                                : 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                            border: 'none', borderRadius: 10,
                            color: '#fff', fontSize: 15, fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
                        }}
                        onMouseEnter={e => { if (!loading) e.target.style.opacity = '0.9'; }}
                        onMouseLeave={e => { e.target.style.opacity = '1'; }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#4B4B6A', fontSize: 12, marginTop: 24, marginBottom: 0 }}>
                    Default: admin@portfolio.com / admin123
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
