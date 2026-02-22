#!/bin/bash

echo "=== Delete All Cron Jobs ==="
echo ""
echo "⚠️  All cron jobs for this user will be permanently deleted."
echo ""

read -p "Proceed? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "Aborted."
  exit 0
fi

if crontab -l >/dev/null 2>&1; then
  crontab -r
  echo "✅ All cron jobs have been removed."
else
  echo "ℹ️  No cron jobs found."
fi