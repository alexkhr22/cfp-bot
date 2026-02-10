import { spawn } from 'child_process';
import path from 'path';

export const runPythonScraper = () => {
  return new Promise((resolve, reject) => {
    // Pfad zur crawl.py im scraper-Ordner
    const pythonScript = path.join(process.cwd(), 'scraper', 'crawl.py');
    
    // Starte den Python-Prozess
    const pythonProcess = spawn('python', [pythonScript]);

    let dataString = '';

    // Sammle die Daten, die Python per 'print' ausgibt
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Scraper beendet mit Code ${code}`);
        return;
      }
      try {
        const results = JSON.parse(dataString);
        resolve(results);
      } catch (e) {
        reject("Fehler beim Parsen der Scraper-Ergebnisse");
      }
    });
  });
};