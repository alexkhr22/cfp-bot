export const createUser = (data = {}) => ({
    key: data.key || 0,
    name: data.name || "",
    tags: data.tags || [],
    joinedkeywordgroupskeys: data.joinedkeywordgroupskeys || []
});