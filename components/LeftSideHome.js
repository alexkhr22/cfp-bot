"use client";

import config from "@/config";
import { useState } from "react";

const LeftSideHome = () =>{
    return (
        <div className="rechteck-leftside">
            <header className="cfp-header">
                <div className="add-cfp">
                    <p className="cfp-title">CfP's</p>
                    <button className="addcfp-btn">+</button>
                </div>
                <div className="search-wrapper">
                    <input type="search" className="cfp-searchbar" placeholder="Suchen …"></input>
                    <button type="submit">🔍</button>
                </div>
            </header>
        </div>
    );
};

export default LeftSideHome;