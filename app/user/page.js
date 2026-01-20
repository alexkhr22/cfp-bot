"use client";

import UserScreen from "@/components/UserScreen";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();

  return (
    <UserScreen goBack={() => router.push("/")} />
  );
}
