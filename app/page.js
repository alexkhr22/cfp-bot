"use client";
import { Suspense } from 'react';
import { useState } from "react";
import SideBar from "@/components/SideBar";
import LeftSideHome from "@/components/LeftSideHome";
import RightSideHome from "@/components/RightSideHome";
import NewGrp from '@/components/NewGrp';

export default function Home() {
  const [screen, setScreen] = useState("home");
  const [groups, setGroups] = useState([]);

  const addGroup = (groupName, keywords) => {
    setGroups(prev => [
      ...prev,
      { name: groupName, keywords }
    ]);
  };


  return (
    <>
      <SideBar
       screen={screen}
       setScreen={setScreen}
       groups = {groups} />

      {screen === "home" && (
        <>
          <LeftSideHome goToNewGrp={() => setScreen("newgrp")} />
          <RightSideHome goToNewGrp={() => setScreen("newgrp")} />
        </>
      )}

      {screen === "newgrp" && (
        <NewGrp
         goToHome={() => setScreen("home")}
         addGroup = {addGroup}
        />
      )}
    </>
  );
}