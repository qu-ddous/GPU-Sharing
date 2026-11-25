import { ipcMain } from 'electron';
import dgram from 'dgram';
import type { DiscoveredServer } from '../../src/types/index.js';

export function setupDiscovery() {
  ipcMain.handle('start-discovery-scan', async (): Promise<DiscoveredServer[]> => {
    return new Promise((resolve) => {
      const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
      const servers: DiscoveredServer[] = [];
      const DISCOVERY_PORT = 8002;
      const BROADCAST_ADDR = '255.255.255.255';
      const REQUEST_PACKET = Buffer.from('GPU_RENDER_DISCOVER_REQ_V1');

      socket.on('error', (err) => {
        console.error('UDP Discovery socket error:', err);
        try { socket.close(); } catch {}
        resolve(servers);
      });

      socket.on('message', (msg, rinfo) => {
        const text = msg.toString('utf-8');
        if (text.startsWith('GPU_RENDER_DISCOVER_RESP_V1:')) {
          try {
            const rawJson = text.substring('GPU_RENDER_DISCOVER_RESP_V1:'.length);
            const data = JSON.parse(rawJson);
            const entry: DiscoveredServer = {
              hostname: data.hostname || 'GPU Worker',
              ip: data.ip || rinfo.address,
              port: data.port || 8000,
              gpu: data.gpu || 'NVIDIA RTX Compute',
              protocol_version: data.protocol_version || 'v1.0.0'
            };
            if (!servers.some(s => s.ip === entry.ip && s.port === entry.port)) {
              servers.push(entry);
            }
          } catch (e) {
            console.error('Failed to parse discovery response:', e);
          }
        }
      });

      socket.bind(0, () => {
        try {
          socket.setBroadcast(true);
          socket.send(REQUEST_PACKET, DISCOVERY_PORT, BROADCAST_ADDR, (err) => {
            if (err) console.error('UDP broadcast send error:', err);
          });
        } catch (e) {
          console.error('Failed to send UDP discovery broadcast:', e);
        }
      });

      // Listen for 1.5 seconds for responses
      setTimeout(() => {
        try { socket.close(); } catch {}
        resolve(servers);
      }, 1500);
    });
  });
}
