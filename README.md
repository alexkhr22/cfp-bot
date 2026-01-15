# ======================================================
# CFP-BOT – KOMPLETTER SETUP-GUIDE (BACKEND + DOCKER)
# Alle Schritte in der richtigen Reihenfolge
# ======================================================

# 0) Voraussetzungen (vorher installieren)
# - Git (Git SCM): https://git-scm.com/downloads
# - Node.js (LTS >= 18): https://nodejs.org
# - Docker Desktop: https://www.docker.com/products/docker-desktop
# Docker Desktop MUSS laufen!

# ------------------------------------------------------
# 1) Projekt klonen
# ------------------------------------------------------
git clone <REPO_URL>
cd cfp-bot

# ------------------------------------------------------
# 2) Node-Abhängigkeiten installieren
# ------------------------------------------------------
npm install

# ------------------------------------------------------
# 3) Prisma installieren (ORM für die Datenbank)
# ------------------------------------------------------
npm install prisma @prisma/client

# (Optional) Prüfen, ob Prisma korrekt installiert ist
npx prisma --version

# ------------------------------------------------------
# 4) PostgreSQL-Datenbank mit Docker starten
# (docker-compose.yml muss im Projekt-Root liegen)
# ------------------------------------------------------
docker compose up -d

# Prüfen, ob der Container läuft
docker ps

# ------------------------------------------------------
# 5) Environment-Datei anlegen / prüfen
# Datei: .env (im Projekt-Root)
# ------------------------------------------------------
# Inhalt der .env:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cfp_bot"

# WICHTIG:
# - Wenn .env geändert wurde: Terminal schließen & neu öffnen

# ------------------------------------------------------
# 6) Prisma-Migration ausführen (Tabellen anlegen)
# ------------------------------------------------------
npx prisma migrate dev --name init

# Optional: Datenbank im Browser ansehen
npx prisma studio

# ------------------------------------------------------
# 7) Backend starten
# ------------------------------------------------------
npm run dev

# Backend läuft jetzt unter:
# http://localhost:3000
# Beispiel-Endpunkte:
# http://localhost:3000/api/users
# http://localhost:3000/api/groups

# ======================================================
# DOCKER STOPPEN / BEENDEN
# ======================================================

# A) Docker stoppen, Daten behalten (empfohlen)
docker compose down

# B) Docker stoppen UND Daten löschen (Reset – Vorsicht!)
docker compose down -v

# ------------------------------------------------------
# Docker-Status prüfen
# ------------------------------------------------------
docker ps        # laufende Container
docker ps -a     # alle Container (auch gestoppte)
# ======================================================
