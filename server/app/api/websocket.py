from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from server.app.services.ffmpeg_service import ffmpeg_service
from pathlib import Path

router = APIRouter(prefix="/api/v1/ws", tags=["WebSocket Stream"])

@router.websocket("/{job_id}")
async def websocket_endpoint(websocket: WebSocket, job_id: str):
    await websocket.accept()
    try:
        # Stream live progress events & console logs
        async for event in ffmpeg_service.execute_transcode_stream(
            input_path=Path("input.mp4"),
            output_path=Path("output.mp4"),
            resolution="1080p",
            bitrate="8M",
            preset="p5"
        ):
            await websocket.send_text(json.dumps(event))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
        except Exception:
            pass
