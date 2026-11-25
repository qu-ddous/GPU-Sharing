from fastapi import APIRouter
from datetime import datetime
from shared.schemas import HealthResponseModel, FFmpegCapabilities, SystemLimits
from server.app.services.system_service import system_service

router = APIRouter(prefix="/api/v1", tags=["Health & Telemetry"])

@router.get("/ping")
async def ping():
    return {"pong": True, "timestamp": datetime.utcnow().isoformat()}

@router.get("/health", response_model=HealthResponseModel)
async def get_health():
    hardware = system_service.get_hardware_telemetry()
    return HealthResponseModel(
        status="healthy",
        protocol_version="v1.0.0",
        server_time=datetime.utcnow().isoformat(),
        ffmpeg=FFmpegCapabilities(),
        hardware=hardware,
        limits=SystemLimits()
    )
