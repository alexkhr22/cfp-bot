#!/bin/bash

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON_PATH="$PROJECT_DIR/venv/bin/python"
SCRAPER_PATH="$PROJECT_DIR/run_scraper.py"
CLEANUP_PATH="$PROJECT_DIR/scripts/cleanupExpiredCfps.js"
LOG_PATH="$PROJECT_DIR/cron.log"

echo "=== CFP Cron Setup ==="

add_job() {
  local NAME=$1
  local COMMAND=$2

  echo ""
  echo "Konfiguration für: $NAME"
  read -p "Aktivieren? (y/n): " ENABLE

  if [ "$ENABLE" != "y" ]; then
    echo "Übersprungen."
    return
  fi

  echo "Wochentag wählen (0=So ... 6=Sa)"
  read -p "Tag (0-6): " DAY
  read -p "Stunde (0-23): " HOUR
  read -p "Minute (0-59): " MINUTE

  CRON_CMD="$MINUTE $HOUR * * $DAY cd $PROJECT_DIR && $COMMAND >> $LOG_PATH 2>&1"

  # bestehenden gleichen Job entfernen
  (crontab -l 2>/dev/null | grep -v "$COMMAND") | crontab -

  # neuen Job hinzufügen
  (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

  echo "✅ $NAME Cronjob gesetzt."
}

# Scraper Job
add_job "Scraper (Python)" "$PYTHON_PATH $SCRAPER_PATH"

# Cleanup Job (Node im Docker Container)
add_job "CleanupExpiredCfps (Docker Node)" \
"docker compose exec -T web node scripts/cleanupExpiredCfps.js"

echo ""
echo "Aktuelle Cronjobs:"
crontab -l