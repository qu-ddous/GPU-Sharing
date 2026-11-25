import hashlib
import asyncio
from pathlib import Path

class ChecksumService:
    @staticmethod
    async def compute_sha256(file_path: Path) -> str:
        """Asynchronous chunked SHA-256 calculator to prevent event loop blocking"""
        if not file_path.exists():
            return ""

        def _sync_calc():
            sha256 = hashlib.sha256()
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(1024 * 1024), b""):
                    sha256.update(chunk)
            return sha256.hexdigest()

        return await asyncio.to_thread(_sync_calc)

checksum_service = ChecksumService()
