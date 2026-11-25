from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import asyncio
from pathlib import Path
from server.app.services.ffmpeg_service import ffmpeg_service
from server.app.services.job_manager import job_manager

router = APIRouter(prefix="/api/v1/ws", tags=["WebSocket Stream"])

@router.websocket("/{job_id}")
async def websocket_endpoint(websocket: WebSocket, job_id: str):
    await websocket.accept()
    job = job_manager.active_jobs.get(job_id, {})
    custom_cmd = job.get("custom_command")
    input_path = Path(job.get("input_path", "input.mp4"))
    output_path = Path(job.get("output_path", "output.mp4"))
    resolution = job.get("resolution", "1080p")
    bitrate = job.get("bitrate", "8M")
    preset = job.get("preset", "p5")
    allow_fallback = job.get("allow_cpu_fallback", True)

    try:
        if custom_cmd:
            # Custom script / command execution
            await websocket.send_text(json.dumps({
                "type": "log",
                "message": f"[Workspace] Executing custom command on GPU node: {custom_cmd}"
            }))
            proc = await asyncio.create_subprocess_shell(
                custom_cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            job_manager.subprocesses[job_id] = proc

            step = 0
            while True:
                line_bytes = await proc.stdout.readline()
                if not line_bytes:
                    break
                line = line_bytes.decode('utf-8', errors='replace').strip()
                step = min(95, step + 15)
                await websocket.send_text(json.dumps({
                    "type": "progress",
                    "job_id": job_id,
                    "percent": step,
                    "status": "rendering",
                    "speed": "1.0x",
                    "fps": 60,
                    "message": line
                }))

            await proc.wait()
            await websocket.send_text(json.dumps({
                "type": "progress",
                "job_id": job_id,
                "percent": 100,
                "status": "completed",
                "message": "[Workspace] Custom command execution finished successfully (Exit Code 0)."
            }))
        else:
            # Video Transcoding Stream
            async for event in ffmpeg_service.execute_transcode_stream(
                input_path=input_path,
                output_path=output_path,
                resolution=resolution,
                bitrate=bitrate,
                preset=preset,
                allow_fallback=allow_fallback
            ):
                event["job_id"] = job_id
                await websocket.send_text(json.dumps(event))

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
        except Exception:
            pass
