import type { DiscoveredServer } from '../types/index.js';

export async function scanForServers(): Promise<DiscoveredServer[]> {
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

  // 2. Parallel Active Probe across cached IP + Localhost + common Cat6 subnets (300ms max)
  const cachedIp = localStorage.getItem('gpushare_last_ip');
  const candidateIps = Array.from(
    new Set([
      ...(cachedIp ? [cachedIp] : []),
      '127.0.0.1',
      '192.168.99.1',
      '192.168.1.1',
      '192.168.0.1'
    ])
  );

  const probe = async (ip: string): Promise<DiscoveredServer | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300);
      const res = await fetch(`http://${ip}:8000/api/v1/ping`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.pong) {
          return {
            hostname: ip === '127.0.0.1' ? 'Local Worker Daemon' : 'Direct LAN Worker Node',
            ip,
            port: 8000,
            gpu: 'Dedicated GPU Compute',
            protocol_version: 'v1.0.0'
          };
        }
      }
    } catch {}
    return null;
  };

  const results = await Promise.all(candidateIps.map(probe));
  return results.filter((r): r is DiscoveredServer => r !== null);
}
