from pydantic import BaseModel
import os
from pathlib import Path

class ServerSettings(BaseModel):
    app_name: str = "GPUShare High-Performance Daemon"
    version: str = "1.0.0"
    host: str = "0.0.0.0"
    port: int = 8000
    udp_discovery_port: int = 8002
    storage_path: Path = Path(os.environ.get("GPUSHARE_STORAGE", "C:/GPUShare/Storage"))
    temp_path: Path = Path(os.environ.get("GPUSHARE_TEMP", "C:/GPUShare/Temp"))
    api_token: str = os.environ.get("GPUSHARE_TOKEN", "")
    max_concurrent_jobs: int = 4
    allow_cpu_fallback: bool = True

settings = ServerSettings()
settings.storage_path.mkdir(parents=True, exist_ok=True)
settings.temp_path.mkdir(parents=True, exist_ok=True)
