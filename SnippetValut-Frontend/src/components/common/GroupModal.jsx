import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useGroups } from '../../context/GroupContext';
import { Users, Plus, UserPlus, Globe, Lock } from 'lucide-react';

const GroupModal = ({ isOpen, onClose, onShowToast }) => {
    const [activeTab, setActiveTab] = useState('create');
    const { createGroup, joinGroup } = useGroups();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [joinCode, setJoinCode] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await createGroup(name, description, isPublic);
            onShowToast('Group created successfully!', 'success');
            onClose();
            setName('');
            setDescription('');
            setIsPublic(false);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await joinGroup(joinCode);
            onShowToast('Joined group successfully!', 'success');
            onClose();
            setJoinCode('');
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Group Management" maxWidth="450px">
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setActiveTab('create')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: activeTab === 'create' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'create' ? '2px solid var(--accent-primary)' : 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                    }}
                >
                    Create Group
                </button>
                <button
                    onClick={() => setActiveTab('join')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: activeTab === 'join' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'join' ? '2px solid var(--accent-primary)' : 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                    }}
                >
                    Join Group
                </button>
            </div>

            {activeTab === 'create' ? (
                <form onSubmit={handleCreate}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <Users size={48} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Create a new workspace for your team.
                        </p>
                    </div>
                    <Input
                        label="Group Name"
                        placeholder="e.g. Design Team"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        label="Description (Optional)"
                        placeholder="What is this group for?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* Public/Private Toggle */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {isPublic ? (
                                <Globe size={20} style={{ color: 'var(--accent-primary)' }} />
                            ) : (
                                <Lock size={20} style={{ color: 'var(--text-muted)' }} />
                            )}
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                                    {isPublic ? 'Public Group' : 'Private Group'}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                                    {isPublic ? 'Anyone can discover and join' : 'Invite-only via group code'}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            style={{
                                width: '48px',
                                height: '26px',
                                borderRadius: '13px',
                                backgroundColor: isPublic ? 'var(--accent-primary)' : 'var(--border-color)',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            <span style={{
                                position: 'absolute',
                                top: '3px',
                                left: isPublic ? '25px' : '3px',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                transition: 'left 0.2s ease'
                            }} />
                        </button>
                    </div>

                    {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                        {isLoading ? 'Creating...' : 'Create Group'}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleJoin}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <UserPlus size={48} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Enter a group code to join an existing team.
                        </p>
                    </div>
                    <Input
                        label="Group Invite Code"
                        placeholder="Ex: TEAM123"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                        {isLoading ? 'Joining...' : 'Join Group'}
                    </Button>
                </form>
            )}
        </Modal>
    );
};

export default GroupModal;
