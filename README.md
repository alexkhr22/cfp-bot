# CFP Bot – Setup & Deployment Guide

This guide explains step by step how to set up and run the **CFP Bot** and its **WebApp** on a server.

> ⚠️ These steps were tested on a Hetzner server.

---

## Server specifications on which the bot and the web app were tested 

- **Provider:** Hetzner (tested)
- **Operating System:** Ubuntu 24.04
- **Architecture:** x86 (Intel/AMD)
- **Server Type:** CX33  
  - vCPU: 4  
  - RAM: 8GB  
  - SSD: 80GB  
  - Traffic: 20TB  

---

# 1️⃣ Copy Project into Server

Update system packages and install required dependencies:

```bash
sudo apt update
sudo apt install git -y

sudo apt update
sudo apt install python3 python3-pip -y
```

Clone the repository:

```bash
git clone https://github.com/alexkhr22/cfp-bot.git
cd cfp-bot
```

---

# 2️⃣ Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
nano .env
```

---

## WebApp & Database Configuration

Set the database URL and port.

Replace `db` with your server IP if you want the database to be publicly accessible and adjust `docker-compose.yml` accordingly under `DATABASE_URL`, if intended.

- `APP_URL` defines the address under which the WebApp is accessible.
- `PORT` defines the internal server port.

```env
DATABASE_URL="postgresql://cfp_user:strongpassword@db:5432/cfp_bot"
APP_URL="http://localhost:3000"
PORT=3000
```

---

## API Configuration

If you are using a regular OpenAI API Key, leave `CHAT_AI_API_KEY` blank.  
Otherwise, do the opposite.

The logic for detecting which API key is used is implemented in `openai_client.py`.  
The code automatically detects which key is provided. No further configuration is required beyond setting one of the keys.

You may define a model for scraping or use default values.

```env
OPENAI_API_KEY=""
CHAT_AI_API_KEY="sk-proj-xxx"
LLM_Model="gpt-4o"
```

---

## Scraping Configuration

- `MAX_DEPTH` defines how many levels of subpages are scraped.
- `LINKS_PER_LEVEL` defines how many links per subpage are scraped.
- The system user always has ID = 1.

```env
MAX_DEPTH=5
LINKS_PER_LEVEL=50
TIMEOUT_PER_PAGE=30
SYSTEM_USER_ID=1
```

---

# 3️⃣ Run WebApp and Database (Docker)

Make the install script executable and run it:

```bash
chmod +x install-app.sh
./install-app.sh
```

---

# 4️⃣ Setup Scraper

Create and activate a Python virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
sudo apt update
```

Install required Python dependencies:

```bash
pip install crawl4ai
pip install presidio-analyzer
pip install presidio-anonymizer
pip install python-dateutil
playwright install
pip install python-dotenv
```

Load environment variables:

```bash
export $(grep -v '^#' .env | xargs)
```

Initialize the database with the first CFP entries:

```bash
python run_scraper.py
```

Afterwards, you can create a user with `SYSTEM` inside the WebApp to later adjust the list of URLs to be scraped.

---

# 5️⃣ Set Cronjobs for Scraping & Cleanups

Make the scripts executable:

```bash
chmod +x setup-cron.sh
chmod +x del-all-cron.sh
```

Setup cronjobs:

```bash
./setup-cron.sh
```

If you want to delete all cronjobs:

```bash
./del-all-cron.sh
```

---

# 6️⃣ Logs

All scraping operations are logged.

Logs can be found at:

```
CFP-BOT/scraper/logs
```

---

# Legal & Ethical Considerations

- This bot scrapes only relevant CFP data from websites and structures them inside a WebApp.
- All scraped data should be verified manually, as parsing via LLMs does not guarantee 100% correctness.
- The bot respects the `robots.txt` file of scraped websites.
- Personally identifiable data is anonymized before scraped content is sent to an LLM for parsing.
- It is the responsibility of the user to comply with website terms of service and not to exceed legal or ethical boundaries.

---