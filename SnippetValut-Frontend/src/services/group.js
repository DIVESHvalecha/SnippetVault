const BASE_URL = 'http://localhost:8080';

export const fetchMyGroupsApi = async () => {
    const response = await fetch(`${BASE_URL}/groups/my-groups`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch your groups');
    }

    return response.json();
};

export const fetchPublicGroupsApi = async () => {
    const response = await fetch(`${BASE_URL}/groups/public`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch public groups');
    }

    return response.json();
};

export const fetchGroupDetailsApi = async (groupId) => {
    const response = await fetch(`${BASE_URL}/api/groups/${groupId}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch group details');
    }

    return response.json();
};

export const createGroupApi = async (name, description, groupVisibility) => {
    const response = await fetch(`${BASE_URL}/group`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, groupVisibility }),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to create group');
    }

    return response.json();
};

export const joinGroupApi = async (code) => {
    const response = await fetch(`${BASE_URL}/join-group/${code}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ code }),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to join group');
    }

    return response.json();
};

export const leaveGroupApi = async (code) => {
    const response = await fetch(`${BASE_URL}/leave-group/${code}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to leave group');
    }

    return { success: true };
};
