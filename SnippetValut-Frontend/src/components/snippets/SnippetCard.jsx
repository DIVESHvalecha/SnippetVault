import { motion } from 'framer-motion';
import { Lock, Users, Globe, Code, Calendar, ArrowRight } from 'lucide-react';

const SnippetCard = ({ snippet, onClick, currentUserId }) => {
    const visibilityIcons = {
        private: <Lock size={14} />,
        group: <Users size={14} />,
        public: <Globe size={14} />,
    };

    const visibilityColors = {
        private: '#64748b',
        group: '#8c7851',
        public: '#677045',
    };

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
            onClick={() => onClick(snippet)}
            style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                }}>
                    <Code size={14} />
                    {snippet.language}
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: visibilityColors[snippet.visibility],
                    textTransform: 'capitalize'
                }}>
                    {String(snippet.userId) === String(currentUserId) && (
                        <div style={{
                            backgroundColor: 'var(--accent-soft)',
                            color: 'var(--accent-primary)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            marginRight: '0.5rem',
                            fontSize: '0.65rem'
                        }}>
                            YOURS
                        </div>
                    )}
                    {visibilityIcons[snippet.visibility]}
                    {snippet.visibility}
                </div>
            </div>

            <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {snippet.title}
                </h3>
                <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {snippet.description}
                </p>
            </div>

            <div style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Calendar size={14} />
                    {snippet.createdAt}
                </div>
                <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: '600' }}>
                    View <ArrowRight size={14} />
                </div>
            </div>
        </motion.div>
    );
};

export default SnippetCard;
