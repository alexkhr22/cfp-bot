"use client";

import config from "@/config";
import { useState } from "react";

const SideBar = () =>{
    const [input, setInput] = useState("");
    const [tags, setTags] = useState([]);

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
        <button className="sidebar-btn">Home</button>
        <div className="tagsp-div">
            <p className="tags-p">Meine Tags:</p>
        </div>
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
        <div className="newtag-div">
            <input className="tag-input" type="text" placeholder="Neuer Tag" value={input} onChange={(e) => setInput(e.target.value)} />
            <button className="newtag-btn" onClick={handleNewTag}>+</button>
        </div>
        <button className="sidebar-btn">Neue Gruppe</button>
        <button className="sidebar-btn">Gruppen</button>
    </div>
        
    ); 


};

export default SideBar;