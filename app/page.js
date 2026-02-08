"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import SideBar from "@/components/SideBar";
import LeftSideHome from "@/components/LeftSideHome";
import RightSideHome from "@/components/RightSideHome";
import NewGrp from "@/components/NewGrp";
import GroupsScreen from "@/components/GroupsScreen";
import { getAllUsers } from "@/services/user-service";
import { redirect } from "next/navigation";


export default function Home() {
  const router = useRouter();

  const [screen, setScreen] = useState("home");
  const [groups, setGroups] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey(k => k + 1);
  const [cfps, setCfps] = useState([]);

  const loadUser = async (id) => {
    const allUsers = await getAllUsers();

    const freshUser = allUsers.find(u => u.id === id); 

    if (!freshUser) return;

    setSelectedUser(freshUser);
    localStorage.setItem("selectedUser", JSON.stringify(freshUser));
  };


  useEffect(() => {
    const raw = localStorage.getItem("selectedUser");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    loadUser(parsed.id);   
  }, []);


  const addGroup = (groupName, keywords) => {
    setGroups((prev) => [...prev, { name: groupName, keywords }]);
  };

  return (
    <>
      <SideBar
        screen={screen}
        setScreen={setScreen}
        selectedUser={selectedUser}
        refreshKey = {refreshKey}
        onGroupsChanged={refresh}
        goToUser={() => router.push("/user")}  
        reloadUser={() => loadUser(selectedUser.id)}
      />

      {screen === "home" && (
        <>
          <LeftSideHome
            goToNewGrp={() => setScreen("newgrp")}
            goToGroups={() => setScreen("groups")}
            selectedUser={selectedUser}
            reloadUser={() => loadUser(selectedUser.id)}
            cfps={cfps}
            setCfps={setCfps}
            onCfpChanged={refresh}
            refreshKey={refreshKey}
          />
          <RightSideHome
            goToNewGrp={() => setScreen("newgrp")}
            goToGroups={() => setScreen("groups")}
            cfps={cfps}
          />
        </>
      )}

      {screen === "newgrp" && (
        <NewGrp
          goToHome={() => setScreen("home")}
          goToGroups={() => setScreen("groups")}
          addGroup={addGroup}
          onCreated = {refresh}
          selectedUser={selectedUser}
        />
      )}

      {screen === "groups" && (
        <GroupsScreen
          goToHome={() => setScreen("home")}
          goToNewGrp={() => setScreen("newgrp")}
          selectedUser={selectedUser}
          refreshKey = {refreshKey}
          onGroupsChanged={refresh}
        />
      )}
    </>
  );
}
