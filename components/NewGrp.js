"use client";

import config from "@/config";
import { useState } from "react";

const NewGrp = () => {
    const [keyword, setKeywords] = useState([]);
    const [input, setInput] = useState("");


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
            <input type="text" className="groupname" placeholder="Gruppenname"></input>
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
                        {keyword.map((keyword, index) => (
                            <li key={index} className="tag-item">
                                <span>{keyword}</span>
                                <button className="delete-btn" onClick={() => handleDeleteKeyword(index)}>
                                    X
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
            <button className="creategrp-btn">Gruppe erstellen</button>
        </div>
    );
};

export default NewGrp;