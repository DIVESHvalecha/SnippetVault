import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Lock, ShieldAlert, Loader2 } from 'lucide-react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [tokenError, setTokenError] = useState('');
    const { resetPassword, validateToken } = useAuth();
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                await validateToken(token);
            } catch (err) {
                setTokenError(err.message || 'Invalid or expired token.');
                setTimeout(() => navigate('/login'), 3000);
            } finally {
                setIsValidating(false);
            }
        };

        if (token) {
            checkToken();
        }
    }, [token, validateToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setIsLoading(true);
        try {
            await resetPassword(token, password);
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
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
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--accent-primary)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-full)',
                        marginBottom: '1rem'
                    }}>
                        <Lock size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        Set New Password
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Create a strong password for your account.</p>
                </div>

                {isValidating ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{ display: 'inline-block', color: 'var(--accent-primary)', marginBottom: '1rem' }}
                        >
                            <Loader2 size={40} />
                        </motion.div>
                        <p style={{ color: 'var(--text-secondary)' }}>Validating your reset link...</p>
                    </div>
                ) : tokenError ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>
                            <ShieldAlert size={48} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            Invalid Link
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            {tokenError} <br /> You will be redirected to login shortly.
                        </p>
                        <Link to="/login">
                            <Button variant="outline" className="w-full">Back to Login</Button>
                        </Link>
                    </div>
                ) : isSuccess ? (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: 'var(--success)', fontWeight: '600', marginBottom: '1rem' }}>
                            Password reset successfully!
                        </p>
                        <p style={{ color: 'var(--text-secondary)' }}>Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

                        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                            {isLoading ? 'Resetting...' : 'Set New Password'}
                        </Button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;
