from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
from server.app.services.ai_service import ai_service
from shared.schemas import AIPredictResponseModel

router = APIRouter(prefix="/api/v1/ai", tags=["AI Training & Vision"])

@router.get("/status")
async def get_ai_status():
    return ai_service.get_hardware_ai_status()

@router.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    data = await file.read()
    return ai_service.save_uploaded_dataset(file.filename or "dataset.zip", data)

@router.post("/train")
async def start_training(payload: dict):
    epochs = int(payload.get("epochs", 10))
    model_arch = str(payload.get("model_arch", "ResNet18-Lite"))
    batch_size = int(payload.get("batch_size", 64))
    learning_rate = float(payload.get("learning_rate", 0.001))
    optimizer_name = str(payload.get("optimizer", "Adam"))
    use_gpu = bool(payload.get("use_gpu", True))

    ai_service.start_training(
        total_epochs=epochs,
        model_arch=model_arch,
        batch_size=batch_size,
        learning_rate=learning_rate,
        optimizer_name=optimizer_name,
        use_gpu=use_gpu,
    )
    return {
        "success": True,
        "job_id": "ai_train_01",
        "message": f"{model_arch} training initialized for {epochs} epochs",
    }

@router.post("/pause")
async def pause_training():
    ai_service.pause_training()
    return {"success": True, "message": "Training paused"}

@router.post("/resume")
async def resume_training():
    ai_service.resume_training()
    return {"success": True, "message": "Training resumed"}

@router.post("/cancel")
async def cancel_training():
    ai_service.cancel_training()
    return {"success": True, "message": "Training loop aborted"}

@router.get("/progress")
async def get_training_progress():
    return ai_service.get_training_progress()

@router.get("/download-model")
async def download_trained_model():
    path = ai_service.saved_model_path
    if not path or not os.path.exists(path):
        raise HTTPException(status_code=404, detail="No trained model available yet. Run training first.")
    return FileResponse(path, filename=os.path.basename(path), media_type="application/octet-stream")

@router.get("/download-report")
async def download_training_report():
    path = ai_service.saved_report_path
    if not path or not os.path.exists(path):
        raise HTTPException(status_code=404, detail="No training report available yet. Run training first.")
    return FileResponse(path, filename="training_report.json", media_type="application/json")

@router.post("/predict", response_model=AIPredictResponseModel)
async def predict_google_lens(file: UploadFile = File(None)):
    data = await file.read() if file else b""
    fname = file.filename if file and file.filename else "sample.jpg"
    res = await ai_service.predict_google_lens(data, filename=fname)
    return AIPredictResponseModel(**res)

@router.post("/benchmark")
async def run_ai_benchmark():
    return await ai_service.run_hardware_benchmark()
