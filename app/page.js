"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import SideBar from "@/components/SideBar";
import LeftSideHome from "@/components/LeftSideHome";
import RightSideHome from "@/components/RightSideHome";
import NewGrp from "@/components/NewGrp";
import GroupsScreen from "@/components/GroupsScreen";
import { getAllUsers } from "@/services/user-service";


export default function Home() {
  const router = useRouter();

  const [screen, setScreen] = useState("home");
  const [groups, setGroups] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
        goToUser={() => router.push("/user")}  
      />

      {screen === "home" && (
        <>
          <LeftSideHome
            goToNewGrp={() => setScreen("newgrp")}
            goToGroups={() => setScreen("groups")}
            selectedUser={selectedUser}
            reloadUser={() => loadUser(selectedUser.id)}
          />
          <RightSideHome
            goToNewGrp={() => setScreen("newgrp")}
            goToGroups={() => setScreen("groups")}
          />
        </>
      )}

      {screen === "newgrp" && (
        <NewGrp
          goToHome={() => setScreen("home")}
          goToGroups={() => setScreen("groups")}
          addGroup={addGroup}
        />
      )}

      {screen === "groups" && (
        <GroupsScreen
          goToHome={() => setScreen("home")}
          goToNewGrp={() => setScreen("newgrp")}
        />
      )}
    </>
  );
}
