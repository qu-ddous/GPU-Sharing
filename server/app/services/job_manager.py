import asyncio
import zipfile
from pathlib import Path
from typing import Dict, Any, Optional

class JobManager:
    def __init__(self):
        self.active_jobs: Dict[str, Dict[str, Any]] = {}
        self.subprocesses: Dict[str, asyncio.subprocess.Process] = {}

    def register_job(self, job_id: str, details: Dict[str, Any]):
        self.active_jobs[job_id] = {
            "status": "queued",
            "percent": 0.0,
            **details
        }

    def cancel_job(self, job_id: str) -> bool:
        if job_id in self.active_jobs:
            self.active_jobs[job_id]["status"] = "cancelled"
        if job_id in self.subprocesses:
            proc = self.subprocesses[job_id]
            try:
                proc.terminate()
            except Exception:
                pass
            del self.subprocesses[job_id]
            return True
        return False

    async def extract_workspace(self, zip_path: Path, dest_dir: Path):
        """Universal Project Workspace zip unpacker"""
        dest_dir.mkdir(parents=True, exist_ok=True)
        def _unzip():
            with zipfile.ZipFile(zip_path, 'r') as zf:
                zf.extractall(dest_dir)
        await asyncio.to_thread(_unzip)

job_manager = JobManager()
