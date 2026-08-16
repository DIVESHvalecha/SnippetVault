import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', disabled = false, ...props }) => {
  const variants = {
    primary: {
      bg: 'var(--accent-primary)',
      text: '#ffffff',
      hover: 'var(--accent-hover)',
    },
    secondary: {
      bg: 'var(--bg-tertiary)',
      text: 'var(--text-primary)',
      hover: '#e2ddd3',
    },
    outline: {
      bg: 'transparent',
      text: 'var(--accent-primary)',
      border: '1px solid var(--accent-primary)',
      hover: 'var(--accent-soft)',
    },
    ghost: {
      bg: 'transparent',
      text: 'var(--text-secondary)',
      hover: 'var(--bg-secondary)',
    },
    danger: {
      bg: 'rgba(220, 38, 38, 0.08)',
      text: 'var(--error)',
      border: '1px solid rgba(220, 38, 38, 0.25)',
      hover: 'rgba(220, 38, 38, 0.15)',
    },
  };

  const sizes = {
    sm: '0.4rem 0.8rem',
    md: '0.6rem 1.2rem',
    lg: '0.8rem 1.6rem',
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02, backgroundColor: currentVariant.hover }}
      whileTap={{ scale: 0.98 }}
      className={`btn ${className}`}
      style={{
        padding: sizes[size],
        backgroundColor: currentVariant.bg,
        color: currentVariant.text,
        border: currentVariant.border || 'none',
        borderRadius: 'var(--radius-md)',
        fontSize: size === 'sm' ? '0.875rem' : '1rem',
        fontWeight: '500',
        transition: 'var(--transition)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
