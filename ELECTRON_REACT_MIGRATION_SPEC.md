# GPUShare & GPU Stream Studio: Electron + React + Tailwind CSS Migration Blueprint
**Complete Architecture, UI Component Map (Client Studio & Server Node), Subsystem Protocols & Implementation Roadmap**

---

## 1. Executive Summary & Target Tech Stack

This blueprint details the complete, zero-loss migration of the **Distributed Task Offloading & Remote GPU Rendering / Computing System** from Python CustomTkinter desktop UI into a modern, production-grade desktop application stack:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                GPUSHARE PLATFORM TOPOLOGY                              │
├──────────────────────────────────────────┬─────────────────────────────────────────────┤
│ CLIENT STUDIO (Laptop / Video Editor)    │ WORKER SERVER NODE (Desktop GPU / Compute)  │
│ ──────────────────────────────────────── │ ─────────────────────────────────────────── │
│ • Electron 30+ (Native Desktop Shell)    │ • Electron 30+ (Worker Desktop GUI Monitor) │
│ • React 18+ with TypeScript              │ • React 18+ with TypeScript (Zero-Lag UI)   │
│ • Tailwind CSS + Radix / Shadcn UI       │ • Python 3.11+ High-Performance Daemon      │
│ • Lucide Icons + Recharts / Canvas Wave  │ • FastAPI + Uvicorn Async Loop              │
│ • Zustand (Global Client State)          │ • PyTorch + CUDA 12.x Deep Learning Engine  │
│ • Zero Internet Dependency (Direct P2P)  │ • FFmpeg (NVENC Hardware Accelerated)       │
└──────────────────────────────────────────┴─────────────────────────────────────────────┘
```

### Core Architecture Principles:
1. **100% Offline P2P Operation:** Direct Ethernet LAN cable (1 Gbps / 2.5 Gbps) with static IP or auto-discovery, zero cloud or internet dependency.
2. **True Distributed Offloading:** Laptop remains at 0% compute load; dedicated desktop GPU/CPU executes rendering, training, and compute tasks.
3. **Dual GUI Ecosystem:** Both the **Client Studio** and the **Worker Server Node** have their own complete, polished desktop GUIs with live telemetry.
4. **Cryptographic Integrity:** Automatic chunked SHA-256 verification before and after execution.
5. **Real-Time Duplex Telemetry:** WebSocket bi-directional streaming for live console logs, loss/accuracy curves, and hardware sensors.

---

## 2. Directory & Repository Structure

```
GPUShare-NextGen/
├── electron/                             # Electron Main & Preload Processes
│   ├── main.ts                           # App lifecycle, dual-mode launcher, system tray
│   ├── preload.ts                        # ContextBridge IPC (File I/O, Dialogs, Hashes)
│   ├── ipc/
│   │   ├── file-dialogs.ts               # Native OS folder & file pickers
│   │   ├── hasher.ts                     # Fast streaming SHA-256 calculator (Node.js crypto stream)
│   │   ├── firewall.ts                   # Windows netsh elevated rule runner
│   │   ├── discovery.ts                  # UDP broadcast listener & scanner (Port 8002)
│   │   └── watcher.ts                    # Chokidar watch-folder background daemon
│   └── tsconfig.json
├── src/                                  # React 18 Single-Page Desktop Application
│   ├── assets/                           # Brand icons, sound effects, fallback images
│   ├── components/                       # Shared UI primitives (Tailwind + Radix)
│   │   ├── ui/                           # Button, Card, Badge, Progress, Dialog, Tabs
│   │   ├── client/                       # Client Studio specific components
│   │   │   ├── ClientSidebar.tsx         # Primary left navigation
│   │   │   ├── ClientTopbar.tsx          # Status indicator, latency pill, quick connect
│   │   │   └── MetricTile.tsx            # KPI visual telemetry cards
│   │   └── server/                       # Server Node specific components
│   │       ├── ServerSidebar.tsx         # Server navigation & NVENC status
│   │       ├── ServerTopbar.tsx          # Daemon toggle, worker IP, firewall button
│   │       └── SparklineWave.tsx         # Real-time hardware waveform canvas
│   ├── views/
│   │   ├── client/                       # Client Studio 7 Views
│   │   │   ├── DashboardView.tsx         # Health gauges, quick actions, server stats
│   │   │   ├── RenderJobView.tsx         # Video transcoding, batch & universal tasks
│   │   │   ├── ActiveJobView.tsx         # Live dual progress, terminal stream, cancel
│   │   │   ├── AIStudioView.tsx          # 4-in-1 CNN training, Google Lens, Benchmarks
│   │   │   ├── BenchmarksView.tsx        # 5-step hardware rendering speedup suite
│   │   │   ├── SettingsView.tsx          # IP config, watch folder, token, defaults
│   │   │   └── DocsView.tsx              # Bilingual (English & Roman Urdu) manual
│   │   └── server/                       # Server Node 7 Views
│   │       ├── ServerOverviewView.tsx    # 5 KPI cards, wave graphs, session totals
│   │       ├── ServerRenderQueueView.tsx # Live job queue table, search, abort actions
│   │       ├── ServerGPUEngineView.tsx   # CUDA specs, 4 wave graphs, codec matrix
│   │       ├── ServerNetworkView.tsx     # LAN/Cable IP, active sessions, adapters
│   │       ├── ServerSettingsView.tsx    # 4 sub-tabs: Startup, Render, Storage, Security
│   │       ├── ServerActivityLogsView.tsx# Zero-lag log console, 5 filters, export
│   │       └── ServerDocsView.tsx        # Server admin manual & cable setup guide
│   ├── store/
│   │   ├── useServerStore.ts             # Server connection state, latency, hardware stats
│   │   ├── useJobStore.ts                # Active job status, history, logs
│   │   ├── useAIStore.ts                 # CNN training hyperparameters, telemetry
│   │   └── useServerNodeStore.ts         # Server daemon state, queue, active sessions
│   ├── services/
│   │   ├── apiClient.ts                  # Axios / Fetch client with X-API-Token
│   │   ├── wsClient.ts                   # Resilient WebSocket connection manager
│   │   └── discoveryClient.ts            # UDP broadcast auto-discovery listener
│   ├── types/
│   │   └── index.ts                      # Complete TypeScript definitions matching Python Pydantic
│   ├── App.tsx                           # Root view router & role switcher (Client / Server)
│   ├── main.tsx                          # React DOM entrypoint
│   └── index.css                         # Tailwind directives & claymorphism classes
├── server/                               # Python 3.11+ High-Performance Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── health.py                 # System telemetry & hardware metrics
│   │   │   ├── jobs.py                   # Multipart upload, job execution, cancellation
│   │   │   ├── websocket.py              # Duplex log streaming & progress events
│   │   │   └── ai.py                     # PyTorch training, Google Lens inference
│   │   ├── services/
│   │   │   ├── ffmpeg_service.py         # NVENC/libx264 command generator & parser
│   │   │   ├── job_manager.py            # Async task queue, subprocesses, artifacts
│   │   │   ├── system_service.py         # NVML / psutil GPU & CPU monitoring
│   │   │   ├── checksum_service.py       # SHA-256 chunked calculation
│   │   │   ├── connection_tracker.py     # Active client sessions & bandwidth tracking
│   │   │   └── ai_service.py             # PyTorch CUDA training loops & vision models
│   │   ├── config.py                     # Pydantic environment configuration
│   │   └── main.py                       # FastAPI daemon entrypoint
│   └── requirements.txt
├── shared/                               # Shared Protocols & Contracts
│   ├── schemas.ts                        # TypeScript types matching Python Pydantic models
│   ├── schemas.py                        # Python Pydantic models
│   ├── discovery.py                      # UDP Port 8002 broadcast discovery
│   └── docs_content.json                 # Bilingual documentation dataset (English & Roman Urdu)
├── package.json                          # NPM dependencies & Electron build scripts
└── tailwind.config.js                    # Custom palette, Claymorphism box-shadows
```

---

## 3. Client Studio UI & Component Specification

### 3.1. Navigation Sidebar (`src/components/client/ClientSidebar.tsx`)
* **Brand Header:**
  * Shiny Badge: `CLAY STUDIO` (`#8B5CF6`)
  * App Name: `⚡ GPU Stream` (Bold 20px)
  * Subtitle: `Task Offloading Studio`
* **Workflow Section (`MAIN WORKFLOW`):**
  1. `📊 Dashboard` (`dashboard`)
  2. `🎬 New Render Job` (`render_job`)
  3. `📡 Live Monitor` (`active_job`)
* **System Section (`SYSTEM & TOOLS`):**
  4. `⚡ Benchmarks` (`benchmarks`)
  5. `⚙️ Host & Settings` (`settings`)
  6. `🧠 AI Studio & Lens` (`ai_studio`) — *Positioned directly below Settings*
  7. `📖 Docs & Guide` (`docs`) — *Positioned at the very bottom*
* **Engine Status Card (Bottom):**
  * Displays: `● NVENC Ready` (Emerald Green) or `● CPU Fallback` (Amber).

---

### 3.2. Topbar Status Header (`src/components/client/ClientTopbar.tsx`)
* **Current Page Title:** Dynamic heading (e.g. `GPUShare • AI Training & Google Lens Studio`).
* **Connection Pill:**
  * Online: Green badge `● Connected: 192.168.99.1:8000 (1.2 ms)`.
  * Offline: Red badge `● Server Offline (Click to Reconnect)`.
* **Quick Navigation Buttons:**
  * `⚡ Active Job Pill`: Visible when a job is rendering; shows live % and links directly to Live Monitor.

---

### 3.3. Client Studio Page Views

#### View 1: Dashboard (`src/views/client/DashboardView.tsx`)
* **Quick Connect Bar:** IP input, Port input (default `8000`), "Connect" button, auto-discovery scan button (UDP Port 8002 trigger).
* **Server Hardware Gauges:**
  * CPU Load Meter (Circular gauge or progress bar, updating every second).
  * RAM Used / Total (e.g. `14.2 GB / 32.0 GB`).
  * GPU VRAM Meter (e.g. `6.8 GB / 12.0 GB NVIDIA RTX`).
  * GPU Core Utilization % (0% to 100%).
* **Quick Launch Action Cards:** "Create Render Job", "Open AI Studio & Lens", "Run Performance Benchmark".
* **Recent Activity Feed:** Table showing recent jobs with status badges and elapsed times.

---

#### View 2: New Render Job (`src/views/client/RenderJobView.tsx`)
* **Task Profile Selector (Radio Buttons / Tabs):**
  1. `🎬 Video Transcode (GPU)`
  2. `⚡ Batch / Shell Script`
  3. `🌟 All-in-One (Any Command / Folder)`
  *(Note: Python / AI Model is cleanly relocated to AI Studio)*.
* **Card 1: File & Folder Picker:**
  * Drag-and-drop zone with native browse button.
  * Metadata box: Filename, File size (MB/GB), SHA-256 Checksum, Media duration/resolution.
  * For Universal Tasks: "Browse Project Folder" (triggers zip compression on client) and "Terminal Command" input.
* **Card 2: Transcode & Execution Settings:**
  * Target Resolution dropdown: `Original`, `4K (2160p)`, `1440p`, `1080p`, `720p`.
  * Target Bitrate dropdown: `2M`, `5M`, `8M`, `12M`, `20M`.
  * NVENC Preset dropdown: `p1 (Fastest)` to `p7 (Slowest / Best Quality)`.
  * Checkbox: `Allow CPU Fallback (libx264)` (enabled by default).
* **Card 3: Output Destination:**
  * Output Filename input (auto-populated with `[stem]_remote_[res].[ext]`).
  * Output Directory selector (defaults to OS Downloads folder).
* **Submit Action:**
  * Button: `🚀 Submit & Render on Remote GPU`.
  * Validates network status, hashes file, streams to server, and navigates to Live Monitor.

---

#### View 3: Live Monitor (`src/views/client/ActiveJobView.tsx`)
* **Job Header:** Job ID badge, status tag (`QUEUED`, `RENDERING`, `COMPLETED`, `FAILED`, `CANCELLED`).
* **Dual Progress Bars:**
  * Overall Progress: `[██████████░░░░] 68.4%`.
  * Sub-task / Batch progress.
* **Real-Time KPIs:** Current FPS / Processing Speed, Elapsed Time, Estimated Time Remaining (ETA), Output File Size.
* **Remote Hardware Telemetry Tiles:** Remote CPU %, Remote RAM GB, Remote GPU %, Remote VRAM MB.
* **Live Streaming Console:** High-performance terminal component (e.g. `xterm.js` or auto-scrolling terminal box) streaming server stdout/stderr line-by-line via WebSocket.
* **Action Controls:**
  * `🛑 Cancel Task`: Sends abort signal to server subprocess.
  * `📂 Open Output Folder`: Highlights downloaded file in Windows Explorer when completed.

---

#### View 4: AI Studio & Google Lens (`src/views/client/AIStudioView.tsx`)
Contains 4 dedicated Sub-Tabs:

1. **Sub-Tab 1: 🚀 Remote CNN Training (100k Dataset)**
   * **Dataset Selection Card:**
     * Browse local dataset folder (dynamic count, supports 100k+ images).
     * `⚡ Use GPUShare 100,000 Benchmark Dataset` (in-memory high-throughput synthetic stream).
     * Live display: Total images detected, total classes, image format.
   * **Model & Hyperparameters Card:**
     * Architecture: `ResNet18-Lite`, `MobileNetV2-Lite`, `SimpleCNN`.
     * Epochs: `3`, `5`, `10`, `20`.
     * Batch Size: `32`, `64`, `128`.
     * Learning Rate: `0.001`, `0.0005`, `0.0001`.
     * Optimizer: `Adam`, `SGD with Momentum`.
     * Hardware Target: `Remote NVIDIA GPU (CUDA)` vs `Local CPU`.
   * **Live Training Telemetry & Logs:**
     * Progress bar with Epoch `[x/total]` counter.
     * 4 Metric Tiles: Loss, Accuracy %, Speed (img/s), VRAM Used (MB).
     * Live PyTorch training terminal and cancellation button.

2. **Sub-Tab 2: 🔍 Google Lens • Visual Image Classifier**
   * **Input Section:** File browse button or quick sample chips (`🐱 Cat`, `🚗 Car`, `🐶 Dog`, `✈️ Plane`).
   * **Viewfinder Preview:** Image canvas with Google Lens reticle/focus box.
   * **Action:** `⚡ Scan with Google Lens (Remote GPU)` button.
   * **Result Card:**
     * Large predicted label (e.g. `🐱 Cat (98.4% Match)`).
     * Animated confidence bar.
     * Top-3 classification probabilities distribution table.
     * Hardware latency pill: `⚡ Latency: 16.2 ms • Target: Server NVIDIA GPU (CUDA)`.

3. **Sub-Tab 3: 🧠 Custom Python / AI Model Offloader**
   * Browse custom Python script (`.py` or `.pyw`, e.g. `train.py`, `detect.py`).
   * Displays Script Name, File Size, SHA-256 Checksum.
   * Hardware Acceleration profile dropdown (`Auto-Detect CUDA`, `Dedicated GPU Preferred`, `Multi-Core CPU`).
   * Output artifact delivery option (`Capture Execution Log & Output Files`).
   * Action button: `🧠 Submit & Run Python Model on Server Hardware`.
   * Automatically switches to Live Monitor and streams server CUDA logs.

4. **Sub-Tab 4: ⚖️ CPU vs GPU Suite**
   * `🔥 Execute Comparative Hardware Benchmark` button.
   * Executes identical PyTorch CNN batches on Host CPU vs Remote GPU.
   * Dual cards: CPU Execution Time/Throughput vs GPU Execution Time/Throughput.
   * Winner Banner: `🏆 CONCLUSION: Dedicated Remote GPU is 12.8x Faster than Host CPU! 🚀`.

---

#### View 5: Benchmarks Suite (`src/views/client/BenchmarksView.tsx`)
* **Automated 5-Step Pipeline:**
  1. Generate synthetic standard benchmark video.
  2. Run local CPU transcode test.
  3. Run LAN P2P transfer speed test.
  4. Run remote GPU NVENC transcode test.
  5. Calculate speedup factor and efficiency multiplier.
* **Graphical Comparison:** Side-by-side bar charts (Render Time, CPU Usage, Temperature).
* **Export Button:** `Export Benchmark Report (.json / .txt)`.

---

#### View 6: Host Connection & Settings (`src/views/client/SettingsView.tsx`)
* **Connection Config:** Server IP, Server Port, API Secret Token, "Test Connection" button.
* **Transcode Defaults:** Default resolution, bitrate, preset, output folder path.
* **Watch Folder Automation Card:**
  * Enable/Disable toggle switch.
  * Watch folder path picker.
  * Automatically detects new media exported from Premiere/CapCut, uploads, renders on server, and downloads result without user intervention.
* **Save / Reset:** "Save Configuration" & "Reset to Factory Defaults" buttons.

---

#### View 7: Docs & Guide (`src/views/client/DocsView.tsx`)
* **Language Switcher:** 🇬🇧 English | 🇵🇰 Roman Urdu.
* **Rich Accordion Sections:**
  1. Project Purpose & Benefits.
  2. 5 Task Workflows (Detailed Guide).
  3. 100% Resource Verification (Task Manager proof, telemetry).
  4. GPUShare AI Training & Google Lens.
  5. Direct Cable Pairing & Static IP setup.
  6. UI Page-by-Page Manual.
  7. FAQs & Troubleshooting.

---

## 4. Server Node UI & Component Specification (Worker Server Desktop Application)

The Worker Server Node features a dedicated, high-performance desktop GUI designed for the host computer to monitor GPU compute workloads, client network sessions, queue statuses, and hardware thermals.

### 4.1. Server Architecture & Application Shell
* **Window Properties:** 1240 × 840 minimum size, dark/light theme responsive, hardware-accelerated rendering.
* **Dual Execution Mode:** The Electron application can be built as a standalone binary (`GPUWorkerServer.exe`) or launched via unified launcher (`npm run start:server`).
* **Background Daemon Integration:** Electron shell manages the local Python FastAPI process lifecycle (starts on launch, terminates on app close).

---

### 4.2. Server Topbar Status Header (`src/components/server/ServerTopbar.tsx`)
* **Header Title & Subtitle:**
  * Title: `GPU Worker Server` (Bold 18px).
  * Subtitle: `Dedicated NVIDIA GPU render node for remote video processing & AI training`.
* **Daemon State Toggle Button:**
  * Status Pill & Switch: `● Server Online` (Emerald Green) or `● Server Stopped` (Rose Red).
  * Clicking pauses/resumes the inbound task intake without killing active render jobs.
* **Network Badges:**
  * Worker Host IP & Port: e.g. `192.168.99.1:8000` (Direct Ethernet IP).
  * Active Clients Badge: e.g. `⚡ 2 Clients Active` (Live counter from `connection_tracker`).
* **One-Click Firewall Action Button:**
  * Button: `🛡️ Windows Firewall`.
  * Calls Electron IPC (`ipcRenderer.invoke('unblock-firewall')`) which runs elevated `netsh advfirewall firewall add rule name="GPUShare_Server" dir=in action=allow protocol=TCP localport=8000`.
  * Shows instant toast: `✔ Windows Firewall Rule Configured for Port 8000`.

---

### 4.3. Server Navigation Sidebar (`src/components/server/ServerSidebar.tsx`)
* **Brand Header:**
  * Shiny Badge: `WORKER NODE` (`#3B82F6`)
  * App Name: `⚡ GPU Worker` (Bold 20px)
  * Server Status Indicator: `● Running` (Green) / `● Stopped` (Red).
* **Navigation Views (7 Views):**
  1. `📊 Overview` (`server_overview`) — System telemetry, GPU/CPU gauges, session totals.
  2. `📋 Render Queue` (`render_queue`) — Real-time task queue table, filters, cancel actions.
  3. `🎮 GPU & Engine` (`gpu_engine`) — CUDA specs, 4 wave graphs, codec capabilities.
  4. `🌐 Network` (`network`) — Worker IP copy, network adapters, active client sessions.
  5. `⚙️ Settings` (`server_settings`) — 4 sub-tabs: Startup, Defaults, Storage, Security.
  6. `📜 Activity Logs` (`activity_logs`) — Zero-lag log console, 5 level filters, export.
  7. `📚 Docs & Guide` (`server_docs`) — Bilingual server manual & cable pairing guide.
* **Hardware Detection Footer:**
  * GPU Model: `NVIDIA GeForce RTX [Model]`
  * Driver & Encoder: `Driver: 55x.xx • NVENC Active`

---

### 4.4. Server View 1: Overview (`src/views/server/ServerOverviewView.tsx`)

#### Top Row: 5 Core Telemetry Metric Cards
1. **🖥️ GPU Utilization Card:**
   * Big Percentage: e.g. `88%`.
   * GPU Model Subtitle: `NVIDIA GeForce RTX 3060 (12GB)`.
   * Animated Progress Bar (Blue).
2. **💾 GPU VRAM Usage Card:**
   * Memory Counter: `4.2 / 12.0 GB`.
   * Usage Percentage: `35.0% used`.
   * Animated Progress Bar (Emerald Green).
3. **🌡️ GPU Temperature Card:**
   * Thermal Sensor: `62 °C`.
   * Thermal Status Tag: `Normal Range` (Green) or `High Temp` (Orange/Red).
   * Animated Progress Bar (Amber).
4. **⚙️ Multi-Core CPU Usage Card:**
   * CPU Load: `14%`.
   * Model & Cores: `AMD Ryzen 7 5800X (8C/16T)`.
   * Animated Progress Bar (Purple).
5. **🌐 Network Worker Node Card:**
   * IP & Port Badge: `192.168.99.1:8000`.
   * Status Tag: `FastAPI Daemon Listening`.

#### Middle Row: Telemetry Waves & Session Totals
* **Left: Real-Time Dynamic Sparkline Waveform:**
  * Canvas-rendered smooth 60 FPS scrolling waveforms for GPU Core Load % and VRAM Allocation over last 60 seconds.
* **Right: Session Summary Stats:**
  * Total Jobs Rendered / Trained in session.
  * Total Data Transferred (e.g. `4.8 GB transferred`).
  * Average GPU Transcode FPS (e.g. `184 FPS`).

#### Bottom Row: Recent Activity Quick Feed
* Real-time rolling feed of the 5 most recent worker events with timestamp, status badge, and task name.

---

### 4.5. Server View 2: Render Queue (`src/views/server/ServerRenderQueueView.tsx`)

#### Header KPI Summary Cards (4 Cards)
* `📑 Total Jobs` (Total submitted in current session).
* `▶️ Processing` (Tasks actively transcoding or training).
* `✅ Completed` (Tasks successfully rendered and delivered).
* `❌ Failed / Cancelled` (Tasks aborted or failed).

#### Filter & Search Control Bar
* **Search Input:** `🔍 Search jobs by filename, client, or job ID...` (instant client-side filtering).
* **Status Filter Dropdown:** `All Status`, `Completed`, `Processing`, `Queued`, `Failed`.

#### Live Interactive Render Queue Table
* **Columns:**
  1. `#`: Sequential index / Task ID.
  2. `Filename / Task`: Input media filename or AI model architecture.
  3. `Client IPv4`: Connecting client's IP address (e.g. `192.168.99.2`).
  4. `Priority`: `Normal`, `High`, `Real-Time`.
  5. `Status Badge`: `QUEUED` (Gray), `RENDERING` (Blue), `COMPLETED` (Green), `FAILED` (Red).
  6. `Progress`: Animated bar + percentage label (`74.2%`).
  7. `ETA`: Dynamic countdown (`00:14 remaining`).
  8. `Actions`:
     * `🛑 Cancel`: Instantly sends `SIGTERM` / abort signal to running task subprocess.
     * `🗑️ Purge`: Removes completed/failed entry and cleans temp artifacts.

---

### 4.6. Server View 3: GPU Engine & Hardware (`src/views/server/ServerGPUEngineView.tsx`)

#### Left Card: Compute Node Hardware Profile
* Compute Engine: `NVIDIA CUDA 12.x / PyTorch 2.x`.
* Dedicated VRAM: `12,288 MB GDDR6`.
* Display Driver Version: `551.86 (WHQL)`.
* Compute Capability: `sm_86 (Ampere Architecture)`.
* Active Hardware Encoder: `NVIDIA NVENC (Dual-Engine)`.
* Graphics APIs: `DirectX 12 Ultimate / Vulkan 1.3 / OpenGL 4.6`.

#### Right Card: 4 Live Telemetry Waveform Canvases
1. **GPU Utilization Waveform:** Live continuous line graph with gradient fill (Blue).
2. **VRAM Usage Waveform:** Live continuous line graph (Green).
3. **GPU Temperature Waveform:** Live continuous line graph (Orange).
4. **Encoder / Video Engine Waveform:** Hardware video transcoding throughput (Purple).

#### Bottom Section: Video Codec Capabilities Matrix
* A grid showing hardware encoder availability:
  * `NVIDIA NVENC H.264` (`h264_nvenc`) — **Hardware Accelerated** (Green Badge).
  * `NVIDIA NVENC HEVC/H.265` (`hevc_nvenc`) — **Hardware Accelerated** (Green Badge).
  * `NVIDIA NVENC AV1` (`av1_nvenc`) — **Hardware Accelerated** (Green Badge / RTX 40-series).
  * `Intel QuickSync` (`h264_qsv`) — Secondary fallback if present.
  * `AMD AMF` (`h264_amf`) — Fallback if present.
  * `CPU Software Fallback` (`libx264` / `libx265`) — Always Available.
* **Diagnostics Trigger:** `🧪 Run Hardware Self-Test` button to verify CUDA tensor operations and NVENC encoder pipeline.

---

### 4.7. Server View 4: Network & Connected Clients (`src/views/server/ServerNetworkView.tsx`)

#### Top 4 Network KPI Cards
1. **Daemon Service Status:** `Listening` (Emerald Green) • FastAPI & WebSocket ready.
2. **Detected Worker IP:** Primary LAN IPv4 + `📋 Copy IP` button (with instant `✔ Copied!` feedback).
3. **Active Client Sessions:** Live dynamic counter (`N Clients Connected`).
4. **Total Data Transferred:** Cumulative session network transfer (e.g. `1,248.5 MB`).

#### Detected Network Adapters & Direct Cable Section
* Visual cards representing each physical and virtual network interface:
  * **Direct Ethernet Adapter:** `192.168.99.1` (Direct Cat6 P2P Cable, 1.0 Gbps / 2.5 Gbps).
  * **LAN / Wi-Fi Adapter:** `192.168.1.x` (Local Router Connection).
  * Displays: Adapter Name, IPv4, Subnet Mask, MAC Address, Link Speed, and Status (`Connected` / `Cable Unplugged`).

#### Active Client Sessions Table
* **Columns:**
  1. `Client IP`: Remote client IPv4 address (e.g. `192.168.99.2`).
  2. `Port`: Client source TCP port.
  3. `Session Duration`: Elapsed time connected.
  4. `Last Ping / Latency`: Duplex latency (e.g. `0.8 ms`).
  5. `Bytes Received`: Total payload uploaded by client.
  6. `Bytes Sent`: Total render output downloaded by client.
  7. `Connection Status`: `Active` (Green) / `Idle` (Gray).

#### Windows Defender Firewall Helper Card
* Visual status indicator for Inbound TCP Port 8000.
* Action Button: `🛡️ Unblock Windows Firewall Rule` (executes netsh firewall rule).

---

### 4.8. Server View 5: Server Settings (`src/views/server/ServerSettingsView.tsx`)

Featuring 4 intuitive Sub-Tabs:

1. **Sub-Tab 1: ⚙️ Server Startup & Daemon**
   * Switch: `Start server automatically on Windows startup`.
   * Switch: `Minimize to system tray on close`.
   * Switch: `Auto-reconnect on network loss`.
   * Dropdown: `Max concurrent worker jobs` (`1`, `2`, `3`, `4`, `8`).
   * Input: `Listening Port` (Default: `8000`).
2. **Sub-Tab 2: 🎬 Render Defaults**
   * Default Resolution: `1920 x 1080 (1080p)`, `4K (2160p)`, `Source`.
   * Default Bitrate: `2 Mbps`, `5 Mbps`, `8 Mbps`, `12 Mbps`.
   * Default NVENC Preset: `P1 (Fastest)` to `P7 (Slowest / Best Quality)`.
   * Default Container: `MP4 (H.264)`, `MKV (HEVC)`, `MOV`.
3. **Sub-Tab 3: 📁 Storage & Files**
   * Upload Temp Directory Picker: e.g. `C:\GPUShare\Temp\Uploads`.
   * Render Output Directory Picker: e.g. `C:\GPUShare\Output`.
   * Cache Cleanup Policy: `Auto-delete temp files older than 24 hours` (Toggle).
   * Action Button: `🧹 Clean Temp Cache Now`.
4. **Sub-Tab 4: 🔒 Security & Access Control**
   * Switch: `Require API Secret Token (X-API-Token)`.
   * Token Generator: Input box + `🔑 Generate New Token` button.
   * Switch: `IP Subnet Whitelist` (e.g., restrict only to `192.168.99.*`).
* **Form Action Buttons:** `💾 Save Configuration` & `🔄 Reset to Defaults`.

---

### 4.9. Server View 6: Activity Logs (`src/views/server/ServerActivityLogsView.tsx`)

* **Filter Pills with Dynamic Live Counters:**
  * `All (N)` (Blue)
  * `Info (N)` (Cyan)
  * `Success (N)` (Green)
  * `Warning (N)` (Orange)
  * `Error (N)` (Red)
* **Real-Time Substring Search Input:** `🔍 Search log messages...`.
* **Action Buttons:**
  * `🗑️ Clear`: Clears session log history.
  * `💾 Export`: Saves full timestamped text log file (`server_log_YYYYMMDD.txt`).
* **High-Performance Virtualized Log Console:**
  * Displays timestamp `[HH:MM:SS]`, level badge, source component (`[FFmpeg]`, `[PyTorch]`, `[FastAPI]`, `[Network]`), and message.
  * Zero UI frame freezing even under 500+ log lines per second during video transcoding.

---

### 4.10. Server View 7: Server Docs & Setup Guide (`src/views/server/ServerDocsView.tsx`)

* **Bilingual Switcher:** 🇬🇧 English | 🇵🇰 Roman Urdu.
* **Server Administrator Topics:**
  1. Direct Cat6 Cable Connection without a router.
  2. Windows Static IP configuration (`192.168.99.1` for Server, `192.168.99.2` for Client).
  3. Windows Firewall troubleshooting & port forwarding commands.
  4. NVIDIA Driver & CUDA Toolkit optimization guide.
  5. Verifying True Offloading via Windows Task Manager (confirming GPU engine spikes on Server and 0% on Client).

---

## 5. Core Subsystem & Protocol Deep Dive (The Architectural Modules)

### 5.1. UDP Broadcast Auto-Discovery Service (`shared/discovery.py`)
To enable zero-configuration plug-and-play over direct Ethernet cables:
* **UDP Port:** `8002` (Both Client and Server).
* **Broadcast Address:** `255.255.255.255`.
* **Client Request Packet:** `b"GPU_RENDER_DISCOVER_REQ_V1"`.
* **Server Response Packet:**
  ```
  GPU_RENDER_DISCOVER_RESP_V1:{"hostname": "DESKTOP-GPU", "port": 8000, "gpu": "NVIDIA GeForce RTX 3060", "ip": "169.254.120.45", "protocol_version": "v1.0.0"}
  ```
* **Adapter Priority Ranking:**
  1. APIPA Direct Cable: `169.254.x.x` (Highest Priority).
  2. Direct Static Subnet: `192.168.99.x`.
  3. Physical Wired LAN: Any interface with `is_ethernet == True`.
  4. Wi-Fi / Router LAN: `192.168.1.x` (Fallback).

---

### 5.2. Universal Project Workspace (.zip Execution Engine)
When executing complex batch scripts, multiple Python files, or custom environments:
1. **Client Packaging:**
   * Studio compresses the user's selected project directory into an in-memory or temp `.zip` file.
   * If a custom command is provided, it passes `preset="cmd:<command>"` in the upload form (e.g. `cmd:pip install -r requirements.txt && python train.py`).
2. **Server Extraction:**
   * Server extracts the zip archive into an isolated execution directory: `settings.storage_path / job_id / "workspace"`.
3. **Execution Hierarchy:**
   * **Level 1 (Explicit Command):** If preset starts with `cmd:`, creates `__runner__.bat` inside workspace and executes via `cmd.exe /c __runner__.bat`.
   * **Level 2 (Dedicated Batch):** If `__run__.bat` or `run.bat` exists, executes it.
   * **Level 3 (Python Entrypoint):** If `main.py` exists, executes `python.exe -u main.py`.
   * **Level 4 (Inspection):** Fallback `cmd.exe /c dir`.
4. **Artifact Delivery:**
   * Upon exit code `0`, the server automatically bundles output files or execution logs into `job_dir / "output" / "output.zip"` and computes its SHA-256 for client download.

---

### 5.3. Multi-Stage Hardware Video Encoder Auto-Fallback Loop
Video encoding failures due to driver incompatibility or unsupported codecs must never crash the job:
* **Candidate Hardware Encoders:**
  1. `h264_nvenc` (NVIDIA NVENC)
  2. `h264_qsv` (Intel QuickSync Video)
  3. `h264_amf` (AMD Advanced Media Framework)
  4. `h264_mf` (Windows MediaFoundation)
* **Automatic Fallback Loop:**
  * If the primary hardware encoder fails with non-zero exit code:
    1. Server automatically deletes corrupt/partial output file.
    2. Broadcasts WebSocket warning log: `[WARNING] Hardware encoder failed. Switching to multi-core CPU fallback...`
    3. Re-executes the job immediately using `libx264` (multi-threaded software CPU encoder).
    4. Only marks the job as `FAILED` if both hardware and CPU fallback fail.

---

### 5.4. Watch Folder File-Stability & Debounce Algorithm (`client/services/watch_folder.py`)
To prevent uploading video files while Adobe Premiere or CapCut is still actively writing them to disk:
1. **Recursive Scan:** Monitors root directory and all subdirectories every 1.0 second.
2. **Supported Formats:** `.mp4`, `.mov`, `.mkv`, `.avi`, `.wmv`, `.flv`, `.ts`, `.webm`, `.m4v`.
3. **Ignored Patterns:** Hidden files (`.*`), temporary lock files (`*.tmp`, `*.crdownload`, `*.part`), and existing render outputs (`*_remote_*`).
4. **Write-Completion Stability Check:**
   * Checks file size and modification timestamp:
     $$\text{size}(t) == \text{size}(t - 1) \quad \text{for at least 2 consecutive seconds}$$
   * Only triggers upload when the file handle is completely closed by the external video editor.
5. **Startup Pre-Seeding:** On application launch, existing files older than 60 seconds are indexed in memory so historical files are not repeatedly processed.

---

### 5.5. Full Electron IPC Bridge Specification (`electron/preload.ts`)

```typescript
// Exposed to Window context via contextBridge.exposeInMainWorld('electronAPI', {...})

export interface ElectronAPI {
  // Native OS File Dialogs
  openFileDialog: (options: { title: string; filters: Array<{ name: string; extensions: string[] }> }) => Promise<string | null>;
  openDirectoryDialog: (options: { title: string }) => Promise<string | null>;
  
  // High-Throughput Streaming SHA-256 Hasher (Never blocks UI thread)
  computeFileSHA256: (filePath: string) => Promise<string>;
  
  // OS Shell Integrations
  revealInExplorer: (filePath: string) => Promise<void>;
  unblockFirewall: (port: number) => Promise<{ success: boolean; message: string }>;
  
  // UDP Auto-Discovery Service
  startDiscoveryScan: () => Promise<Array<{ hostname: string; ip: string; port: number; gpu: string }>>;
  
  // Watch Folder Automation
  startWatchFolder: (folderPath: string) => Promise<void>;
  stopWatchFolder: () => Promise<void>;
  onWatchFolderNewFile: (callback: (filePath: string) => void) => void;
}
```

---

### 5.6. TypeScript Data Contracts & Interfaces (`src/types/index.ts`)

```typescript
// Enums matching Python shared/schemas.py
export type JobStatus = 'queued' | 'rendering' | 'completed' | 'failed' | 'cancelled';
export type ResolutionPreset = 'Original' | '720p' | '1080p' | '1440p' | '4K';
export type NvencPreset = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';

export interface HardwareInfo {
  hostname: string;
  os_platform: string;
  cpu_model: string;
  cpu_cores: int;
  cpu_percent: number;
  ram_total_gb: number;
  ram_used_gb: number;
  gpu_detected: boolean;
  gpu_name?: string;
  gpu_vram_total_mb?: number;
  gpu_vram_used_mb?: number;
  gpu_util_percent?: number;
}

export interface HealthResponse {
  status: string;
  protocol_version: string;
  server_time: string;
  ffmpeg: {
    available: boolean;
    version?: string;
    nvenc_available: boolean;
    supported_encoders: string[];
  };
  hardware: HardwareInfo;
  limits: {
    max_upload_size_bytes: number;
    max_concurrent_jobs: number;
    active_jobs: number;
  };
}

export interface ProgressEvent {
  type: 'progress';
  job_id: string;
  status: JobStatus;
  percent: number;
  elapsed_seconds: number;
  eta_seconds?: number;
  speed?: string;
  fps?: number;
  server_telemetry?: {
    cpu_percent: number;
    ram_percent: number;
    ram_used_gb: number;
    ram_total_gb: number;
  };
}

export interface AIPredictResponse {
  predicted_class: string;
  confidence_percent: number;
  top_candidates: Array<{ label: string; probability: number }>;
  inference_latency_ms: number;
  device_used: string;
}
```

---

### 5.7. Bilingual Documentation Architecture & JSON Schema (`shared/docs_content.json`)
The complete documentation dataset is structured into 7 distinct sections available in both English and Roman Urdu:

```json
{
  "en": {
    "title": "System Documentation & User Manual",
    "sections": [
      { "id": "overview", "title": "Why was this project built?", "summary": "...", "points": [ ... ] },
      { "id": "tasks", "title": "5 Task Workflows (Detailed Guide)", "summary": "...", "points": [ ... ] },
      { "id": "verification", "title": "Task Manager 100% Resource Verification", "summary": "...", "points": [ ... ] },
      { "id": "ai_training", "title": "GPUShare AI Training & Google Lens", "summary": "...", "points": [ ... ] },
      { "id": "cable_pairing", "title": "Direct Cable Pairing & Static IP Setup", "summary": "...", "points": [ ... ] },
      { "id": "ui_manual", "title": "UI Page-by-Page Manual", "summary": "...", "points": [ ... ] },
      { "id": "troubleshooting", "title": "FAQs & Troubleshooting", "summary": "...", "points": [ ... ] }
    ]
  },
  "ur": {
    "title": "System Documentation aur User Guide",
    "sections": [ ... ]
  }
}
```

---

## 6. Server-Side Backend Architecture (Python FastAPI)

### 6.1. REST API Specification

| Method | Endpoint | Description | Request Payload | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Hardware telemetry & capabilities | None | `{ status, hardware, ffmpeg, limits }` |
| `GET` | `/api/v1/ping` | Ultra-fast latency check (<1ms) | None | `{ pong: true, timestamp }` |
| `POST` | `/api/v1/jobs` | Submit rendering / compute task | Multipart Form: `file`, `checksum`, `resolution`, `bitrate`, `preset`, `output_filename`, `allow_cpu_fallback` | `JobCreateResponse` (Status: `queued`) |
| `GET` | `/api/v1/jobs/{id}` | Poll job status & progress | None | `JobStatusResponse` |
| `POST` | `/api/v1/jobs/{id}/cancel` | Abort running task subprocess | None | `{ success: true, message }` |
| `GET` | `/api/v1/jobs/{id}/download` | Download output artifact | None | Binary file stream |
| `WS` | `/api/v1/ws/{id}` | Real-time duplex WebSocket stream | WS Handshake | Stream of JSON events (`state`, `progress`, `log`, `error`) |
| `GET` | `/api/v1/ai/status` | AI Hardware & CUDA VRAM info | None | `{ cuda_available, device_name, vram_total_mb, supported_models }` |
| `POST` | `/api/v1/ai/train` | Launch PyTorch background training | Form: `model_arch`, `epochs`, `batch_size`, `learning_rate`, `optimizer`, `use_gpu`, `dataset_path` | `{ success: true, job_id }` |
| `POST` | `/api/v1/ai/cancel` | Cancel active training loop | None | `{ success: true }` |
| `GET` | `/api/v1/ai/progress` | Live training telemetry & logs | None | `{ is_training, stats: { epoch, loss, accuracy, speed_fps, vram_mb }, recent_logs }` |
| `POST` | `/api/v1/ai/predict` | Google Lens Image Inference | Multipart Form: `file` | `{ predicted_class, confidence_percent, top_candidates, inference_latency_ms, device_used }` |
| `POST` | `/api/v1/ai/benchmark` | Comparative CPU vs GPU Speed Test | None | `{ cpu: {...}, gpu: {...}, speedup_multiplier }` |

---

### 6.2. WebSocket Event Protocol (`/api/v1/ws/{job_id}`)

#### Outgoing Messages (Server -> Client):
```json
// Progress Event
{
  "type": "progress",
  "job_id": "job_a1b2c3d4",
  "percent": 45.2,
  "elapsed_sec": 12.4,
  "eta_sec": 15.0,
  "speed": "2.4x",
  "fps": 144.0,
  "cpu_percent": 18.2,
  "ram_used_gb": 12.4,
  "gpu_util_percent": 92.0,
  "gpu_vram_used_mb": 4200
}

// Log Event
{
  "type": "log",
  "job_id": "job_a1b2c3d4",
  "message": "[PyTorch] Epoch 3/10 complete - Loss: 0.1245 | Accuracy: 96.8%"
}

// State Change Event
{
  "type": "state",
  "job_id": "job_a1b2c3d4",
  "status": "completed",
  "output_size_bytes": 104857600,
  "output_checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

---

## 7. Step-by-Step Implementation Roadmap

```
Phase 1: Project Initialization & Shared Harness
  ├── Vite + React 18 + TypeScript + Tailwind CSS setup
  ├── Electron Main and Preload IPC scripts (Dual-Mode: Client & Server)
  └── Electron-Builder packaging configuration (.exe targets)
        │
Phase 2: Network Client, Discovery & State Store
  ├── Axios REST Client with Token Auth
  ├── UDP Auto-Discovery client (Port 8002 listener)
  ├── WebSocket auto-reconnecting client
  └── Zustand Global Stores (Server, Job, AI, ServerNode, Settings)
        │
Phase 3: Client Studio Shell & Navigation
  ├── Responsive Claymorphism Tailwind Theme
  ├── ClientSidebar with 7 Views & bottom NVENC status
  └── ClientTopbar with live latency meter and quick connect
        │
Phase 4: Client Core Views (Dashboard, Settings & Render Jobs)
  ├── Real-time hardware telemetry gauges & Quick Connect bar
  ├── Watch Folder background automation (Chokidar debounce engine)
  ├── Task Profile selector (Video, Batch, Universal zip packaging)
  └── Active Job live progress, gauges & streaming console
        │
Phase 5: Client AI Studio & Google Lens Views
  ├── Sub-tab 1: Remote CNN Training (100k Dataset)
  ├── Sub-tab 2: Google Lens Visual Classifier & sample chips
  ├── Sub-tab 3: Custom Python / AI Script runner
  └── Sub-tab 4: CPU vs GPU comparative benchmark suite
        │
Phase 6: Client Benchmarks & Bilingual Documentation Views
  ├── 5-step hardware rendering benchmark pipeline
  └── English & Roman Urdu docs accordion views (from docs_content.json)
        │
Phase 7: Server Node Desktop Shell & Overview View
  ├── ServerTopbar (Daemon toggle, worker IP, firewall button)
  ├── ServerSidebar (7 views, NVENC status)
  └── ServerOverviewView (5 metric cards, sparkline waves, session totals)
        │
Phase 8: Server Node Operational Views (Queue, GPU, Network, Logs)
  ├── ServerRenderQueueView (Interactive table, search, abort actions)
  ├── ServerGPUEngineView (CUDA profile, 4 wave graphs, codec matrix)
  ├── ServerNetworkView (Adapter cards, active client sessions, copy IP)
  ├── ServerSettingsView (Startup, Render defaults, Storage, Security)
  ├── ServerActivityLogsView (Zero-lag virtualized console, 5 filters)
  └── ServerDocsView (Server admin guide & cable setup)
        │
Phase 9: Packaging & Direct P2P Verification
  ├── Electron binary packaging (`GPURenderStudio.exe` & `GPUWorkerServer.exe`)
  └── Direct Ethernet P2P testing without internet connection
```

---

## 8. Verification & Acceptance Criteria

1. **Hardware Verification:**
   * Laptop CPU remains under 3% while rendering 4K video or training 100k images.
   * Server Task Manager shows `python.exe` / `ffmpeg.exe` consuming 80%-99% GPU compute.
2. **Server Node UI Verification:**
   * All 5 metric cards on Server Overview update live every 1 second.
   * Sparkline waveforms scroll smoothly at 60 FPS without UI stutter.
   * Windows Firewall button executes elevated netsh rule cleanly.
   * Render Queue table allows cancelling tasks in real-time.
3. **Network Resilience & Auto-Discovery:**
   * UDP discovery automatically finds server on Port 8002 within 1.5 seconds.
   * Direct cable connection operates flawlessly at static IP `192.168.99.1` and APIPA `169.254.x.x`.
   * Zero internet connection required; all telemetry and payloads move purely over local LAN.
4. **Universal Task & AI Accuracy:**
   * Zipped project workspaces extract and execute cleanly with custom commands.
   * Google Lens visual classifier delivers <25ms inference latency on remote GPU.
5. **Data Integrity:**
   * Every file uploaded or downloaded matches cryptographic SHA-256 hash. Corrupt transfers are rejected automatically.
