import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { resetPasswordRequest } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await resetPasswordRequest(email);
            setIsSent(true);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    backgroundColor: 'var(--bg-primary)',
                    padding: '2.5rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)'
                }}
            >
                {!isSent ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--accent-primary)',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-full)',
                                marginBottom: '1rem'
                            }}>
                                <Mail size={32} />
                            </div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                Forgot Password?
                            </h1>
                            <p style={{ color: 'var(--text-secondary)' }}>No worries, we'll send you reset instructions.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                            <Button type="submit" className="w-full" disabled={isLoading} size="lg" style={{ marginBottom: '1.5rem' }}>
                                {isLoading ? 'Sending...' : 'Reset Password'}
                            </Button>

                            <Link to="/login" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}>
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--success)',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-full)',
                            marginBottom: '1rem'
                        }}>
                            <CheckCircle size={32} />
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            Check your email
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            We've sent a password reset link to <br /><strong>{email}</strong>
                        </p>
                        <Link to="/login">
                            <Button size="lg" className="w-full">Return to Login</Button>
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
