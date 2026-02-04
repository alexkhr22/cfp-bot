"use client";

import config from "@/config";
import { useState, useEffect } from "react";
import { getAllUsers } from "@/services/user-service";
import { getAllGroups } from "@/services/group-service";

const GroupsScreen = ({selectedUser, refreshKey}) =>{
    const [userGroups, setUserGroups] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
    const load = async () => {
        const allUsers = await getAllUsers();

        const user = allUsers.find(u => String(u.id) === String(selectedUser?.id));

        const links = user?.groups ?? [];
        const allGroups = await getAllGroups(); 

        const userJoinedGroups = links
        .map(l => allGroups.find(g => String(g.id) === String(l.groupId)))
        .filter(Boolean);

        setUserGroups(userJoinedGroups);
        setGroups(allGroups);
    };

        if (selectedUser?.id) load();
    }, [selectedUser?.id, refreshKey]);


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
                                    <button className="delete-group-btn">Gruppe löschen</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="groups-right-side">
                    <p className="no-member-p">Kein Mitglied</p>
                </div>
            </div>
        </div>
    );
};

export default GroupsScreen;