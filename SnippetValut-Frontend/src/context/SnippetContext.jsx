import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useGroups } from './GroupContext';
import {
    fetchPublicSnippetsApi,
    fetchMyAllSnippetsApi,
    fetchGroupSnippetsApi,
    createSnippetApi,
    updateSnippetApi,
    deleteSnippetApi,
    fetchFoldersApi,
    createFolderApi,
    deleteFolderApi,
    addSnippetToFolderApi,
    fetchFolderSnippetsApi,
    removeSnippetFromFolderApi
} from '../services/snippet';
import { MOCK_SNIPPETS } from '../utils/mockData';

const SnippetContext = createContext();

export const SnippetProvider = ({ children }) => {
    const { user, updateUser } = useAuth();
    const { groups } = useGroups();
    const [snippets, setSnippets] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedFolderSnippets, setSelectedFolderSnippets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [folderLoading, setFolderLoading] = useState(false);

    const normalizeSnippet = (s) => ({
        ...s,
        id: s.snippetId || s.id,
        code: s.content || s.code || '',
        visibility: (s.visibility || 'public').toLowerCase(),
        // Ensure userId is a string for consistent filtering
        userId: s.userId ? String(s.userId) : null
    });

    const normalizeFolder = (f) => ({
        ...f,
        id: f.folderId || f.id
    });

    const refreshFolders = async () => {
        if (!user) {
            setFolders([]);
            return;
        }
        try {
            const data = await fetchFoldersApi();
            const rawFolders = data?.body || data || [];
            setFolders(rawFolders.map(normalizeFolder));
        } catch (err) {
            console.error('Failed to fetch folders:', err);
        }
    };

    const refreshSnippets = async () => {
        if (!user) {
            setSnippets([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // 1. Fetch Basic Snippets (Public and Own)
            const [publicData, myData] = await Promise.all([
                fetchPublicSnippetsApi().catch(() => []),
                fetchMyAllSnippetsApi().catch(() => [])
            ]);

            const rawPublic = publicData?.body || publicData || [];
            const rawMy = myData?.body || myData || [];

            // 2. Discover and update User ID if missing/incorrect in AuthContext
            if (rawMy.length > 0 && String(user.id || user.userId) !== String(rawMy[0].userId)) {
                console.log('Automated User ID Discovery: Setting ID to', rawMy[0].userId);
                updateUser({ id: rawMy[0].userId, userId: rawMy[0].userId });
            }

            // 3. Fetch Group Snippets for all joined groups
            const groupSnippetsPromises = (groups || []).map(group =>
                fetchGroupSnippetsApi(group.groupCode || group.code).catch(() => [])
            );
            const groupsDataResults = await Promise.all(groupSnippetsPromises);

            // Extract snippets from .body for each group response
            const rawGroups = groupsDataResults.flatMap(res => res?.body || res || []);

            // 4. Normalize and combine everything
            const normalizedPublic = rawPublic.map(normalizeSnippet);
            const normalizedMy = rawMy.map(normalizeSnippet);
            const normalizedGroups = rawGroups.map(normalizeSnippet);

            const combined = [...normalizedPublic, ...normalizedMy, ...normalizedGroups];

            // Deduplicate by ID
            const uniqueSnippets = Array.from(new Map(combined.map(s => [s.id, s])).values());

            setSnippets(uniqueSnippets);
        } catch (err) {
            console.error('Failed to fetch snippets:', err);
            // Fallback during migration
            setSnippets(MOCK_SNIPPETS);
        } finally {
            setLoading(false);
        }
    };

    // Refresh when user OR groups change (since we need groups to fetch group snippets)
    useEffect(() => {
        refreshSnippets();
        refreshFolders();
    }, [user?.email, groups.length]); // Use email as trigger since user object might be updated with ID later


    const createFolder = async (name, description = '') => {
        try {
            await createFolderApi({ name, description });
            await refreshFolders();
            return true;
        } catch (err) {
            console.error('Failed to create folder:', err);
            throw err;
        }
    };

    const deleteFolder = async (id) => {
        try {
            await deleteFolderApi(id);
            await refreshFolders();
            if (selectedFolderId === id) setSelectedFolderId(null);
            return true;
        } catch (err) {
            console.error('Failed to delete folder:', err);
            throw err;
        }
    };

    // Fetch snippets when selectedFolderId changes
    useEffect(() => {
        const fetchFolderSnippets = async () => {
            if (!selectedFolderId) {
                setSelectedFolderSnippets([]);
                return;
            }
            try {
                setFolderLoading(true);
                const data = await fetchFolderSnippetsApi(selectedFolderId);
                const raw = data?.body || data || [];
                setSelectedFolderSnippets(raw.map(normalizeSnippet));
            } catch (err) {
                console.error('Failed to fetch folder snippets:', err);
            } finally {
                setFolderLoading(false);
            }
        };
        fetchFolderSnippets();
    }, [selectedFolderId]);

    const addSnippet = async (snippet) => {
        try {
            const backendData = {
                ...snippet,
                content: snippet.code,
                visibility: (snippet.visibility || 'public').toUpperCase()
            };
            if (backendData.code) delete backendData.code;

            await createSnippetApi(backendData);
            // Automatically fetch all snippets again to ensure sync
            await refreshSnippets();
            return true;
        } catch (err) {
            console.error('Failed to create snippet:', err);
            throw err;
        }
    };

    const updateSnippet = async (id, data) => {
        try {
            const backendData = { ...data };
            if (data.code) {
                backendData.content = data.code;
                delete backendData.code;
            }
            if (data.visibility) {
                backendData.visibility = data.visibility.toUpperCase();
            }

            await updateSnippetApi(id, backendData);
            // Automatically fetch all snippets again to ensure sync
            await refreshSnippets();
            return true;
        } catch (err) {
            console.error('Failed to update snippet:', err);
            throw err;
        }
    };

    const deleteSnippet = async (id) => {
        try {
            await deleteSnippetApi(id);
            // Automatically fetch all snippets again to ensure sync
            await refreshSnippets();
            return true;
        } catch (err) {
            console.error('Failed to delete snippet:', err);
            throw err;
        }
    };

    const assignToFolder = async (snippetId, folderId) => {
        try {
            await addSnippetToFolderApi(folderId, snippetId);
            await refreshSnippets();
            return true;
        } catch (err) {
            console.error('Failed to assign snippet to folder:', err);
            throw err;
        }
    };

    const removeFromFolder = async (snippetId, folderId) => {
        try {
            await removeSnippetFromFolderApi(folderId, snippetId);
            await refreshSnippets();
            return true;
        } catch (err) {
            console.error('Failed to remove snippet from folder:', err);
            throw err;
        }
    };

    return (
        <SnippetContext.Provider value={{
            snippets,
            folders,
            selectedFolderId,
            setSelectedFolderId,
            selectedFolderSnippets,
            createFolder,
            deleteFolder,
            addSnippet,
            updateSnippet,
            deleteSnippet,
            assignToFolder,
            removeFromFolder,
            loading,
            folderLoading,
            refreshSnippets,
            refreshFolders
        }}>
            {children}
        </SnippetContext.Provider>
    );
};

export const useSnippets = () => useContext(SnippetContext);
