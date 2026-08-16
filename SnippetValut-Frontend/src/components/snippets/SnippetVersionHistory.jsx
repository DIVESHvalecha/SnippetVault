import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, RotateCcw, Clock, User, X, Loader2, GitFork } from 'lucide-react';
import Button from '../common/Button';
import {
    fetchSnippetVersionsApi,
    restoreSnippetVersionApi,
    forkSnippetApi,
} from '../../services/snippet';
import EditorWrapper from './EditorWrapper';

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
    });
};

const SnippetVersionHistory = ({ isOpen, onClose, snippet, onRestored, canFork = false }) => {
    const [versions, setVersions] = useState([]);
    const [selectedVersionNumber, setSelectedVersionNumber] = useState(null);
    const [loadingVersions, setLoadingVersions] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [forking, setForking] = useState(false);
    const [forkSuccess, setForkSuccess] = useState(false);
    const [error, setError] = useState('');

    const loadVersions = useCallback(async () => {
        if (!snippet?.id) return;
        setLoadingVersions(true);
        setError('');
        try {
            const data = await fetchSnippetVersionsApi(snippet.id);
            const list = Array.isArray(data) ? data : (data.body || []);
            setVersions(list);
            if (list.length > 0) setSelectedVersionNumber(list[0].versionNumber);
        } catch {
            setError('Failed to load version history.');
        } finally {
            setLoadingVersions(false);
        }
    }, [snippet?.id]);

    useEffect(() => {
        if (isOpen) {
            setVersions([]);
            setSelectedVersionNumber(null);
            setError('');
            loadVersions();
        }
    }, [isOpen, loadVersions]);

    const handleRestore = async () => {
        if (!selectedVersionNumber || !snippet?.id) return;
        setRestoring(true);
        try {
            await restoreSnippetVersionApi(snippet.id, selectedVersionNumber);
            onRestored?.();
            onClose();
        } catch {
            setError('Failed to restore version. Please try again.');
        } finally {
            setRestoring(false);
        }
    };

    const handleFork = async () => {
        if (!selectedVersionNumber || !snippet?.id) return;
        setForking(true);
        setForkSuccess(false);
        try {
            await forkSnippetApi(snippet.id, selectedVersionNumber);
            setForkSuccess(true);
            setTimeout(() => setForkSuccess(false), 2500);
        } catch {
            setError('Failed to fork version. Please try again.');
        } finally {
            setForking(false);
        }
    };

    if (!isOpen) return null;

    // The selected version object has content + language already
    const selectedVersion = versions.find(v => v.versionNumber === selectedVersionNumber) || null;
    const latestVersionNumber = versions.length > 0 ? versions[0].versionNumber : null;
    const isCurrentVersion = selectedVersionNumber === latestVersionNumber;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            zIndex: 1000,
                            backdropFilter: 'blur(2px)',
                        }}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        style={{
                            position: 'fixed', top: 0, right: 0, bottom: 0,
                            width: '720px', maxWidth: '95vw',
                            backgroundColor: 'var(--bg-primary)',
                            borderLeft: '1px solid var(--border-color)',
                            zIndex: 1001,
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-secondary)',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <History size={18} style={{ color: 'var(--accent-primary)' }} />
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
                                        Version History
                                    </h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                                        {snippet?.title}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '32px', height: '32px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'transparent',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body — two columns */}
                        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                            {/* Left: version list */}
                            <div style={{
                                width: '240px',
                                flexShrink: 0,
                                borderRight: '1px solid var(--border-color)',
                                overflowY: 'auto',
                                padding: '0.75rem 0',
                            }}>
                                {loadingVersions ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        <span style={{ fontSize: '0.8rem' }}>Loading…</span>
                                    </div>
                                ) : versions.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '2rem 1rem' }}>
                                        No versions found.
                                    </p>
                                ) : (
                                    versions.map((v, idx) => {
                                        const isSelected = selectedVersionNumber === v.versionNumber;
                                        const isLatest = idx === 0;
                                        return (
                                            <button
                                                key={v.versionNumber}
                                                onClick={() => setSelectedVersionNumber(v.versionNumber)}
                                                style={{
                                                    width: '100%', textAlign: 'left',
                                                    padding: '0.75rem 1rem',
                                                    border: 'none',
                                                    backgroundColor: isSelected ? 'var(--accent-soft)' : 'transparent',
                                                    borderLeft: isSelected ? '3px solid var(--accent-primary)' : '3px solid transparent',
                                                    cursor: 'pointer',
                                                    transition: 'var(--transition)',
                                                    display: 'block',
                                                }}
                                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                                                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                                    <span style={{
                                                        fontSize: '0.8rem', fontWeight: '700',
                                                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                                                    }}>
                                                        v{v.versionNumber}
                                                    </span>
                                                    {isLatest && (
                                                        <span style={{
                                                            fontSize: '0.65rem', fontWeight: '600',
                                                            backgroundColor: 'var(--accent-soft)',
                                                            color: 'var(--accent-primary)',
                                                            padding: '0.1rem 0.4rem',
                                                            borderRadius: 'var(--radius-full)',
                                                            border: '1px solid var(--accent-primary)',
                                                        }}>
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                                    <Clock size={10} />
                                                    {formatDate(v.createdAt)}
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            {/* Right: version detail */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                {error && (
                                    <div style={{
                                        margin: '1rem', padding: '0.65rem 0.85rem',
                                        backgroundColor: 'rgba(175,76,76,0.08)',
                                        border: '1px solid rgba(175,76,76,0.2)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--error)', fontSize: '0.85rem',
                                    }}>
                                        {error}
                                    </div>
                                )}

                                {selectedVersion && (
                                    <>
                                        {/* Version metadata bar */}
                                        {selectedVersion && (
                                            <div style={{
                                                padding: '1rem 1.25rem',
                                                borderBottom: '1px solid var(--border-color)',
                                                backgroundColor: 'var(--bg-secondary)',
                                                flexShrink: 0,
                                            }}>
                                                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                    {selectedVersion.title}
                                                </h4>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    {selectedVersion.description}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                        <Clock size={12} />
                                                        {formatDate(selectedVersion.createdAt)}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                        <User size={12} />
                                                        User #{selectedVersion.editedBy}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Code preview */}
                                        <div style={{ flex: 1, overflow: 'hidden', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Code Preview
                                            </p>

                                            {selectedVersion ? (
                                                <div style={{ flex: 1, overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                                    <EditorWrapper
                                                        code={selectedVersion.content || ''}
                                                        language={selectedVersion.language || snippet?.language || 'javascript'}
                                                        readOnly={true}
                                                        height="100%"
                                                    />
                                                </div>
                                            ) : (
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                    No code preview available for this version.
                                                </p>
                                            )}
                                        </div>

                                        {/* Footer actions */}
                                        {!isCurrentVersion && (
                                            <div style={{
                                                padding: '1rem 1.25rem',
                                                borderTop: '1px solid var(--border-color)',
                                                backgroundColor: 'var(--bg-secondary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                flexShrink: 0,
                                                gap: '0.75rem',
                                            }}>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1 }}>
                                                    Restore or fork v{selectedVersionNumber}
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {canFork && (
                                                        <Button
                                                            variant="secondary"
                                                            onClick={handleFork}
                                                            disabled={forking}
                                                            size="sm"
                                                        >
                                                            {forking ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <GitFork size={14} />}
                                                            {forking ? 'Forking…' : forkSuccess ? 'Forked! ✓' : 'Fork'}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={handleRestore}
                                                        disabled={restoring}
                                                        size="sm"
                                                    >
                                                        {restoring ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <RotateCcw size={14} />}
                                                        {restoring ? 'Restoring…' : `Restore to v${selectedVersionNumber}`}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {isCurrentVersion && (
                                            <div style={{
                                                padding: '0.75rem 1.25rem',
                                                borderTop: '1px solid var(--border-color)',
                                                backgroundColor: 'var(--accent-soft)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                flexShrink: 0,
                                            }}>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '500' }}>
                                                    ✓ This is the current version.
                                                </p>
                                                {canFork && (
                                                    <Button
                                                        variant="secondary"
                                                        onClick={handleFork}
                                                        disabled={forking}
                                                        size="sm"
                                                    >
                                                        {forking ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <GitFork size={14} />}
                                                        {forking ? 'Forking…' : forkSuccess ? 'Forked! ✓' : 'Fork'}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                {!selectedVersion && !loadingVersions && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                        <History size={32} style={{ opacity: 0.3 }} />
                                        <p style={{ fontSize: '0.85rem' }}>Select a version to preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <style>{`
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
};

export default SnippetVersionHistory;
