import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useSnippets } from '../../context/SnippetContext';
import { useGroups } from '../../context/GroupContext';
import { Folder, Plus, Lock, Globe, Users } from 'lucide-react';

const FolderModal = ({ isOpen, onClose, onShowToast }) => {
    const { createFolder } = useSnippets();
    const { groups, selectedGroupId } = useGroups();
    const [name, setName] = useState('');
    const [visibility, setVisibility] = useState('private');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // If we are currently in a group view, default the folder to that group
            const groupId = selectedGroupId || null;
            const folderVisibility = groupId ? 'group' : visibility;

            createFolder(name, folderVisibility, groupId);
            onShowToast(`Folder "${name}" created!`, 'success');
            setName('');
            onClose();
        } catch (error) {
            onShowToast('Failed to create folder', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Folder" maxWidth="400px">
            <form onSubmit={handleSubmit}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <Folder size={48} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Organize your snippets into a new folder.
                    </p>
                </div>

                <Input
                    label="Folder Name"
                    placeholder="e.g. Authentication"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                />

                {!selectedGroupId && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Visibility
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setVisibility('private')}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    border: `2px solid ${visibility === 'private' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                    backgroundColor: visibility === 'private' ? 'var(--accent-soft)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                            >
                                <Lock size={16} color={visibility === 'private' ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Private</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisibility('public')}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    border: `2px solid ${visibility === 'public' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                    backgroundColor: visibility === 'public' ? 'var(--accent-soft)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                            >
                                <Globe size={16} color={visibility === 'public' ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Public</span>
                            </button>
                        </div>
                    </div>
                )}

                {selectedGroupId && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <Users size={20} style={{ color: 'var(--accent-primary)' }} />
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>Team Folder</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                                Visible to all members of {groups.find(g => g.id === selectedGroupId)?.name}
                            </p>
                        </div>
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading || !name.trim()} size="lg">
                    {isLoading ? 'Creating...' : 'Create Folder'}
                </Button>
            </form>
        </Modal>
    );
};

export default FolderModal;
