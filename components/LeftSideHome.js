"use client";

import { useState, useEffect } from "react";
import { createCfp } from "@/models/Cfp";
import { addCFP, getUserCfPs, updateCfPTag } from "@/services/cfp-service";
import { addUserTag, getAllUsers } from "@/services/user-service";
import { useUserGroups } from "@/hooks/useUserGroups";

const LeftSideHome = ({selectedUser, reloadUser, refreshKey, cfps, setCfps, onCfpChanged}) =>{
    const [showAddCfp, setShowAddCfp] = useState(false);

    const emptyForm = {
        title: "",
        submissionDeadline: "",
        location: "",
        dateOfConference: "",
        url: "",
        submissionForm: "OPENREVIEW",
        wordLimit: "",
        tag: "",
        groupIds: []
    };

    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);
    const [tagEdit, setTagEdit] = useState("");

    const {userGroups} = useUserGroups(selectedUser?.id, refreshKey);

    const [showAllCfp, setShowAllCfp] = useState(false);

    const [allCfpGlobal, setAllCfpGlobal] = useState([]);
    const [userCfpGlobal, setUserCfpGlobal] = useState([]);
    const sortedCfps = [...cfps].sort((a, b) => {
        return new Date(a.deadline) - new Date(b.deadline);
    });


    useEffect(() => {
        if (!selectedUser?.id) return;

        const loadAndMerge = async () => {
            const allCfp = await getAllCfPFromUsers();
            setAllCfpGlobal(allCfp);

            const allUsers = await getAllUsers();
            const freshUser = allUsers.find(u => String(u.id) === String(selectedUser.id));
            const freshTags = freshUser?.tags ?? [];

            allCfp.forEach(cfp => {
                console.log("ALL CFP TAGS ARRAY:", getCfpTagsArray(cfp));
            });

            const tagMatches = allCfp.filter(cfp =>
                getCfpTagsArray(cfp).some(tag => freshTags.includes(tag))
            );
            console.log("TAG MATCHES: " + tagMatches)

            const keywords = (userGroups?.flatMap(g => g.keywords) ?? [])
            .map(k => k.toLowerCase());


            const keywordMatches = allCfp.filter(cfp => {
                const text = cfpToSearchText(cfp);
                return keywords.some(kw => text.includes(kw));
            });


            const mergedById = new Map();
            for (const cfp of [...tagMatches, ...keywordMatches]) {
                mergedById.set(String(cfp.id), cfp);
            }
            

            setCfps(Array.from(mergedById.values()));
            setUserCfpGlobal(Array.from(mergedById.values()));
            
        };

            loadAndMerge();
        }, [selectedUser?.id, refreshKey, userGroups]);

    const getCfpTagsArray = (cfp) => {
        if (Array.isArray(cfp.tags)) return cfp.tags;
        if (typeof cfp.tags === "string") {
            return cfp.tags
            .split(",")
            .map(t => t.trim())
            .filter(Boolean);
        }
        return [];
    };

    
    async function getAllCfPFromUsers() {
        const users = await getAllUsers();

        const allCfpArrays = await Promise.all(
            users.map(u => getUserCfPs(u.id))
        );

        return allCfpArrays.flat();
    }

    function handleCfpInputChange(e){
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    function handleDiscard(){
        setShowAddCfp(false);
        setForm(emptyForm);
    }

    const parseTags = (s) =>
        String(s ?? "")
            .split(",")
            .map(t => t.trim())
            .filter(Boolean);

    async function handleConfirm(){
        const newCfp = createCfp({
            userId: selectedUser.id,
            title: form.title,
            deadline: form.submissionDeadline,
            conferenceDate: form.dateOfConference,
            location: form.location,
            url: form.url,
            submissionForm: form.submissionForm,
            wordCharacterLimit: form.wordLimit,
            tags: parseTags(form.tag),
            groupIds: form.groupIds
        });
        console.log("Form Tag: " + form.tag)
        setShowAddCfp(false);

        await reloadUser();

        const inputTags = String(form.tag || "")
            .split(",")
            .map(t => t.trim())
            .filter(Boolean);

        const existingTags = new Set(
            (selectedUser.tags ?? [])
            .flatMap(t => String(t).split(","))
            .map(t => t.trim().toLowerCase())
        );

        for (const tag of inputTags) {
            if (!existingTags.has(tag.toLowerCase())) {
            await addUserTag(selectedUser.id, tag);
            }
        }

        await reloadUser();


        const savedCfp = await addCFP(newCfp)
        setCfps(prev => [...prev, savedCfp]);
        onCfpChanged?.();
        setForm(emptyForm);
    }

    const startEditTag = (cfp) => {
        setEditingId(cfp.id);
        setTagEdit(cfp.tag ?? "");
    };

    const cancelEditTag = () => {
        setEditingId(null);
        setTagEdit("");
    };

    const saveEditTag = async (cfp) => {
        const newTag = tagEdit.trim();

        if (newTag === cfp.tags) {
            cancelEditTag();
            return;
        }

        setCfps(prev =>
            prev.map(cfpItem =>
                cfpItem.id === cfp.id ? { ...cfpItem, tag: newTag } : cfpItem
            )
        );

        if (!selectedUser.tags.includes(newTag)) {
            await addUserTag(selectedUser.id, newTag);
            reloadUser();
        }

        await updateCfPTag(cfp.id, newTag);

        onCfpChanged?.();

        cancelEditTag();
    };


    function cfpToSearchText(cfp) {
        return [
            cfp.title,
            cfp.location,
            cfp.url,
            cfp.submissionForm,
            cfp.tag,
            cfp.wordCharacterLimit,
            cfp.deadline,
            cfp.conferenceDate,
        ]
            .filter(Boolean)        
            .join(" ")
            .toLowerCase();       
    }      

    const showAllCfpClicked = () => {
        setCfps(allCfpGlobal);
        setShowAllCfp(true);

    }

    const showUserCfpClicked = () => {
        setCfps(userCfpGlobal);
        setShowAllCfp(false);
    }


    return (
        <div className="rechteck-leftside">
            <header className="cfp-header">
                <div className="add-cfp">
                    <p className="cfp-title">CfP's</p>
                    <button className="addcfp-btn" onClick={() => setShowAddCfp(true)}>+</button>
                </div>
                {!showAllCfp ? (
                    <button className="show-all-cfp-btn" onClick={() => showAllCfpClicked()}>Show All</button>
                ) : (
                    <button className="show-user-cfp-btn" onClick={() => showUserCfpClicked()}>Show User CfP</button>
                )}
                
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
                            <input className="cfp-title-add"  name="title" value={form.title} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Einreichungs Deadline:</label>
                            <input className="cfp-submission-deadline" type="date" name="submissionDeadline" value={form.submissionDeadline} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Ort:</label>
                            <input className="cfp-location" name="location" value={form.location} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Datum der Konferenz:</label>
                            <input className="cfp-conference-date" type="date" name="dateOfConference" value={form.dateOfConference} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>URL:</label>
                            <input className="cfp-url" name="url" value={form.url} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Einreichungsform:</label>
                            <select className="cfp-submission-form" name="submissionForm" value={form.submissionForm} onChange={handleCfpInputChange}>
                                <option value="OPENREVIEW">OPENREVIEW</option>
                                <option value="EASYCHAIR">EASYCHAIR</option>
                                <option value="PDF">PDF</option>
                                <option value="OTHER">OTHER</option>
                            </select>
                        </li>
                        <li>
                            <label>Wort-/Seitenbeschränkung:</label>
                            <input className="cfp-word-limit" name="wordLimit" value={form.wordLimit} onChange={handleCfpInputChange}></input>
                        </li>
                        <li>
                            <label>Tag:</label>
                            <input className="cfp-tag" name="tag" value={form.tag} onChange={handleCfpInputChange}></input>
                        </li>
                    </ul>
                    <div className="cfpaddbtn-box">
                        <button className="confirm-btn"  onClick={handleConfirm}>Bestätigen</button>
                        <button className="discard-btn" onClick={handleDiscard}>Verwerfen</button>
                    </div>
                </div>
            )}
            <ul className="cfps-list">
                {sortedCfps.map((cfp) => (
                    <li key={cfp.id} className="cfp-item">

                        <div className="cfp-card">
                            <div>
                                <h3>{cfp.title || "No Title"}</h3>
                                <p className="cfp-card-tag-paragraph">
                                    <strong>Tag:</strong>{" "}
                                    {editingId !== cfp.id ? (
                                        <>
                                        {(cfp.tags && cfp.tags.length > 0) ? cfp.tags.join(", ") : "-"}
                                        <button type="button" onClick={() => startEditTag(cfp)}>
                                            Edit
                                        </button>
                                        </>
                                    ) : (
                                        <input
                                        className="cfp-tag-edit"
                                        value={tagEdit}
                                        onChange={(e) => setTagEdit(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") saveEditTag(cfp);
                                            if (e.key === "Escape") cancelEditTag();
                                        }}
                                        autoFocus
                                        />
                                    )}
                                </p>
                            </div>
                            

                            <ul className="cfp-details">
                                <li><strong>Titel:</strong> {cfp.title}</li>
                                <li><strong>Deadline:</strong> {String(cfp.deadline)}</li>
                                <li><strong>Ort:</strong> {cfp.location}</li>
                                <li><strong>Konferenzdatum:</strong> {String(cfp.conferenceDate)}</li>
                                <li><strong>URL:</strong> {cfp.url}</li>
                                <li><strong>Einreichungsformular:</strong> {cfp.submissionForm}</li>
                                <li><strong>Wortlimit:</strong> {cfp.wordCharacterLimit}</li>
                            </ul>
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeftSideHome;