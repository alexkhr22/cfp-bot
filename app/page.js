import { Suspense } from 'react'
import SideBar from "@/components/SideBar";
import LeftSideHome from "@/components/LeftSideHome";
import RightSideHome from "@/components/RightSideHome";

export default function Home() {
  return (
    <>
      <SideBar />
      <LeftSideHome />
      <RightSideHome />
    </>
  );
}