import psutil
import socket
import platform
from shared.schemas import HardwareInfoModel

class SystemService:
    def __init__(self):
        self._nvml_available = False
        try:
            import pynvml
            pynvml.nvmlInit()
            self._nvml_available = True
        except Exception:
            self._nvml_available = False

    def get_hardware_telemetry(self) -> HardwareInfoModel:
        # Real CPU & RAM from host OS
        cpu_percent = psutil.cpu_percent(interval=None) or 0.0
        ram = psutil.virtual_memory()
        ram_total = round(ram.total / (1024**3), 1)
        ram_used = round(ram.used / (1024**3), 1)

        # Check for real GPU
        gpu_detected = False
        gpu_name = "CPU Only (No NVIDIA GPU Detected)"
        gpu_util = 0.0
        vram_total = 0
        vram_used = 0
        gpu_temp = 0.0
        encoder_util = 0.0

        if self._nvml_available:
            try:
                import pynvml
                device_count = pynvml.nvmlDeviceGetCount()
                if device_count > 0:
                    handle = pynvml.nvmlDeviceGetHandleByIndex(0)
                    gpu_name_raw = pynvml.nvmlDeviceGetName(handle)
                    gpu_name = gpu_name_raw.decode('utf-8') if isinstance(gpu_name_raw, bytes) else str(gpu_name_raw)
                    util = pynvml.nvmlDeviceGetUtilizationRates(handle)
                    gpu_util = float(util.gpu)
                    encoder_util = float(util.encoder)
                    mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
                    vram_total = int(mem.total // (1024 * 1024))
                    vram_used = int(mem.used // (1024 * 1024))
                    gpu_temp = float(pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU))
                    gpu_detected = True
            except Exception:
                gpu_detected = False

        if not gpu_detected:
            # Check if PyTorch can see CUDA
            try:
                import torch
                if torch.cuda.is_available():
                    gpu_detected = True
                    gpu_name = torch.cuda.get_device_name(0)
                    mem_alloc = torch.cuda.memory_allocated(0) // (1024 * 1024)
                    mem_total = torch.cuda.get_device_properties(0).total_memory // (1024 * 1024)
                    vram_used = int(mem_alloc)
                    vram_total = int(mem_total)
            except Exception:
                pass

        return HardwareInfoModel(
            hostname=socket.gethostname(),
            os_platform=f"{platform.system()} {platform.release()}",
            cpu_model=platform.processor() or "Multi-Core Host Processor",
            cpu_cores=psutil.cpu_count(logical=True) or 4,
            cpu_percent=cpu_percent,
            ram_total_gb=ram_total,
            ram_used_gb=ram_used,
            gpu_detected=gpu_detected,
            gpu_name=gpu_name,
            gpu_vram_total_mb=vram_total,
            gpu_vram_used_mb=vram_used,
            gpu_util_percent=gpu_util,
            gpu_temp_c=gpu_temp,
            encoder_util_percent=encoder_util
        )

system_service = SystemService()
