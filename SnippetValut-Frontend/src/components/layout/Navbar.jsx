import { motion } from 'framer-motion';
import { LogOut, User, Zap, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
    const navigate = useNavigate();

    return (
        <nav style={{
            height: '64px',
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                    onClick={onToggleSidebar}
                    style={{
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                    }}
                    className="mobile-only"
                >
                    <Menu size={24} />
                </button>

                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{
                        backgroundColor: 'var(--accent-primary)',
                        color: 'white',
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Zap size={20} fill="white" />
                    </div>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        display: 'none',
                        sm: 'inline'
                    }} className="desktop-only-inline">
                        Snippet Vault
                    </span>
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ textAlign: 'right', display: 'none' }} className="desktop-only-block">
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{user.name}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{user.email}</p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--bg-tertiary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent-primary)',
                                cursor: 'pointer'
                            }}
                        >
                            <User size={20} />
                        </motion.div>
                        <button
                            onClick={onLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)',
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                transition: 'var(--transition)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Login</Link>
                        <Link to="/signup" style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            backgroundColor: 'var(--accent-primary)',
                            color: 'white',
                            padding: '0.4rem 1rem',
                            borderRadius: 'var(--radius-md)'
                        }}>Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
