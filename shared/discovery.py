import socket
import json
import psutil
import time

DISCOVERY_PORT = 8002
BROADCAST_ADDR = "255.255.255.255"
REQUEST_PACKET = b"GPU_RENDER_DISCOVER_REQ_V1"

def get_best_p2p_ip() -> str:
    """Detects direct cable / APIPA / LAN adapter IP in priority order"""
    best_ip = "127.0.0.1"
    try:
        interfaces = psutil.net_if_addrs()
        # Priority 1: APIPA 169.254.x.x
        for iface, addrs in interfaces.items():
            for addr in addrs:
                if addr.family == socket.AF_INET and addr.address.startswith("169.254."):
                    return addr.address

        # Priority 2: Static P2P 192.168.99.x
        for iface, addrs in interfaces.items():
            for addr in addrs:
                if addr.family == socket.AF_INET and addr.address.startswith("192.168.99."):
                    return addr.address

        # Priority 3: Local Private LAN
        for iface, addrs in interfaces.items():
            for addr in addrs:
                if addr.family == socket.AF_INET and not addr.address.startswith("127."):
                    best_ip = addr.address
    except Exception:
        pass
    return best_ip

def run_udp_discovery_responder(port: int = 8000, stop_event=None):
    """Listens on UDP Port 8002 and announces server node details to scanning clients"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind(("", DISCOVERY_PORT))
        sock.settimeout(1.0)
    except Exception as e:
        print(f"[Discovery] Could not bind port {DISCOVERY_PORT}: {e}")
        return

    print(f"[Discovery] UDP broadcast responder listening on port {DISCOVERY_PORT}...")

    while stop_event is None or not stop_event.is_set():
        try:
            data, addr = sock.recvfrom(1024)
            if data == REQUEST_PACKET:
                ip = get_best_p2p_ip()
                payload = {
                    "hostname": socket.gethostname(),
                    "port": port,
                    "gpu": "NVIDIA GeForce RTX 3060",
                    "ip": ip,
                    "protocol_version": "v1.0.0"
                }
                resp = f"GPU_RENDER_DISCOVER_RESP_V1:{json.dumps(payload)}".encode("utf-8")
                sock.sendto(resp, addr)
        except socket.timeout:
            continue
        except Exception as e:
            if stop_event and stop_event.is_set():
                break
    try:
        sock.close()
    except Exception:
        pass

if __name__ == "__main__":
    run_udp_discovery_responder()
