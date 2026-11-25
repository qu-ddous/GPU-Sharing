import { ipcMain, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function setupArchiver(): void {
  ipcMain.handle('compress-folder', async (_event, folderPath: string, customDestZip?: string) => {
    try {
      if (!fs.existsSync(folderPath)) {
        throw new Error(`Directory does not exist: ${folderPath}`);
      }

      const folderName = path.basename(folderPath) || 'workspace';
      const destZip = customDestZip || path.join(app.getPath('temp'), `${folderName}_${Date.now()}.zip`);

      // Ensure dest folder exists
      const destDir = path.dirname(destZip);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      if (fs.existsSync(destZip)) {
        fs.unlinkSync(destZip);
      }

      // Windows PowerShell Compress-Archive excluding node_modules, .git, __pycache__
      const psCommand = `powershell.exe -NoProfile -NonInteractive -Command "$folder = '${folderPath.replace(/'/g, "''")}'; $dest = '${destZip.replace(/'/g, "''")}'; $files = Get-ChildItem -LiteralPath $folder | Where-Object { $_.Name -notin @('.git','node_modules','__pycache__','.venv','dist','dist-electron','.idea') } | ForEach-Object { $_.FullName }; Compress-Archive -LiteralPath $files -DestinationPath $dest -Force"`;

      await execAsync(psCommand, { maxBuffer: 1024 * 1024 * 16 });

      if (!fs.existsSync(destZip)) {
        throw new Error('Archive generation failed: destination file was not created');
      }

      const stats = fs.statSync(destZip);
      return {
        success: true,
        zipPath: destZip,
        sizeBytes: stats.size,
        sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
      };
    } catch (err: any) {
      console.error('Archive compression error:', err);
      return {
        success: false,
        error: err.message || 'Failed to compress folder'
      };
    }
  });
}
