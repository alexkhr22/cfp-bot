/**
 * Admin / DB Utility Service
 *
 * Enthält administrative Hilfsfunktionen für die Datenbank.
 * Aktuell: Reset/Leeren aller Tabellen für lokale Tests und Development.
 *
 * Funktionen:
 * - clearAllTables()  Löscht alle Datensätze aus allen Tabellen in FK-sicherer Reihenfolge
 *                    (erst Join-Tabellen, dann Haupttabellen).
 *
 * Hinweis:
 * - Diese Funktion setzt die Auto-Increment IDs NICHT zurück.
 * - Nur für Development/Tests gedacht (nicht in Production verwenden).
 */

import { prisma } from "../libs/prisma.js";

export async function clearAllTables() {
  await prisma.cFPKeywordGroup.deleteMany({});
  await prisma.userKeywordGroup.deleteMany({});
  await prisma.cFP.deleteMany({});
  await prisma.keywordGroup.deleteMany({});
  await prisma.user.deleteMany({});

  return { ok: true };
}