const BASE_URL = 'http://localhost:8080';

/**
 * 1. Fetch all public snippets from all users
 * GET /snippets/public
 */
export const fetchPublicSnippetsApi = async () => {
    const response = await fetch(`${BASE_URL}/snippets/public`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch public snippets');
    }

    return response.json();
};

/**
 * 2. Fetch all snippets belonging to the current user (public, private, group)
 * GET /snippets/own
 */
export const fetchMyAllSnippetsApi = async () => {
    const response = await fetch(`${BASE_URL}/snippets/own`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch your snippets');
    }

    return response.json();
};

/**
 * 3. Fetch only the current user's private snippets
 * GET /snippets/private
 */
export const fetchMyPrivateSnippetsApi = async () => {
    const response = await fetch(`${BASE_URL}/snippets/private`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch private snippets');
    }

    return response.json();
};

/**
 * 4. Fetch snippets for a specific group via groupCode
 * GET /snippets/group/{groupCode}
 */
export const fetchGroupSnippetsApi = async (groupCode) => {
    const response = await fetch(`${BASE_URL}/snippets/group/${groupCode}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch group snippets');
    }

    return response.json();
};

/**
 * 5. Fetch a single snippet by ID
 * GET /snippets/{id}
 */
export const fetchSnippetByIdApi = async (id) => {
    const response = await fetch(`${BASE_URL}/snippets/${id}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch snippet details');
    }

    return response.json();
};

/**
 * 6. Create a new snippet
 * POST /create-snippet
 */
export const createSnippetApi = async (snippetData) => {
    const response = await fetch(`${BASE_URL}/create-snippet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(snippetData),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to create snippet');
    }

    return response.json();
};

/**
 * 7. Update an existing snippet
 * PATCH /snippets/{id}
 */
export const updateSnippetApi = async (id, snippetData) => {
    const response = await fetch(`${BASE_URL}/snippets/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(snippetData),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to update snippet');
    }

    // Backend returns plain text / empty body on success — don't parse JSON
    return { success: true };
};

/**
 * 8. Delete a snippet
 * DELETE /snippets/{id}
 */
export const deleteSnippetApi = async (id) => {
    const response = await fetch(`${BASE_URL}/snippets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to delete snippet');
    }

    return { success: true };
};

/**
 * 9. Fetch all folders
 * GET /folder
 */
export const fetchFoldersApi = async () => {
    const response = await fetch(`${BASE_URL}/folder`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch folders');
    }

    return response.json();
};

/**
 * 10. Create a new folder
 * POST /folder
 */
export const createFolderApi = async (folderData) => {
    const response = await fetch(`${BASE_URL}/folder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(folderData),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to create folder');
    }

    return response.json();
};

/**
 * 11. Delete a folder
 * DELETE /folder/{id}
 */
export const deleteFolderApi = async (id) => {
    const response = await fetch(`${BASE_URL}/folder/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to delete folder');
    }

    return { success: true };
};

/**
 * 12. Add a snippet to a folder
 * POST /folder/{folderId}/snippet/{snippetId}
 */
export const addSnippetToFolderApi = async (folderId, snippetId) => {
    const response = await fetch(`${BASE_URL}/folder/${folderId}/snippet/${snippetId}`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to add snippet to folder');
    }

    return { success: true };
};

/**
 * 13. Fetch snippets for a specific folder
 * GET /folder/{folderId}/snippet
 */
export const fetchFolderSnippetsApi = async (folderId) => {
    const response = await fetch(`${BASE_URL}/folder/${folderId}/snippet`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch folder snippets');
    }

    return response.json();
};

/**
 * 14. Remove a snippet from a folder
 * DELETE /folder/{folderId}/snippet/{snippetId}
 */
export const removeSnippetFromFolderApi = async (folderId, snippetId) => {
    const response = await fetch(`${BASE_URL}/folder/${folderId}/snippet/${snippetId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to remove snippet from folder');
    }

    return { success: true };
};

/**
 * 15. Fetch all versions of a snippet
 * GET /snippets/{id}/versions
 */
export const fetchSnippetVersionsApi = async (snippetId) => {
    const response = await fetch(`${BASE_URL}/snippets/${snippetId}/versions`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch snippet versions');
    }

    return response.json();
};

/**
 * 16. Fetch a specific version of a snippet (includes full content)
 * GET /snippets/{id}/versions/{versionNumber}
 */
export const fetchSnippetVersionApi = async (snippetId, versionNumber) => {
    const response = await fetch(`${BASE_URL}/snippets/${snippetId}/versions/${versionNumber}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch snippet version');
    }

    return response.json();
};

/**
 * 17. Restore a snippet to a specific version
 * POST /snippets/{id}/restore/{versionNumber}
 */
export const restoreSnippetVersionApi = async (snippetId, versionNumber) => {
    const response = await fetch(`${BASE_URL}/snippets/${snippetId}/restore/${versionNumber}`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to restore snippet version');
    }

    // Backend may return empty body or plain text — don't try to parse JSON
    return { success: true };
};

/**
 * 18. Fork a snippet at a specific version
 * POST /snippets/{id}/fork/{versionNumber}
 */
export const forkSnippetApi = async (snippetId, versionNumber) => {
    const response = await fetch(`${BASE_URL}/snippets/${snippetId}/fork/${versionNumber}`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fork snippet');
    }

    return response.json();
};
