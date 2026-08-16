import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SnippetCard from '../../components/snippets/SnippetCard';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import SnippetDetails from '../../components/snippets/SnippetDetails';
import GroupModal from '../../components/common/GroupModal';
import FolderModal from '../../components/common/FolderModal';
import Toast from '../../components/common/Toast';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useGroups } from '../../context/GroupContext';
import { useSnippets } from '../../context/SnippetContext';
import { Search, SlidersHorizontal, Users, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { groups, selectedGroupId, setSelectedGroupId, leaveGroup, refreshGroups, loading: groupsLoading } = useGroups();
    const {
        snippets,
        folders,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        selectedFolderId,
        setSelectedFolderId,
        selectedFolderSnippets,
        loading: snippetsLoading,
        folderLoading
    } = useSnippets();

    const [filteredSnippets, setFilteredSnippets] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewSnippet, setIsNewSnippet] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

    // Toast State
    const [toast, setToast] = useState(null);

    const currentUserId = user?.id || user?.userId;

    useEffect(() => {
        // If a folder is selected, we use the specific snippets for that folder
        let result = selectedFolderId ? selectedFolderSnippets : snippets;

        // Primary Filter logic (only if no specific folder is selected)
        if (!selectedFolderId) {
            if (selectedGroupId) {
                // Filter by group
                result = result.filter(s => s.visibility === 'group' && s.groupId === selectedGroupId);
            } else {
                // Main Navigation Filters
                switch (filter) {
                    case 'all':
                        // All Snippets: The "Public Feed" from everyone
                        result = result.filter(s => s.visibility === 'public');
                        break;
                    case 'my-all':
                        // My Vault: Everything owned by the current user
                        result = result.filter(s => String(s.userId) === String(currentUserId));
                        break;
                    case 'my-public':
                        // My Vault > Public
                        result = result.filter(s => String(s.userId) === String(currentUserId) && s.visibility === 'public');
                        break;
                    case 'my-private':
                        // My Vault > Private
                        result = result.filter(s => String(s.userId) === String(currentUserId) && s.visibility === 'private');
                        break;
                    case 'public':
                    case 'private':
                        // Fallback for any legacy calls, although Sidebar now uses 'my-public'/'my-private'
                        result = result.filter(s => s.visibility === filter && String(s.userId) === String(currentUserId));
                        break;
                    default:
                        result = result.filter(s => s.visibility === filter);
                }
            }
        }

        // Search filter
        if (searchQuery) {
            result = result.filter(s =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.language.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredSnippets(result);
    }, [filter, searchQuery, snippets, selectedFolderSnippets, selectedGroupId, selectedFolderId, currentUserId]);

    const handleNewSnippet = () => {
        setIsNewSnippet(true);
        // Pre-fill group or folder if we are in a specific view
        setSelectedSnippet({
            title: '',
            description: '',
            language: 'javascript',
            visibility: selectedGroupId ? 'group' : 'private',
            groupId: selectedGroupId || null,
            folderId: selectedFolderId || null,
            code: '// Start coding here...'
        });
        setIsModalOpen(true);
    };

    const handleSnippetClick = (snippet) => {
        setIsNewSnippet(false);
        setSelectedSnippet(snippet);
        setIsModalOpen(true);
    };

    const handleSaveSnippet = async (data) => {
        try {
            if (isNewSnippet) {
                await addSnippet(data);
                showToast('Snippet created successfully!', 'success');
            } else {
                await updateSnippet(selectedSnippet.id, data);
                showToast('Snippet updated successfully!', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            showToast('Failed to save snippet', 'error');
        }
    };

    const handleDeleteSnippet = (id) => {
        if (window.confirm('Are you sure you want to delete this snippet?')) {
            deleteSnippet(id);
            showToast('Snippet deleted', 'info');
            setIsModalOpen(false);
        }
    };

    const handleResetData = async () => {
        if (window.confirm('Refreshing all data from server. Continue?')) {
            await refreshGroups();
            // Local state reset for snippets could also be added if needed
            showToast('Data synced', 'success');
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleLeaveGroup = async () => {
        if (!selectedGroupId) return;

        const group = groups.find(g => g.id === selectedGroupId);
        if (window.confirm(`Are you sure you want to leave "${group?.name}"?`)) {
            try {
                await leaveGroup(selectedGroupId);
                showToast('You have left the group', 'info');
            } catch (error) {
                showToast(error || 'Failed to leave group', 'error');
            }
        }
    };


    const getHeaderTitle = () => {
        if (selectedFolderId) {
            const folder = folders.find(f => f.id === selectedFolderId);
            if (folder && folder.groupId) {
                const group = groups.find(g => g.id === folder.groupId);
                return `${group?.name || group?.groupCode || 'Group'} > ${folder.name}`;
            }
            return folder ? folder.name : 'Folder View';
        }

        if (selectedGroupId) {
            const group = groups.find(g => g.id === selectedGroupId);
            return group ? (group.name || group.groupCode || 'Unnamed Group') : 'Group Vault';
        }
        switch (filter) {
            case 'all': return 'Public Snippets';
            case 'my-all': return 'My Vault';
            case 'my-public': return 'My Public Snippets';
            case 'my-private': return 'My Private Snippets';
            default: return 'Your Vault';
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', overflowX: 'hidden' }}>
            <Navbar
                user={user}
                onLogout={logout}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div style={{ display: 'flex', position: 'relative' }}>
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                zIndex: 900,
                            }}
                            className="mobile-only"
                        />
                    )}
                </AnimatePresence>

                <Sidebar
                    activeFilter={filter}
                    setFilter={setFilter}
                    onNewSnippet={handleNewSnippet}
                    onManageGroups={() => setIsGroupModalOpen(true)}
                    onNewFolder={() => setIsFolderModalOpen(true)}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <main style={{
                    flex: 1,
                    padding: window.innerWidth <= 768 ? '1rem' : '2rem',
                    width: '100%',
                    minHeight: 'calc(100vh - 64px)'
                }}>
                    <header style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {selectedGroupId && <Users size={24} style={{ color: 'var(--accent-primary)' }} />}
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                        {getHeaderTitle()}
                                    </h2>
                                    {selectedGroupId && (
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-secondary)',
                                            marginTop: '0.25rem',
                                            fontStyle: 'italic',
                                            paddingLeft: '0.6rem',
                                            borderLeft: '2px solid var(--border-color)',
                                            lineHeight: '1.4',
                                        }}>
                                            {groups.find(g => g.id === selectedGroupId)?.description || 'Shared team workspace'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {selectedGroupId && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        fontWeight: '600',
                                        textTransform: 'uppercase'
                                    }}>
                                        Group Code
                                    </div>
                                    <div style={{
                                        fontSize: '1rem',
                                        backgroundColor: 'var(--accent-soft)',
                                        color: 'var(--accent-primary)',
                                        padding: '0.4rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: '700',
                                        letterSpacing: '0.05em',
                                        border: '1px dashed var(--accent-primary)'
                                    }}>
                                        {groups.find(g => g.id === selectedGroupId)?.groupCode}
                                    </div>
                                    <button
                                        onClick={handleLeaveGroup}
                                        style={{
                                            marginTop: '0.4rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: 'var(--error)',
                                            backgroundColor: 'var(--error-soft)',
                                            border: '1px solid rgba(220, 38, 38, 0.1)',
                                            cursor: 'pointer',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: 'var(--radius-md)',
                                            transition: 'all 0.2s ease',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.025em',
                                            width: 'fit-content'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--error)';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--error-soft)';
                                            e.currentTarget.style.color = 'var(--error)';
                                        }}
                                    >
                                        <LogOut size={12} />
                                        Leave Group
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Search snippets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--bg-primary)',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleResetData}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Reset Data
                            </button>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                <SlidersHorizontal size={18} />
                                Filters
                            </button>
                        </div>
                    </header>

                    <section>
                        {(snippetsLoading || groupsLoading || folderLoading) ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} style={{
                                        height: '240px',
                                        backgroundColor: 'var(--bg-primary)',
                                        borderRadius: 'var(--radius-lg)',
                                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                        opacity: 0.5
                                    }} />
                                ))}
                            </div>
                        ) : filteredSnippets.length > 0 ? (
                            <motion.div
                                layout
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
                            >
                                <AnimatePresence>
                                    {filteredSnippets.map((snippet) => (
                                        <motion.div
                                            key={snippet.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            layout
                                        >
                                            <SnippetCard snippet={snippet} onClick={handleSnippetClick} currentUserId={currentUserId} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>No snippets found in this category.</p>
                                {selectedGroupId && (
                                    <Button variant="outline" style={{ marginTop: '1rem' }} onClick={handleNewSnippet}>
                                        Add first group snippet
                                    </Button>
                                )}
                            </div>
                        )}
                    </section>
                </main>
            </div>

            <SnippetDetails
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                snippet={selectedSnippet}
                isNew={isNewSnippet}
                onSave={handleSaveSnippet}
                onDelete={handleDeleteSnippet}
            />

            <GroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onShowToast={showToast}
            />

            <FolderModal
                isOpen={isFolderModalOpen}
                onClose={() => setIsFolderModalOpen(false)}
                onShowToast={showToast}
            />

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.1; }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
