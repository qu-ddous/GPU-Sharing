from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
import uuid
from pathlib import Path
from server.app.config import settings
from server.app.services.job_manager import job_manager
from server.app.services.checksum_service import checksum_service
from shared.schemas import JobCreateResponse

router = APIRouter(prefix="/api/v1/jobs", tags=["Jobs & Rendering"])

@router.post("", response_model=JobCreateResponse)
async def submit_job(
    file: UploadFile = File(None),
    resolution: str = Form("1080p"),
    bitrate: str = Form("8M"),
    preset: str = Form("p5"),
    output_filename: str = Form("output.mp4"),
    allow_cpu_fallback: bool = Form(True),
    custom_command: str = Form(None)
):
    job_id = f"job_{uuid.uuid4().hex[:8]}"
    job_dir = settings.storage_path / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    filename = file.filename if file else output_filename
    input_file_path = job_dir / filename

    if file:
        content = await file.read()
        with open(input_file_path, "wb") as buffer:
            buffer.write(content)

    output_path = job_dir / output_filename

    job_manager.register_job(job_id, {
        "job_id": job_id,
        "filename": filename,
        "input_path": str(input_file_path),
        "output_path": str(output_path),
        "resolution": resolution,
        "bitrate": bitrate,
        "preset": preset,
        "allow_cpu_fallback": allow_cpu_fallback,
        "custom_command": custom_command
    })

    return JobCreateResponse(
        job_id=job_id,
        status="queued",
        filename=filename,
        target_resolution=resolution,
        target_bitrate=bitrate,
        preset=preset
    )

@router.get("/{job_id}")
async def get_job_status(job_id: str):
    if job_id not in job_manager.active_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return job_manager.active_jobs[job_id]

@router.post("/{job_id}/cancel")
async def cancel_job(job_id: str):
    cancelled = job_manager.cancel_job(job_id)
    return {"success": True, "job_id": job_id, "message": "Task abort signal delivered"}

@router.get("/{job_id}/download")
async def download_job_output(job_id: str):
    job = job_manager.active_jobs.get(job_id, {})
    output_file = Path(job.get("output_path", settings.storage_path / job_id / "output.mp4"))
    if output_file.exists():
        return FileResponse(output_file, filename=output_file.name)
    return {"status": "completed", "message": "Job finished", "job_id": job_id}
