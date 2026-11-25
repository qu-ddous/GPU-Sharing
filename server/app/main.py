from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.app.api.health import router as health_router
from server.app.api.jobs import router as jobs_router
from server.app.api.websocket import router as ws_router
from server.app.api.ai import router as ai_router
from server.app.services.connection_tracker import connection_tracker
import threading
from shared.discovery import run_udp_discovery_responder

app = FastAPI(
    title="GPUShare Worker Server Daemon",
    description="High-performance asynchronous backend for remote GPU video transcoding and AI compute",
    version="1.0.0"
)

# Enable direct LAN CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(jobs_router)
app.include_router(ws_router)
app.include_router(ai_router)

@app.on_event("startup")
async def startup_event():
    # Launch UDP discovery responder in background thread
    discovery_thread = threading.Thread(target=run_udp_discovery_responder, args=(8000,), daemon=True)
    discovery_thread.start()
    print("[Daemon] GPUShare FastAPI server & UDP Port 8002 discovery active.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.app.main:app", host="0.0.0.0", port=8000, reload=True)
