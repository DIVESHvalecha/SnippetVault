import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Lock, Users, Globe, Plus, Hash, Settings, Compass, Folder, X, ChevronDown, ChevronRight, Bookmark } from 'lucide-react';
import { useGroups } from '../../context/GroupContext';
import { useSnippets } from '../../context/SnippetContext';

const Sidebar = ({ activeFilter, setFilter, onNewSnippet, onManageGroups, onNewFolder, isOpen, onClose }) => {
    const { groups, publicGroups, selectedGroupId, setSelectedGroupId, joinGroup } = useGroups();
    const { folders, selectedFolderId, setSelectedFolderId } = useSnippets();
    const [groupTab, setGroupTab] = useState('joined'); // 'joined' or 'public'

    const [isMyVaultOpen, setIsMyVaultOpen] = useState(true);

    const menuItems = [
        { id: 'all', label: 'All Snippets', icon: <Globe size={20} /> },
    ];

    const myVaultItems = [
        { id: 'my-all', label: 'Everything', icon: <Bookmark size={18} /> },
        { id: 'my-public', label: 'Public', icon: <Globe size={18} /> },
        { id: 'my-private', label: 'Private', icon: <Lock size={18} /> },
    ];

    const handleGroupClick = (groupId) => {
        setSelectedGroupId(groupId);
        setFilter('group');
        if (window.innerWidth <= 768) onClose();
    };

    const handleJoinPublicGroup = async (group) => {
        try {
            await joinGroup(group.groupCode || group.code);
        } catch (err) {
            console.error('Failed to join group:', err);
        }
    };

    return (
        <aside style={{
            width: '260px',
            backgroundColor: 'var(--bg-primary)',
            borderRight: '1px solid var(--border-color)',
            padding: '1.5rem 1rem',
            height: 'calc(100vh - 64px)',
            position: window.innerWidth <= 768 ? 'fixed' : 'sticky',
            top: '64px',
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            overflowY: 'auto',
            zIndex: 1000,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: (window.innerWidth <= 768 && !isOpen) ? 'translateX(-100%)' : 'translateX(0)',
            boxShadow: (window.innerWidth <= 768 && isOpen) ? 'var(--shadow-lg)' : 'none',
        }}>
            {/* Mobile Close Button */}
            <div className="mobile-only" style={{ justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button
                    onClick={onClose}
                    style={{
                        padding: '0.4rem',
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNewSnippet}
                style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    fontWeight: '600',
                    boxShadow: 'var(--shadow-md)',
                    width: '100%',
                    cursor: 'pointer'
                }}
            >
                <Plus size={20} />
                New Snippet
            </motion.button>

            <div>
                <h4 style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem',
                    padding: '0 0.5rem'
                }}>
                    Feed
                </h4>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {menuItems.map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => {
                                setFilter(item.id);
                                setSelectedGroupId(null);
                                setSelectedFolderId(null);
                            }}
                            whileHover={{ x: 4 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.5rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: (activeFilter === item.id && !selectedGroupId && !selectedFolderId) ? 'var(--accent-soft)' : 'transparent',
                                color: (activeFilter === item.id && !selectedGroupId && !selectedFolderId) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                fontWeight: (activeFilter === item.id && !selectedGroupId && !selectedFolderId) ? '600' : '500',
                                fontSize: '0.875rem',
                                transition: 'var(--transition)',
                                cursor: 'pointer',
                                border: 'none',
                                textAlign: 'left',
                                width: '100%'
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </motion.button>
                    ))}
                </nav>
            </div>

            <div>
                <div
                    onClick={() => setIsMyVaultOpen(!isMyVaultOpen)}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.75rem',
                        padding: '0 0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    <h4 style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.05em',
                        margin: 0
                    }}>
                        My Vault
                    </h4>
                    {isMyVaultOpen ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                </div>

                {isMyVaultOpen && (
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {myVaultItems.map((item) => (
                            <motion.button
                                key={item.id}
                                onClick={() => {
                                    setFilter(item.id);
                                    setSelectedGroupId(null);
                                    setSelectedFolderId(null);
                                }}
                                whileHover={{ x: 4 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.5rem 0.5rem 0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: activeFilter === item.id ? 'var(--accent-soft)' : 'transparent',
                                    color: activeFilter === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    fontWeight: activeFilter === item.id ? '600' : '500',
                                    fontSize: '0.85rem',
                                    transition: 'var(--transition)',
                                    cursor: 'pointer',
                                    border: 'none',
                                    textAlign: 'left',
                                    width: '100%'
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </motion.button>
                        ))}
                    </nav>
                )}
            </div>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
                    <h4 style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.05em',
                    }}>
                        Folders
                    </h4>
                    <button
                        onClick={onNewFolder}
                        style={{
                            color: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '2px'
                        }}
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {folders.filter(f => !f.groupId).map((folder) => (
                        <motion.button
                            key={folder.id}
                            onClick={() => {
                                setSelectedFolderId(folder.id);
                                setSelectedGroupId(null);
                                setFilter('all');
                            }}
                            whileHover={{ x: 4 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.5rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: selectedFolderId === folder.id ? 'var(--accent-soft)' : 'transparent',
                                color: selectedFolderId === folder.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                fontWeight: selectedFolderId === folder.id ? '600' : '500',
                                fontSize: '0.875rem',
                                transition: 'var(--transition)',
                                cursor: 'pointer',
                                border: 'none',
                                textAlign: 'left',
                                width: '100%'
                            }}
                        >
                            <Folder size={18} fill={selectedFolderId === folder.id ? 'currentColor' : 'none'} />
                            <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {folder.name}
                            </span>
                        </motion.button>
                    ))}
                    {folders.filter(f => !f.groupId).length === 0 && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.5rem', textAlign: 'center' }}>
                            No personal folders yet.
                        </p>
                    )}
                </nav>
            </div>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
                    <h4 style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.05em',
                    }}>
                        Groups
                    </h4>
                    <button
                        onClick={onManageGroups}
                        style={{
                            color: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '2px'
                        }}
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* Tab Toggle */}
                <div style={{
                    display: 'flex',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '4px',
                    marginBottom: '0.75rem',
                    gap: '4px'
                }}>
                    <button
                        onClick={() => setGroupTab('joined')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: groupTab === 'joined' ? 'var(--bg-primary)' : 'transparent',
                            color: groupTab === 'joined' ? 'var(--accent-primary)' : 'var(--text-muted)',
                            boxShadow: groupTab === 'joined' ? 'var(--shadow-sm)' : 'none',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem'
                        }}
                    >
                        <Users size={14} />
                        My Groups
                    </button>
                    <button
                        onClick={() => setGroupTab('public')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: groupTab === 'public' ? 'var(--bg-primary)' : 'transparent',
                            color: groupTab === 'public' ? 'var(--accent-primary)' : 'var(--text-muted)',
                            boxShadow: groupTab === 'public' ? 'var(--shadow-sm)' : 'none',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem'
                        }}
                    >
                        <Compass size={14} />
                        Discover
                    </button>
                </div>

                {/* Groups List */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {groupTab === 'joined' ? (
                        <>
                            {groups.map((group) => (
                                <div key={group.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <motion.button
                                        onClick={() => {
                                            handleGroupClick(group.id);
                                            setSelectedFolderId(null);
                                        }}
                                        whileHover={{ x: 4 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.6rem 0.5rem',
                                            borderRadius: 'var(--radius-md)',
                                            backgroundColor: (selectedGroupId === group.id && !selectedFolderId) ? 'var(--accent-soft)' : 'transparent',
                                            color: (selectedGroupId === group.id && !selectedFolderId) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                            fontWeight: (selectedGroupId === group.id && !selectedFolderId) ? '600' : '500',
                                            fontSize: '0.875rem',
                                            transition: 'var(--transition)',
                                            cursor: 'pointer',
                                            border: 'none',
                                            textAlign: 'left',
                                            width: '100%'
                                        }}
                                    >
                                        <Hash size={18} />
                                        <span style={{
                                            flex: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {group.name || group.groupCode || 'Unnamed Group'}
                                        </span>
                                    </motion.button>

                                    {/* Nested Group Folders */}
                                    {selectedGroupId === group.id && (
                                        <div style={{ marginLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border-color)', marginTop: '2px', marginBottom: '4px' }}>
                                            {folders.filter(f => f.groupId === group.id).map(folder => (
                                                <motion.button
                                                    key={folder.id}
                                                    onClick={() => setSelectedFolderId(folder.id)}
                                                    whileHover={{ x: 2 }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.4rem 0.5rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        backgroundColor: selectedFolderId === folder.id ? 'var(--accent-soft)' : 'transparent',
                                                        color: selectedFolderId === folder.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                                                        fontWeight: selectedFolderId === folder.id ? '600' : '500',
                                                        fontSize: '0.8rem',
                                                        transition: 'var(--transition)',
                                                        cursor: 'pointer',
                                                        border: 'none',
                                                        textAlign: 'left',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Folder size={14} fill={selectedFolderId === folder.id ? 'currentColor' : 'none'} />
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {folder.name}
                                                    </span>
                                                </motion.button>
                                            ))}
                                            <button
                                                onClick={onNewFolder}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.4rem 0.5rem',
                                                    fontSize: '0.75rem',
                                                    color: 'var(--accent-primary)',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'transparent',
                                                    border: 'none'
                                                }}
                                            >
                                                <Plus size={12} />
                                                New Group Folder
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {groups.length === 0 && (
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.5rem', textAlign: 'center' }}>
                                    No groups joined yet. Discover public groups!
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            {publicGroups && publicGroups.length > 0 ? (
                                publicGroups.map((group) => (
                                    <motion.div
                                        key={group.id}
                                        whileHover={{ x: 4 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.6rem 0.5rem',
                                            borderRadius: 'var(--radius-md)',
                                            backgroundColor: 'transparent',
                                            transition: 'var(--transition)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                                            <Globe size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                            <div style={{ overflow: 'hidden' }}>
                                                <span style={{
                                                    fontSize: '0.875rem',
                                                    color: 'var(--text-secondary)',
                                                    fontWeight: '500',
                                                    display: 'block',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {group.name || group.groupCode || 'Unnamed Group'}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    {group.memberCount || 0} members
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleJoinPublicGroup(group)}
                                            style={{
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                                color: 'var(--accent-primary)',
                                                backgroundColor: 'var(--accent-soft)',
                                                padding: '0.3rem 0.6rem',
                                                borderRadius: 'var(--radius-sm)',
                                                cursor: 'pointer',
                                                border: 'none',
                                                flexShrink: 0
                                            }}
                                        >
                                            Join
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.5rem', textAlign: 'center' }}>
                                    No public groups available.
                                </p>
                            )}
                        </>
                    )}
                </nav>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <div style={{
                    padding: '1rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                }}>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.4rem' }}>Share Snippets</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        Invite others to your groups using your unique group code.
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
