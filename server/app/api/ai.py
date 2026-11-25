from fastapi import APIRouter, UploadFile, File
from server.app.services.ai_service import ai_service
from shared.schemas import AIPredictResponseModel

router = APIRouter(prefix="/api/v1/ai", tags=["AI Training & Google Lens"])

@router.get("/status")
async def get_ai_status():
    return ai_service.get_hardware_ai_status()

@router.post("/train")
async def start_training(payload: dict):
    epochs = int(payload.get("epochs", 10))
    ai_service.start_training(total_epochs=epochs)
    return {"success": True, "job_id": "ai_train_01", "message": f"PyTorch training loop initialized on {epochs} epochs"}

@router.post("/cancel")
async def cancel_training():
    ai_service.is_training = False
    return {"success": True, "message": "Training loop aborted"}

@router.get("/progress")
async def get_training_progress():
    return ai_service.get_training_progress()

@router.post("/predict", response_model=AIPredictResponseModel)
async def predict_google_lens(file: UploadFile = File(None)):
    data = await file.read() if file else b""
    res = await ai_service.predict_google_lens(data)
    return AIPredictResponseModel(**res)

@router.post("/benchmark")
async def run_ai_benchmark():
    return await ai_service.run_hardware_benchmark()
