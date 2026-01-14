/**
 * Prisma Funktions-Tests – implementiert deine Bild-Funktionen als JS-Funktionen
 * und führt sie nacheinander aus.
 *
 * Run:
 *   node scripts/prisma-test.js
 */

import { prisma } from "../libs/prisma.js";
import { createUser, addUserTag, getAllUsers, deleteUser, removeUserTag } from "../services/user-service.js";
import { createGroup, userJoinGroup, getAllGroupConnectedCfP, getAllGroups, deleteGroup, userLeaveGroup } from "../services/group-service.js";
import { createCFP, updateCfPTag, getUserCfPs } from "../services/cfp-service.js";
import { clearAllTables } from "../services/admin-service.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// -------------------------
// Test Runner
// -------------------------

async function main() {
  console.log("🧪 Starte Prisma Funktions-Tests...");

  // Health
  await prisma.$queryRaw`SELECT 1`;

  // GetAllUsers
  const users0 = await getAllUsers();
  assert(Array.isArray(users0), "GetAllUsers muss Array liefern");
  users0.forEach((u) => {
    console.log("User:", u.id, u.name);
  });

  
  // CreateUser
  const user = await createUser({ name: "Test User" });
  assert(user.id, "User ID fehlt");
  console.log("✅ CreateUser:", user.id);

  console.log("DEBUG user:", user);
  // AddUserTag
  const u1 = await addUserTag(user.id, "ai");
  assert(u1.tags.includes("ai"), "Tag ai wurde nicht hinzugefügt");
  console.log("✅ AddUserTag");

  // RemoveUserTag
  const u2 = await removeUserTag(user.id, "ai");
  assert(!u2.tags.includes("ai"), "Tag ai wurde nicht entfernt");
  console.log("✅ RemoveUserTag");

  // CreateGroup
  const group = await createGroup({ name: "AI Conferences", keywords: ["ai", "ml", "nlp"] });
  assert(group.id, "Group ID fehlt");
  console.log("✅ CreateGroup:", group.id);

  // UserJoinGroup
  await userJoinGroup(user.id, group.id);
  const membership = await prisma.userKeywordGroup.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: group.id } },
  });
  assert(membership, "UserJoinGroup fehlgeschlagen");
  console.log("✅ UserJoinGroup");

  // UserLeaveGroup
  await userLeaveGroup(user.id, group.id);
  const membership2 = await prisma.userKeywordGroup.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: group.id } },
  });
  assert(!membership2, "UserLeaveGroup fehlgeschlagen");
  console.log("✅ UserLeaveGroup");

  // Join wieder (für CFP-Link)
  await userJoinGroup(user.id, group.id);

  // CreateCFP
  const cfp = await createCFP({
    userId: user.id,
    title: "ICML 2026",
    deadline: "2026-01-10T00:00:00Z",
    location: "Ungedanken City",
    conferenceDate: "2026-06-01T00:00:00Z",
    url: "https://icml.cc",
    callback: "2026-02-01T00:00:00Z",
    submissionForm: "OPENREVIEW",
    wordCharacterLimit: 20000,
    tag: "ml",
    groupIds: [group.id],
  });
  assert(cfp.id, "CFP ID fehlt");
  assert(cfp.groups.length === 1, "CFP sollte 1 Gruppe haben");
  console.log("✅ CreateCFP:", cfp.id);

  // UpdateCFPTag
  const cfp2 = await updateCfPTag(cfp.id, "important");
  assert(cfp2.tag === "important", "UpdateCFPTag fehlgeschlagen");
  console.log("✅ UpdateCFPTag");

  // GetUserCFPs
  const userCfps = await getUserCfPs(user.id);
  assert(userCfps.length >= 1, "GetUserCFPs sollte >=1 CFP liefern");
  console.log("✅ GetUserCFPs");
  userCfps.forEach((c) => { console.log(" - CFP:", c.id, c.title); });

  // GetAllGroupConnectedCfP
  const groupCfps = await getAllGroupConnectedCfP(group.id);
  assert(groupCfps.some((x) => x.id === cfp.id), "Group sollte CFP enthalten");
  console.log("✅ GetAllGroupConnectedCfP");

  // Cleanup (optional, aber empfehlenswert)
  await deleteGroup(group.id);
  await deleteUser(user.id);

  console.log("🎉 Alle Funktions-Tests erfolgreich (inkl. Cleanup).");

  await clearAllTables();
  console.log("✅ Alle Tabellen geleert (inkl. RESTART IDENTITY).");

} 

main()
  .catch((e) => {
    console.error("❌ Tests fehlgeschlagen:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
