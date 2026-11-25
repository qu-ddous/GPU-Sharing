from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class HardwareInfoModel(BaseModel):
    hostname: str = "DESKTOP-GPU"
    os_platform: str = "Windows 11"
    cpu_model: str = "AMD Ryzen 7 5800X (8C/16T)"
    cpu_cores: int = 16
    cpu_percent: float = 14.0
    ram_total_gb: float = 32.0
    ram_used_gb: float = 14.2
    gpu_detected: bool = True
    gpu_name: Optional[str] = "NVIDIA GeForce RTX 3060 (12GB)"
    gpu_vram_total_mb: Optional[int] = 12288
    gpu_vram_used_mb: Optional[int] = 4200
    gpu_util_percent: Optional[float] = 88.0
    gpu_temp_c: Optional[float] = 62.0
    encoder_util_percent: Optional[float] = 74.0

class FFmpegCapabilities(BaseModel):
    available: bool = True
    version: Optional[str] = "6.1.1-full_build"
    nvenc_available: bool = True
    supported_encoders: List[str] = ["h264_nvenc", "hevc_nvenc", "av1_nvenc", "libx264", "libx265"]

class SystemLimits(BaseModel):
    max_upload_size_bytes: int = 53687091200 # 50 GB
    max_concurrent_jobs: int = 4
    active_jobs: int = 1

class HealthResponseModel(BaseModel):
    status: str = "healthy"
    protocol_version: str = "v1.0.0"
    server_time: str
    ffmpeg: FFmpegCapabilities
    hardware: HardwareInfoModel
    limits: SystemLimits

class JobCreateResponse(BaseModel):
    job_id: str
    status: str = "queued"
    filename: str
    target_resolution: str
    target_bitrate: str
    preset: str
    message: str = "Job successfully queued for GPU execution"

class AIPredictResponseModel(BaseModel):
    predicted_class: str
    confidence_percent: float
    top_candidates: List[Dict[str, Any]]
    inference_latency_ms: float
    device_used: str
