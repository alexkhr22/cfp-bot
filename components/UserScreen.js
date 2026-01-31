"use client";

import config from "@/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUser, getAllUsers, deleteUser } from "@/services/user-service";



const UserScreen = ({onSelectUser}) =>{
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            const data = await getAllUsers();
            console.log("API users:", data);
            setUsers(data);
        };

        loadUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        await deleteUser(userId);
        setUsers(await getAllUsers());
    }

    const handleNewUser = async () => {
        if (input.trim() === "") return;

        await createUser({ name: input });
        setUsers(await getAllUsers());
        setInput("");
    };
   
    return (
        <div className="user-screen-div">
            <p className="user-para-text">Nutzerauswahl</p>
            <div className="user-list-div">
                <ul className="scroll-list-users">
                        {users.map((user, index) => (
                            <li key={index} className="user-item" onClick={() => onSelectUser(user)}>
                                <span>{user.name}</span>
                                <button className="delete-user-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user.id);
                                }}>
                                    X
                                </button>
                            </li>
                        ))}
                </ul>
                <div className="new-user-div">
                    <input type="text" className="add-user" placeholder="Neuer Nutzer" value={input} onChange={(e) => setInput(e.target.value)}></input>
                    <button className="new-user-btn" onClick={handleNewUser}>+</button>
                </div>
            </div>
        </div>
    );
};

export default UserScreen;
