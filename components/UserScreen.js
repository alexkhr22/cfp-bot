"use client";

import config from "@/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/services/user-service";



const UserScreen = ({goBack}) =>{
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState("");

    const handleDeleteUser = (deleteIndex) => {
        setUsers((prevUser) =>
            prevUser.filter((_, index) => index !== deleteIndex)
        );
    }

    const handleNewUser = async () => {
        if (input.trim() === "") return;

        setUsers((prevUser) => [...prevUser, input]);
        console.log(input + " AAAA ");
        const user = await createUser({name: input});
        console.log(user.id)
        setInput("");
        
    };


   

    return (
        <div className="user-screen-div">
            <p className="user-para-text">Nutzerauswahl</p>
            <div className="user-list-div">
                <ul className="scroll-list-users">
                        {users.map((users, index) => (
                            <li key={index} className="user-item" onDoubleClick={goBack}>
                                <span>{users}</span>
                                <button className="delete-user-btn" onClick={() => handleDeleteUser(index)}>
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
