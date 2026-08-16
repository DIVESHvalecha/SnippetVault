import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import EditorWrapper from './EditorWrapper';
import SnippetVersionHistory from './SnippetVersionHistory';
import { useAuth } from '../../context/AuthContext';
import { useGroups } from '../../context/GroupContext';
import { useSnippets } from '../../context/SnippetContext';
import { Save, Trash2, Edit3, X, Globe, Lock, Users, Folder, History, GitFork } from 'lucide-react';
import { forkSnippetApi, fetchSnippetVersionsApi } from '../../services/snippet';

const SnippetDetails = ({ isOpen, onClose, snippet, onSave, onDelete, isNew = false }) => {
    const { user } = useAuth();
    const { groups } = useGroups();
    const { folders, removeFromFolder, selectedFolderId, refreshSnippets } = useSnippets();
    const [editedSnippet, setEditedSnippet] = useState({
        title: '',
        description: '',
        language: 'javascript',
        visibility: 'public',
        groupId: '',
        folderId: '',
        code: '',
        ...snippet
    });
    const [isEditing, setIsEditing] = useState(isNew);
    const [showHistory, setShowHistory] = useState(false);
    const [forking, setForking] = useState(false);
    const [forkSuccess, setForkSuccess] = useState(false);

    const handleFork = async (versionNumber) => {
        if (!snippet?.id) return;
        setForking(true);
        setForkSuccess(false);
        try {
            // If no version number provided, fetch latest
            let version = versionNumber;
            if (!version) {
                const data = await fetchSnippetVersionsApi(snippet.id);
                const list = Array.isArray(data) ? data : (data.body || []);
                version = list[0]?.versionNumber;
                if (!version) throw new Error('No versions found');
            }
            await forkSnippetApi(snippet.id, version);
            await refreshSnippets();
            setForkSuccess(true);
            setTimeout(() => setForkSuccess(false), 2500);
        } catch (err) {
            console.error('Fork failed:', err);
        } finally {
            setForking(false);
        }
    };

    useEffect(() => {
        if (snippet) {
            setEditedSnippet({
                title: '',
                description: '',
                language: 'javascript',
                visibility: 'public',
                groupId: '',
                code: '// Start coding here...',
                ...snippet
            });
        } else if (isNew) {
            setEditedSnippet({
                title: '',
                description: '',
                language: 'javascript',
                visibility: 'public',
                groupId: '',
                code: '// Start coding here...',
            });
        }
        setIsEditing(isNew);
    }, [snippet, isNew, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If visibility changes to something other than group, clear groupId
        if (name === 'visibility' && value !== 'group') {
            setEditedSnippet(prev => ({ ...prev, [name]: value, groupId: '' }));
        } else {
            setEditedSnippet(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCodeChange = (value) => {
        setEditedSnippet(prev => ({ ...prev, code: value }));
    };

    const handleSave = () => {
        if (editedSnippet.visibility === 'group' && !editedSnippet.groupId) {
            alert('Please select a group for group visibility');
            return;
        }
        onSave(editedSnippet);
        setIsEditing(false);
        if (isNew) onClose();
    };

    const visibilityOptions = [
        { value: 'public', label: 'Public', icon: <Globe size={16} /> },
        { value: 'private', label: 'Private', icon: <Lock size={16} /> },
        { value: 'group', label: 'Group Access', icon: <Users size={16} /> },
    ];

    const currentUserId = user?.id || user?.userId || 12;
    const isOwner = snippet && (String(snippet.userId) === String(currentUserId));
    const canEdit = isNew || isOwner;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={isNew ? 'Create New Snippet' : (isEditing ? 'Edit Snippet' : 'View Snippet')}
                maxWidth="900px"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Title</label>
                                <input
                                    name="title"
                                    value={editedSnippet.title}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Ex: React UseEffect Pattern"
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: isEditing ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Description</label>
                                <textarea
                                    name="description"
                                    value={editedSnippet.description}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="What does this snippet do?"
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: isEditing ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem',
                                        resize: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ width: '220px' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Language</label>
                                <select
                                    name="language"
                                    value={editedSnippet.language}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--bg-primary)',
                                    }}
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="css">CSS</option>
                                    <option value="html">HTML</option>
                                    <option value="typescript">TypeScript</option>
                                    <option value="plaintext">Plain Text</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Folder (Optional)</label>
                                <select
                                    name="folderId"
                                    value={editedSnippet.folderId || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--bg-primary)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="">No Folder</option>
                                    {folders.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Visibility</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {visibilityOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            disabled={!isEditing}
                                            onClick={() => setEditedSnippet(p => ({ ...p, visibility: opt.value, groupId: opt.value === 'group' ? p.groupId : '' }))}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: 'var(--radius-md)',
                                                backgroundColor: editedSnippet.visibility === opt.value ? 'var(--accent-soft)' : 'transparent',
                                                color: editedSnippet.visibility === opt.value ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                border: `1px solid ${editedSnippet.visibility === opt.value ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                                fontSize: '0.875rem',
                                                cursor: isEditing ? 'pointer' : 'default',
                                                transition: 'var(--transition)'
                                            }}
                                        >
                                            {opt.icon}
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {editedSnippet.visibility === 'group' && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Select Group</label>
                                    <select
                                        name="groupId"
                                        value={editedSnippet.groupId}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--bg-primary)',
                                        }}
                                    >
                                        <option value="">Select a group...</option>
                                        {groups.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Code</label>
                        <EditorWrapper
                            code={editedSnippet.code}
                            language={editedSnippet.language}
                            onChange={handleCodeChange}
                            readOnly={!isEditing}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        {/* Left actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {!isNew && isOwner && (
                                <Button variant="danger" onClick={() => onDelete(snippet.id)}>
                                    <Trash2 size={16} />
                                    Delete
                                </Button>
                            )}

                            {!isNew && selectedFolderId && (
                                <button
                                    onClick={async () => {
                                        try {
                                            await removeFromFolder(snippet.id, selectedFolderId);
                                            onClose();
                                        } catch (err) {
                                            console.error('Failed to remove from folder:', err);
                                        }
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '0.45rem 0.85rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'transparent',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'var(--transition)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }}
                                >
                                    <Folder size={15} />
                                    Remove from Folder
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem', marginLeft: 'auto', alignItems: 'center' }}>
                            {/* History button — only for existing snippets */}
                            {!isNew && (
                                <button
                                    onClick={() => setShowHistory(true)}
                                    title="View version history"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.45rem 0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'transparent',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.8rem', fontWeight: '500',
                                        cursor: 'pointer', transition: 'var(--transition)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }}
                                >
                                    <History size={14} />
                                    History
                                </button>
                            )}

                            {/* Fork button — only for snippets you don't own */}
                            {!isNew && !isOwner && (
                                <button
                                    onClick={() => handleFork()}
                                    disabled={forking}
                                    title="Fork latest version of this snippet"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.45rem 0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: `1px solid ${forkSuccess ? 'var(--success, #4caf50)' : 'var(--border-color)'}`,
                                        backgroundColor: forkSuccess ? 'rgba(76,175,80,0.08)' : 'transparent',
                                        color: forkSuccess ? 'var(--success, #4caf50)' : 'var(--text-secondary)',
                                        fontSize: '0.8rem', fontWeight: '500',
                                        cursor: forking ? 'not-allowed' : 'pointer',
                                        transition: 'var(--transition)',
                                        opacity: forking ? 0.7 : 1,
                                    }}
                                    onMouseEnter={e => {
                                        if (!forking && !forkSuccess) {
                                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                            e.currentTarget.style.color = 'var(--accent-primary)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!forkSuccess) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                        }
                                    }}
                                >
                                    <GitFork size={14} />
                                    {forking ? 'Forking…' : forkSuccess ? 'Forked!' : 'Fork'}
                                </button>
                            )}

                            {isEditing ? (
                                <>
                                    <Button variant="secondary" onClick={() => isNew ? onClose() : setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleSave}>
                                        <Save size={18} />
                                        {isNew ? 'Create Snippet' : 'Save Changes'}
                                    </Button>
                                </>
                            ) : (
                                canEdit && (
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Edit3 size={18} />
                                        Edit Snippet
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Version history slide-in panel — rendered outside Modal to avoid z-index issues */}
            <SnippetVersionHistory
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                snippet={snippet}
                canFork={!isOwner}
                onRestored={async () => {
                    setShowHistory(false);
                    await refreshSnippets();
                    onClose();
                }}
            />
        </>
    );
};

export default SnippetDetails;

