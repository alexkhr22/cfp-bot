"use client";

import config from "@/config";
import { useState } from "react";

const LeftSideHome = () =>{
    const [showAddCfp, setShowAddCfp] = useState(false);


    return (
        <div className="rechteck-leftside">
            <header className="cfp-header">
                <div className="add-cfp">
                    <p className="cfp-title">CfP's</p>
                    <button className="addcfp-btn" onClick={() => setShowAddCfp(true)}>+</button>
                </div>
                <div className="search-wrapper">
                    <input type="search" className="cfp-searchbar" placeholder="Suchen …"></input>
                    <button type="submit">🔍</button>
                </div>
            </header>
            {showAddCfp && (
                <div className="addcfp-div">
                    <header>CfP hinzufügen</header>
                    <ul className="addcfp-list">
                        <li>
                            <label>Titel:</label>
                            <input />
                        </li>
                        <li>
                            <label>Einreichungs Deadline:</label>
                            <input />
                        </li>
                        <li>
                            <label>Ort:</label>
                            <input />
                        </li>
                        <li>
                            <label>Datum der Konferenz:</label>
                            <input />
                        </li>
                        <li>
                            <label>URL:</label>
                            <input />
                        </li>
                        <li>
                            <label>Datum Rückmeldung:</label>
                            <input />
                        </li>
                        <li>
                            <label>Einreichungsform:</label>
                            <input />
                        </li>
                        <li>
                            <label>Wort-/Seitenbeschränkung:</label>
                            <input />
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LeftSideHome;