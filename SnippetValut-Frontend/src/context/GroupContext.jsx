import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

import {
    fetchMyGroupsApi,
    fetchPublicGroupsApi,
    createGroupApi,
    joinGroupApi,
    leaveGroupApi
} from '../services/group';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [publicGroups, setPublicGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [loading, setLoading] = useState(true);

    const parseGroupString = (str) => {
        try {
            const content = str.substring(str.indexOf('(') + 1, str.lastIndexOf(')'));
            const pairs = content.split(/, (?=\w+=)/);
            const group = {};
            pairs.forEach(pair => {
                const [key, ...valueParts] = pair.split('=');
                let value = valueParts.join('=');
                // Convert numeric values
                if (!isNaN(value) && value.trim() !== '' && key !== 'groupCode') {
                    value = Number(value);
                }
                group[key] = value;
            });
            return group;
        } catch (e) {
            console.error('Failed to parse group string:', str, e);
            return null;
        }
    };

    const handlePublicGroupsResponse = (data) => {
        const publicGroupsRaw = data.body || data;
        if (publicGroupsRaw && typeof publicGroupsRaw === 'object' && !Array.isArray(publicGroupsRaw)) {
            return Object.entries(publicGroupsRaw)
                .map(([key, count]) => {
                    const group = parseGroupString(key);
                    if (group) {
                        group.memberCount = count;
                    }
                    return group;
                })
                .filter(Boolean);
        }
        return Array.isArray(publicGroupsRaw) ? publicGroupsRaw : [];
    };

    const refreshGroups = async () => {
        setLoading(true);
        try {
            const [myGroupsData, publicGroupsData] = await Promise.all([
                fetchMyGroupsApi().catch(() => []),
                fetchPublicGroupsApi().catch(() => [])
            ]);

            console.log('Raw My Groups Response:', myGroupsData);
            console.log('Raw Public Groups Response:', publicGroupsData);

            const myGroups = myGroupsData.body || myGroupsData;
            const processedPublicGroups = handlePublicGroupsResponse(publicGroupsData);

            setGroups(Array.isArray(myGroups) ? myGroups : []);
            setPublicGroups(processedPublicGroups);

            console.log('Mapped Groups State:', Array.isArray(myGroups) ? myGroups : []);
        } catch (error) {
            console.error('Failed to refresh groups:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            refreshGroups();
        } else {
            setGroups([]);
            setPublicGroups([]);
        }
    }, [user]);

    const createGroup = async (name, description, isPublic = false) => {
        const groupVisibility = isPublic ? 'PUBLIC' : 'PRIVATE';
        try {
            await createGroupApi(name, description, groupVisibility);
            await refreshGroups();
        } catch (error) {
            throw error.message || error;
        }
    };

    const joinGroup = async (code) => {
        try {
            await joinGroupApi(code);
            await refreshGroups();
        } catch (error) {
            throw error.message || error;
        }
    };

    const leaveGroup = async (groupId) => {
        try {
            const groupToLeave = groups.find(g => g.id === groupId);
            if (!groupToLeave) throw new Error('Group not found');

            await leaveGroupApi(groupToLeave.groupCode);
            setGroups(prev => prev.filter(g => g.id !== groupId));
            if (selectedGroupId === groupId) {
                setSelectedGroupId(null);
            }
            fetchPublicGroupsApi()
                .then(data => setPublicGroups(handlePublicGroupsResponse(data)))
                .catch(console.error);
        } catch (error) {
            throw error.message || error;
        }
    };

    return (
        <GroupContext.Provider value={{
            groups,
            publicGroups,
            selectedGroupId,
            setSelectedGroupId,
            createGroup,
            joinGroup,
            leaveGroup,
            refreshGroups,
            loading
        }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroups = () => useContext(GroupContext);
