import time
from typing import Dict, Any, List

class ConnectionTracker:
    def __init__(self):
        self.clients: Dict[str, Dict[str, Any]] = {}

    def record_client(self, client_ip: str, port: int = 50000):
        if client_ip not in self.clients:
            self.clients[client_ip] = {
                "ip": client_ip,
                "port": port,
                "connected_at": time.time(),
                "last_seen": time.time(),
                "bytes_rx": 0,
                "bytes_tx": 0,
                "status": "Active"
            }
        else:
            self.clients[client_ip]["last_seen"] = time.time()
            self.clients[client_ip]["status"] = "Active"

    def record_transfer(self, client_ip: str, rx_bytes: int = 0, tx_bytes: int = 0):
        if client_ip in self.clients:
            self.clients[client_ip]["bytes_rx"] += rx_bytes
            self.clients[client_ip]["bytes_tx"] += tx_bytes

    def get_active_sessions(self) -> List[Dict[str, Any]]:
        now = time.time()
        sessions = []
        for ip, data in self.clients.items():
            dur_mins = int((now - data["connected_at"]) // 60)
            dur_secs = int((now - data["connected_at"]) % 60)
            sessions.append({
                "ip": ip,
                "port": data["port"],
                "duration": f"{dur_mins:02d}m {dur_secs:02d}s",
                "latency": "0.8 ms",
                "bytesReceived": f"{round(data['bytes_rx'] / (1024**2), 1)} MB",
                "bytesSent": f"{round(data['bytes_tx'] / (1024**2), 1)} MB",
                "status": "Active" if (now - data["last_seen"] < 30) else "Idle"
            })
        return sessions

connection_tracker = ConnectionTracker()
# Seed with default client connection for UI showcase
connection_tracker.record_client("192.168.99.2", 52140)
connection_tracker.record_transfer("192.168.99.2", rx_bytes=3586129920, tx_bytes=1981808640)
