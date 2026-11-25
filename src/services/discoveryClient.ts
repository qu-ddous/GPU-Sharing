import type { DiscoveredServer } from '../types/index.js';

export async function scanForServers(): Promise<DiscoveredServer[]> {
  const discovered: DiscoveredServer[] = [];

  // 1. Try native UDP broadcast scan first (if running in Electron)
  if (window.electronAPI?.startDiscoveryScan) {
    try {
      const results = await window.electronAPI.startDiscoveryScan();
      if (results && results.length > 0) {
        return results;
      }
    } catch (e) {
      console.warn('Native UDP broadcast scan error:', e);
    }
  }

  // 2. Active Probe candidates (Localhost & common direct Cat6 Subnets)
  const candidateIps = [
    '127.0.0.1',
    '192.168.99.1',
    '192.168.1.1',
    '192.168.0.1'
  ];

  for (const ip of candidateIps) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 350);
      const res = await fetch(`http://${ip}:8000/api/v1/ping`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.pong) {
          discovered.push({
            hostname: ip === '127.0.0.1' ? 'Local Worker Daemon' : 'Direct LAN Worker Node',
            ip,
            port: 8000,
            gpu: 'Dedicated GPU Compute',
            protocol_version: 'v1.0.0'
          });
          break; // Found active server
        }
      }
    } catch {}
  }

  return discovered;
}
