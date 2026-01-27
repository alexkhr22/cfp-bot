"use client";

import UserScreen from "@/components/UserScreen";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();

  const handleSelectUser = (user) => {
    localStorage.setItem("selectedUser", JSON.stringify(user));
    router.push("/");
  };

  return <UserScreen onSelectUser={handleSelectUser} />;
}

