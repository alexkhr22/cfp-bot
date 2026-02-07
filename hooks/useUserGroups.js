import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/user-service";
import { getAllGroups } from "@/services/group-service";

export function useUserGroups(userId, refreshKey) {
  const [userGroups, setGroups] = useState([]);

  useEffect(() => {
    if (!userId) return;

    async function load() {
      const [users, allGroups] = await Promise.all([
        getAllUsers(),
        getAllGroups()
      ]);

      const user = users.find(u => String(u.id) === String(userId));

      const userGroups = (user?.groups ?? [])
        .map(link => allGroups.find(g => String(g.id) === String(link.groupId)))
        .filter(Boolean);

      setGroups(userGroups);
    }

    load();
  }, [userId, refreshKey]);

  return { userGroups };
}
