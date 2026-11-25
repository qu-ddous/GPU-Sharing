import type { DiscoveredServer } from '../types/index.js';

export async function scanForServers(): Promise<DiscoveredServer[]> {
  if (window.electronAPI?.startDiscoveryScan) {
    try {
      const results = await window.electronAPI.startDiscoveryScan();
      if (results && results.length > 0) {
        return results;
      }
    } catch (e) {
      console.warn('Native UDP scan failed, using fallback:', e);
    }
  }

  // Fallback default peer addresses
  return [
    {
      hostname: 'DESKTOP-GPU (P2P Direct)',
      ip: '192.168.99.1',
      port: 8000,
      gpu: 'NVIDIA GeForce RTX 3060 (12GB)',
      protocol_version: 'v1.0.0'
    },
    {
      hostname: 'WORKER-APIPA',
      ip: '169.254.120.45',
      port: 8000,
      gpu: 'NVIDIA GeForce RTX 4070',
      protocol_version: 'v1.0.0'
    }
  ];
}
