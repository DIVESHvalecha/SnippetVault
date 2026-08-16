import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={18} color="var(--success)" />,
        error: <AlertCircle size={18} color="var(--error)" />,
        info: <Info size={18} color="var(--accent-primary)" />,
    };

    const bgColors = {
        success: '#f4f7f0', // Very light success
        error: '#fdf4f4',   // Very light error
        info: 'var(--bg-secondary)',
    };

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: bgColors[type],
                border: `1px solid var(--border-color)`,
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                zIndex: 2000,
                minWidth: '300px',
            }}
        >
            {icons[type]}
            <span style={{ fontSize: '0.875rem', fontWeight: '500', flex: 1, color: 'var(--text-primary)' }}>
                {message}
            </span>
            <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;
