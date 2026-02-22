#!/bin/bash

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON_PATH="$PROJECT_DIR/venv/bin/python"
SCRAPER_SCRIPT="$PROJECT_DIR/run_scraper.py"
LOG_DIR="$PROJECT_DIR/scraper/logs"
CRON_LOG="$PROJECT_DIR/cron.log"

echo "=== CFP Cron Setup ==="

add_job() {
  local NAME="$1"
  local COMMAND="$2"

  echo ""
  echo "Configuration for: $NAME"
  read -p "Enable? (y/n): " ENABLE

  if [ "$ENABLE" != "y" ]; then
    echo "Skipped."
    return
  fi

  echo ""
  echo "Select interval:"
  echo "1) daily"
  echo "2) weekly"
  echo "3) monthly"
  read -p "Choice (1-3): " MODE

  case $MODE in
    1)
      read -p "Hour (0-23): " HOUR
      read -p "Minute (0-59): " MINUTE
      CRON_TIME="$MINUTE $HOUR * * *"
      ;;
    2)
      echo "Weekday (0=Sun ... 6=Sat)"
      read -p "Day (0-6): " DAY
      read -p "Hour (0-23): " HOUR
      read -p "Minute (0-59): " MINUTE
      CRON_TIME="$MINUTE $HOUR * * $DAY"
      ;;
    3)
      read -p "Day of month (1-31): " DAY
      read -p "Hour (0-23): " HOUR
      read -p "Minute (0-59): " MINUTE
      CRON_TIME="$MINUTE $HOUR $DAY * *"
      ;;
    *)
      echo "Invalid selection."
      return
      ;;
  esac

  CRON_CMD="$CRON_TIME cd $PROJECT_DIR && $COMMAND >> $CRON_LOG 2>&1"

  # Remove existing identical job
  (crontab -l 2>/dev/null | grep -v "$COMMAND") | crontab -

  # Add new job
  (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

  echo "✅ $NAME cron job configured."
}

# 1️⃣ Scraper
add_job "Scraper (Python)" "$PYTHON_PATH $SCRAPER_SCRIPT"

# 2️⃣ CleanupExpiredCfps (Docker Node)
add_job "CleanupExpiredCfps (Docker Node)" \
"docker compose exec -T web node scripts/cleanupExpiredCfps.js"

# 3️⃣ Log Cleanup
add_job "Scraper Log Cleanup" \
"rm -rf $LOG_DIR/*"

echo ""
echo "Current cron jobs:"
crontab -l