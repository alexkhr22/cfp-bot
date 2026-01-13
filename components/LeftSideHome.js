"use client";

import config from "@/config";
import { useState } from "react";
import { createCfp } from "@/models/Cfp";

const LeftSideHome = () =>{
    const [showAddCfp, setShowAddCfp] = useState(false);

    const [form, setForm] = useState({
        title: "",
        submissionDeadline: "",
        location: "",
        dateOfConference: "",
        url: "",
        dateReturnMessage: "",
        submissionForm: "",
        wordLimit: ""
    });

    const [cfps, setCfps] = useState([]);


    function handleCfpInputChange(e){
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function handleDiscard(){

    }

    function handleConfirm(){
        const newCfp = createCfp({
            title: form.title,
            submissionDeadline: form.submissionDeadline,
            location: form.location,
            dateOfConference: form.dateOfConference,
            url: form.url,
            dateReturnMessage: form.dateReturnMessage,
            submissionForm: form.submissionForm,
            wordLimit: form.wordLimit
        });
        setShowAddCfp(false);

        setCfps(prev => [...prev, newCfp]);
        setForm("");
    }


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
                            <input className="cfp-title-add" name="title" value={form.title} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Einreichungs Deadline:</label>
                            <input className="cfp-submission-deadline" name="submissionDeadline" value={form.submissionDeadline} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Ort:</label>
                            <input className="cfp-location" name="location" value={form.location} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Datum der Konferenz:</label>
                            <input className="cfp-conference-date" name="dateOfConference" value={form.dateOfConference} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>URL:</label>
                            <input className="cfp-url" name="url" value={form.url} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Datum Rückmeldung:</label>
                            <input className="cfp-return-message-date" name="dateReturnMessage" value={form.dateReturnMessage} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Einreichungsform:</label>
                            <input className="cfp-submission-form" name="submissionForm" value={form.submissionForm} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Wort-/Seitenbeschränkung:</label>
                            <input className="cfp-word-limit" name="wordLimit" value={form.wordLimit} onChange={handleCfpInputChange}></input>
                        </li>
                    </ul>
                    <div className="cfpaddbtn-box">
                        <button className="confirm-btn"  onClick={handleConfirm}>Bestätigen</button>
                        <button className="discard-btn" onClick={handleDiscard}>Verwerfen</button>
                    </div>
                </div>
            )}
            <ul className="cfps-list">
                {cfps.map((cfp, index) => (
                    <li key={index} className="cfp-item">

                        <div className="cfp-card">
                            <h3>{cfp.title || "No Title"}</h3>

                            <ul className="cfp-details">
                                <li><strong>Titel:</strong> {cfp.title}</li>
                                <li><strong>Deadline:</strong> {cfp.submissionDeadline}</li>
                                <li><strong>Ort:</strong> {cfp.location}</li>
                                <li><strong>Konferenzdatum:</strong> {cfp.dateOfConference}</li>
                                <li><strong>URL:</strong> {cfp.url}</li>
                                <li><strong>Rückmeldung bis:</strong> {cfp.dateReturnMessage}</li>
                                <li><strong>Einreichungsformular:</strong> {cfp.submissionForm}</li>
                                <li><strong>Wortlimit:</strong> {cfp.wordLimit}</li>
                            </ul>
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeftSideHome;