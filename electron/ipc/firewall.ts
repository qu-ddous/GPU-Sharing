import { ipcMain } from 'electron';
import { exec } from 'child_process';

export function setupFirewall() {
  ipcMain.handle('unblock-firewall', async (_event, port = 8000): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      if (process.platform !== 'win32') {
        return resolve({ success: true, message: 'Non-Windows OS: No Windows Firewall action needed.' });
      }

      const cmd = `powershell -Command "Start-Process netsh -ArgumentList 'advfirewall firewall add rule name=\\\"GPUShare_Server\\\" dir=in action=allow protocol=TCP localport=${port}' -Verb RunAs"`;

      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          return resolve({
            success: false,
            message: `Firewall elevation rejected or failed: ${error.message}`
          });
        }
        resolve({
          success: true,
          message: `Windows Firewall rule successfully configured for Port ${port}.`
        });
      });
    });
  });
}
