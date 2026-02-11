"use client";

import config from "@/config";
import { useState } from "react";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { createEvents } from "ics";

const RightSideHome = ({cfps}) =>{
    const localizer = momentLocalizer(moment);

    function isValidDate(value) {
        const d = new Date(value);
        return value && value !== "n/a" && !isNaN(d.getTime());
    }
    function exportToICS(events) {
        const icsEvents = events.map(ev => {
            const start = new Date(ev.start);
            const end = new Date(ev.end);

            return {
            title: ev.title,
            start: [
                start.getFullYear(),
                start.getMonth() + 1,
                start.getDate(),
                start.getHours(),
                start.getMinutes(),
            ],
            end: [
                end.getFullYear(),
                end.getMonth() + 1,
                end.getDate(),
                end.getHours(),
                end.getMinutes(),
            ],
            description: ev.description || "",
            location: ev.location || "",
            };
        });

        createEvents(icsEvents, (error, value) => {
            if (error) {
                console.error("ICS error:", error);
                console.log("Bad ICS events:", icsEvents);
                return;
            }

            const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "calendar.ics";
            a.click();

            URL.revokeObjectURL(url);
        });
    }

    

    const deadlineEvents = cfps
        .filter(cfp => isValidDate(cfp.deadline))
        .map(cfp => {
            const start = new Date(cfp.deadline);
            const end = new Date(start.getTime() + 60 * 60 * 1000);
            return {
            title: cfp.title + " Einreichungs Deadline",
            start,
            end,
            location: cfp.location,
            description: cfp.url,
            };
    });


    const conferenceDateEvents = cfps
        .filter(cfp => isValidDate(cfp.conferenceDate))
        .map(cfp => {
            const start = new Date(cfp.conferenceDate);
            const end = new Date(start.getTime() + 60 * 60 * 1000);
            return {
            title: cfp.title + " Konferenzdatum",
            start,
            end,
            location: cfp.location,
            description: cfp.url,
        };
    });



    const events = [
        ...deadlineEvents,
        ...conferenceDateEvents,
    ];

    return (
        <div className="rechteck-rightside">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                popup
                style={{height: "80%", fontSize: "14px"}}
            />
            <button onClick={() => exportToICS(events)}>Export</button>
        </div>
        
    );
};

export default RightSideHome;