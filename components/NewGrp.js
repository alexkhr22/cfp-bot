"use client";

import config from "@/config";
import { createGroup, getAllGroups, userJoinGroup } from "@/services/group-service";
import { getAllUsers } from "@/services/user-service";
import { useState } from "react";

const NewGrp = ({addGroup, onCreated, selectedUser}) => {
    const [keywords, setKeywords] = useState([]);
    const [input, setInput] = useState("");
    const [groupName, setGroupName] = useState("");

    const handleCreateGroup = async () => {
        const name = groupName.trim();
        if (!name) return;

        const allGroups = await getAllGroups();

        if (allGroups.find(g => String(g.name) === String(name))) return;
        
        const allUsers = await getAllUsers();
        
        const user = allUsers.find(u => String(u.id) === String(selectedUser?.id));


        

        const createdGroup =await createGroup({ name, keywords });

        await userJoinGroup(user.id, createdGroup.id);
        onCreated?.();
        
        addGroup(name, keywords);
        setKeywords([]);
        setGroupName("");
    };



    const handleAddKeyWord = () => {
        if (input.trim() === "") return;

        setKeywords((prevKeyword) => [...prevKeyword, input]);
        setInput("");
    }

    const handleDeleteKeyword = (deleteIndex) => {
        setKeywords((prevKeyword) =>
            prevKeyword.filter((_, index) => index !== deleteIndex)
        );
    }

    return (
        <div className="rechteck-newgrp">
            <input type="text" className="groupname" placeholder="Gruppenname" value={groupName} onChange={(e) => setGroupName(e.target.value)}></input>
            <div> 
                <input type="text" className="add-keyword" placeholder="Schlagwort hinzufügen" value={input} onChange={(e) => setInput(e.target.value)}></input>
                <button className="addkeyword-btn" onClick={() => handleAddKeyWord()}>
                                        +
                                    </button>
            </div>
            
            <div className="keywordstitle-div">
                    <p className="keyword-p">Hinzugefügte Schlagwörter:</p>
            </div>
            <div className="keywords-div">
                <ul className="scroll-list">
                        {keywords.map((keyword, index) => (
                            <li key={index} className="tag-item">
                                <span>{keyword}</span>
                                <button className="delete-btn" onClick={() => handleDeleteKeyword(index)}>
                                    X
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
            <button className="creategrp-btn" onClick={handleCreateGroup}>Gruppe erstellen</button>
        </div>
    );
};

export default NewGrp;