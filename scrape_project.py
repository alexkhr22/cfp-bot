import json
from pathlib import Path

# ============================
# ⚙️ BASIS-KONFIG
# ============================

ROOT_DIR = Path(__file__).resolve().parent
OUTPUT_FILE = ROOT_DIR / "scraped_project.json"

# Ordner, die mit sehr hoher Wahrscheinlichkeit NICHT dein Code sind
EXCLUDED_DIRS = {
    "node_modules",
    ".git",
    "__pycache__",
    "venv",
    ".venv",
    "env",
    "dist",
    "build",
    ".next",
    ".cache",
    ".idea",
    ".vscode",
    "coverage",
    "vendor"
}

# Einzelne Dateien, die man praktisch nie scrapen will
EXCLUDED_FILES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "poetry.lock",
    "Pipfile.lock",
    ".DS_Store", 
    "package.json", 
    "jsconfig.json", 
    ".eslintrc.json"
}

# Max. Dateigröße in KB (0 = unbegrenzt)
MAX_FILE_SIZE_KB = 512

# ============================
# 🧩 DATEIENDUNGEN
# ============================
# None  → alle Textdateien
# Set   → nur diese Endungen (z. B. {".py", ".js"})
# ALLOWED_EXTENSIONS = None
# Beispiele:
ALLOWED_EXTENSIONS = {".py", ".json"}
# ALLOWED_EXTENSIONS = {".json", ".yaml", ".yml", ".md"}

# ============================
# 🔍 FILTER
# ============================

def is_excluded(path: Path) -> bool:
    if path.name in EXCLUDED_FILES:
        return True

    for part in path.parts:
        if part in EXCLUDED_DIRS:
            return True

    return False


def is_too_large(path: Path) -> bool:
    if MAX_FILE_SIZE_KB <= 0:
        return False
    return path.stat().st_size > MAX_FILE_SIZE_KB * 1024


def is_allowed_extension(path: Path) -> bool:
    if ALLOWED_EXTENSIONS is None:
        return True
    return path.suffix.lower() in ALLOWED_EXTENSIONS


# ============================
# 📦 SAMMELN
# ============================

def collect_project_files(root: Path) -> dict:
    collected = {}

    for file_path in root.rglob("*"):
        if not file_path.is_file():
            continue

        if not is_allowed_extension(file_path):
            continue

        if is_excluded(file_path):
            continue

        if is_too_large(file_path):
            continue

        try:
            content = file_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            try:
                content = file_path.read_text(encoding="latin-1")
            except Exception:
                # Binär oder kaputt → überspringen
                continue

        relative_path = str(file_path.relative_to(root))
        collected[relative_path] = content

    return collected


# ============================
# 🚀 MAIN
# ============================

def main():
    print("🔍 Scrape gesamtes Projekt (nur eigener Content)…")

    project_files = collect_project_files(ROOT_DIR)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(project_files, f, indent=2, ensure_ascii=False)

    print(f"✅ Fertig: {len(project_files)} Dateien → {OUTPUT_FILE.name}")


if __name__ == "__main__":
    main()
