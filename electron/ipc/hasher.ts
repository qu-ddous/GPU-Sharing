import { ipcMain } from 'electron';
import fs from 'fs';
import crypto from 'crypto';

export function setupHasher() {
  ipcMain.handle('compute-file-sha256', async (_event, filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          return reject(new Error(`File not found: ${filePath}`));
        }
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath, { highWaterMark: 1024 * 1024 }); // 1MB chunks

        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', (err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  });
}
