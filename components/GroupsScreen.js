"use client";

import { useState, useEffect } from "react";
import { getAllUsers } from "@/services/user-service";
import { deleteGroup, getAllGroups, userLeaveGroup, userJoinGroup } from "@/services/group-service";

const GroupsScreen = ({selectedUser, refreshKey, onGroupsChanged}) =>{
    const [userGroups, setUserGroups] = useState([]);
    const [groups, setGroups] = useState([]);
    const [userNotJoinedGroups, setUserNotJoinedGroups] = useState([]);

    useEffect(() => {
    const load = async () => {
        const allUsers = await getAllUsers();

        const user = allUsers.find(u => String(u.id) === String(selectedUser?.id));

        const links = user?.groups ?? [];
        const allGroups = await getAllGroups(); 

        const userJoinedGroups = links
        .map(l => allGroups.find(g => String(g.id) === String(l.groupId)))
        .filter(Boolean);

        const joinedGroupIds = new Set(userJoinedGroups.map(g => String(g.id)));

        const userNotJoinedGroups = allGroups.filter(
        g => !joinedGroupIds.has(String(g.id))
        );

        setUserNotJoinedGroups(userNotJoinedGroups);
        setUserGroups(userJoinedGroups);
        setGroups(allGroups);
    };

        if (selectedUser?.id) load();
    }, [selectedUser?.id, refreshKey]);

    const handleDeleteGroup = async (userGroup) => {
        if (!userGroup || !selectedUser) return;

        const currentGroup = await getClickedGroup(userGroup);

        if (userGroups.find(ug => String(ug.id) === String(currentGroup.id))){
            await userLeaveGroup(selectedUser.id, currentGroup.id);;
        }

        

        await deleteGroup(currentGroup.id);
        
        onGroupsChanged?.();
    }

    
    async function getClickedGroup(group){
        const allGroups = await getAllGroups();

        const currentGroup = allGroups.find(g => String(g.name) === String(group?.name));

        return currentGroup;
    }

    
    const handleLeave = async (group) => {
        if (!group || !selectedUser) return;

        const currentGroup = await getClickedGroup(group);

        await userLeaveGroup(selectedUser.id, currentGroup.id)
        
        onGroupsChanged?.();
    }


    const handleJoin = async (group) => {
        if (!group || !selectedUser) return;

        const currentGroup = await getClickedGroup(group);

        await userJoinGroup(selectedUser.id, currentGroup.id)
        
        onGroupsChanged?.();
    }


    return (
        <div className="groups-screen-div">
            <div className="groups-screen-title-div">
                <p className="groups-screen-title">Alle Gruppen</p>
            </div>
            <div className="groups-content">
                <div className="groups-left-side">
                    <p className="member-p">Mitglied</p>
                    <ul className="member-groups-list">
                        {(userGroups ?? []).map((userGroup, index) => (
                            <li key={index} className="groups-screen-group-item">
                                <div className="groups-screen-group-item-title-div">
                                    <button className="groups-screen-leave-group-btn" onClick={() => handleLeave(userGroup)}>Leave</button>
                                    <p>{userGroup.name}</p>
                                </div>
                                <div className="groups-screen-group-item-content-div">
                                    <p className="keyword-title-p">Schlagwörter:</p>
                                    <div className="groups-ulist-div">
                                        <ul className="groups-keywords-scroll-list">
                                        {userGroup.keywords.map((keyword, index) => (
                                            <li key={index} className="tag-item">
                                                <span>{keyword}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    </div>
                                    <button className="delete-group-btn" onClick={() => handleDeleteGroup(userGroup)}>Gruppe löschen</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="groups-right-side">
                    <p className="no-member-p">Kein Mitglied</p>
                    <ul className="member-groups-list">
                        {(userNotJoinedGroups ?? []).map((userNotGroup, index) => (
                            <li key={index} className="groups-screen-group-item">
                                <div className="groups-screen-group-item-title-div">
                                    <button className="groups-screen-leave-group-btn" onClick={() => handleJoin(userNotGroup)}>Join</button>
                                    <p>{userNotGroup.name}</p>
                                </div>
                                <div className="groups-screen-group-item-content-div">
                                    <p className="keyword-title-p">Schlagwörter:</p>
                                    <div className="groups-ulist-div">
                                        <ul className="groups-keywords-scroll-list">
                                        {userNotGroup.keywords.map((keyword, index) => (
                                            <li key={index} className="tag-item">
                                                <span>{keyword}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    </div>
                                    <button className="delete-group-btn" onClick={() => handleDeleteGroup(userNotGroup)}>Gruppe löschen</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GroupsScreen;