"use client";

import config from "@/config";
import { useState } from "react";

const SideBar = () =>{
    const [input, setInput] = useState("");
    const [tags, setTags] = useState([]);
    const [active, setActive] = useState("home");

    const showTags = active === "home";

    const handleNewTag = () => {
        if (input.trim() === "") return;

        setTags((prevTags) => [...prevTags, input]);
        setInput("");
    }

    const handleDeleteTag = (deleteIndex) => {
        setTags((prevTags) =>
            prevTags.filter((_, index) => index !== deleteIndex)
        );
    }


    return (
    
    <div className="rechteck-sidebar">
        <button
            className={`sidebar-btn ${active === "home" ? "active" : ""}`}
            onClick={() => setActive("home")}
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
                    {tags.map((tag, index) => (
                        <li key={index} className="tag-item">
                            <span>{tag}</span>
                            <button className="delete-btn" onClick={() => handleDeleteTag(index)}>
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
            className={`sidebar-btn ${active === "newGroup" ? "active" : ""}`}
            onClick={() => setActive("newGroup")}
        >
            Neue Gruppe
        </button>

        <button
            className={`sidebar-btn ${active === "groups" ? "active" : ""}`}
            onClick={() => setActive("groups")}
        >
            Gruppen
        </button>
    </div>
        
    ); 


};

export default SideBar;