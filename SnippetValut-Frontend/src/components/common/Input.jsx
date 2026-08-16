import { motion } from 'framer-motion';

const Input = ({ label, type = 'text', placeholder, value, onChange, error, className = '', ...props }) => {
    return (
        <div className={`input-group ${className}`} style={{ marginBottom: '1rem', width: '100%' }}>
            {label && (
                <label
                    style={{
                        display: 'block',
                        marginBottom: '0.4rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--text-secondary)'
                    }}
                >
                    {label}
                </label>
            )}
            <motion.div
                whileFocus={{ boxShadow: '0 0 0 2px var(--accent-soft)' }}
                style={{ width: '100%' }}
            >
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${error ? 'var(--error)' : 'var(--border-color)'}`,
                        backgroundColor: 'var(--bg-primary)',
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                        transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    {...props}
                />
            </motion.div>
            {error && (
                <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.25rem', display: 'block' }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
