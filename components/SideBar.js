"use client";

import config from "@/config";
import { useState, useEffect } from "react";
import { addUserTag, getAllUsers, removeUserTag } from "@/services/user-service";

const SideBar = ({ screen, setScreen, groups, goToUser, selectedUser }) => {
    const [input, setInput] = useState("");
    const [tags, setTags] = useState([]);
    const [joined, setJoined] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [users, setUsers] = useState([]);

    const showTags = screen === "home";

    useEffect(() => {
        const loadTags = async () => {
            const all = await getAllUsers();
            setUsers(all);

            const user = all.find(u => String(u.id) === String(selectedUser?.id));
            setTags(user?.tags ?? []);
        };

        loadTags();
    }, [selectedUser]);



    const handleNewTag = async () => {
        if (input.trim() === "") return;
        
        await addUserTag(selectedUser.id, input)
        renderTags();
        setInput("");
    }

    const handleDeleteTag = async (tag) => {
        await removeUserTag(selectedUser.id, tag);
        renderTags();
    }

    async function renderTags(){
        const allUsers = await getAllUsers()
        
        allUsers.forEach(userFromAPI => {
            if (userFromAPI.id === selectedUser.id){
                setTags(userFromAPI.tags);
            }
        });
    }

    const handleJoin = () => {
        setJoined(true);
    }

    const handleLeave = () => {
        setJoined(false);
    }

    const handleShowDropdown = () =>{
        setShowDropdown(prev => !prev);
    }

    console.log("RENDER tags:", tags, "isArray:", Array.isArray(tags));

    return (

        <div className="rechteck-sidebar">
            <p>Aktiver Nutzer: {selectedUser ? selectedUser.name : "—"}</p>
            <button
                className={`sidebar-btn ${screen === "home" ? "active" : ""}`}
                onClick={() => {
                    setScreen("home");
                }}
            >
                Home
            </button>
            {showTags &&
                <div className="tagsp-div">
                    <p className="tags-p">Meine Tags:</p>
                </div>
            }
            {showTags &&
                <div className="home-dropdown">
                    
                    <ul className="scroll-list">
                        {(tags ?? []).map((tag, index) => (
                            <li key={index} className="tag-item">
                            <span>{tag}</span>
                            <button
                                className="delete-btn"
                                onClick={() => handleDeleteTag(tag)}
                            >
                                X
                            </button>
                            </li>
                        ))}
                    </ul>
                    
                </div>
            }
            {showTags &&
                <div className="newtag-div">
                    <input className="tag-input" type="text" placeholder="Neuer Tag" value={input} onChange={(e) => setInput(e.target.value)} />
                    <button className="newtag-btn" onClick={handleNewTag}>+</button>
                </div>
            }

            <button
                className={`sidebar-btn ${screen === "newgrp" ? "active" : ""}`}
                onClick={() => setScreen("newgrp")}
            >
                Neue Gruppe
            </button>

            <button
                className={`sidebar-btn ${screen === "groups" ? "active" : ""}`}
                onClick={() => setScreen("groups")}
            >
                Gruppen
            </button>
            <div className="groups-div">
                <ul className="groups-list">
                    {groups.map((group, i) => (
                        <li key={i} className="group-item">
                            <div className="group-item-title-div">
                                {!joined?(
                                    <button className="join-group-btn" onClick={handleJoin}>Join</button>
                                ):(
                                    <button className="leave-group-btn" onClick={handleLeave}>Leave</button>
                                )}
                                <p className="group-item-title"><strong>{group.name}</strong></p>
                                <button className="group-item-dropdown-btn" onClick={handleShowDropdown}>drop</button>
                            </div>
                            {showDropdown &&(
                                <div className="group-item-div">
                                <ul>
                                    {group.keywords.map((keyword, j) => (
                                        <li key={j}>{keyword}</li>
                                    ))}
                                </ul>
                            </div>
                            )}
                            
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={goToUser}>User</button>
        </div>

    );


};

export default SideBar;