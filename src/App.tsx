import React, { useState, useEffect } from 'react';
import { ClientSidebar, ClientNavView } from './components/client/ClientSidebar.js';
import { ClientTopbar } from './components/client/ClientTopbar.js';
import { ServerSidebar, ServerNavView } from './components/server/ServerSidebar.js';
import { ServerTopbar } from './components/server/ServerTopbar.js';

// Client Views (7 Views)
import { DashboardView } from './views/client/DashboardView.js';
import { RenderJobView } from './views/client/RenderJobView.js';
import { ActiveJobView } from './views/client/ActiveJobView.js';
import { AIStudioView } from './views/client/AIStudioView.js';
import { BenchmarksView } from './views/client/BenchmarksView.js';
import { SettingsView } from './views/client/SettingsView.js';
import { DocsView } from './views/client/DocsView.js';

// Server Views (7 Views)
import { ServerOverviewView } from './views/server/ServerOverviewView.js';
import { ServerRenderQueueView } from './views/server/ServerRenderQueueView.js';
import { ServerGPUEngineView } from './views/server/ServerGPUEngineView.js';
import { ServerNetworkView } from './views/server/ServerNetworkView.js';
import { ServerSettingsView } from './views/server/ServerSettingsView.js';
import { ServerActivityLogsView } from './views/server/ServerActivityLogsView.js';
import { ServerDocsView } from './views/server/ServerDocsView.js';

export const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'client' | 'server'>('client');
  const [clientView, setClientView] = useState<ClientNavView>('dashboard');
  const [serverView, setServerView] = useState<ServerNavView>('server_overview');

  useEffect(() => {
    // Check URL search parameters first (?mode=server or ?mode=client)
    const urlParams = new URLSearchParams(window.location.search);
    const queryMode = urlParams.get('mode');
    if (queryMode === 'server' || queryMode === 'client') {
      setAppMode(queryMode);
      return;
    }

    // Otherwise detect from Electron main process
    if (window.electronAPI?.getAppMode) {
      window.electronAPI.getAppMode().then((mode) => {
        if (mode === 'server' || mode === 'client') {
          setAppMode(mode);
        }
      }).catch(() => {
        setAppMode('client');
      });
    }
  }, []);

  const getClientPageTitle = () => {
    switch (clientView) {
      case 'dashboard': return 'GPUShare • Dashboard Overview';
      case 'render_job': return 'GPUShare • Video & Workspace Task Offloading';
      case 'active_job': return 'GPUShare • Live Monitor & Console Stream';
      case 'ai_studio': return 'GPUShare • Deep Learning & Vision Studio';
      case 'benchmarks': return 'GPUShare • Hardware Speedup Benchmark Suite';
      case 'settings': return 'GPUShare • Host Connection & Storage Settings';
      case 'docs': return 'GPUShare • Bilingual Documentation & Manual';
      default: return 'GPUShare Studio';
    }
  };

  // -------------------------------------------------------------
  // 🖥️ WORKER SERVER NODE APPLICATION (Friend's GPU Desktop)
  // -------------------------------------------------------------
  if (appMode === 'server') {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-slate-900 font-sans text-slate-100">
        <ServerSidebar currentView={serverView} onNavigate={setServerView} />

        <main className="flex-1 flex flex-col min-w-0 bg-slate-900">
          <ServerTopbar />

          <div className="flex-1 overflow-hidden">
            {serverView === 'server_overview' && <ServerOverviewView />}
            {serverView === 'render_queue' && <ServerRenderQueueView />}
            {serverView === 'gpu_engine' && <ServerGPUEngineView />}
            {serverView === 'network' && <ServerNetworkView />}
            {serverView === 'server_settings' && <ServerSettingsView />}
            {serverView === 'activity_logs' && <ServerActivityLogsView />}
            {serverView === 'server_docs' && <ServerDocsView />}
          </div>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 💻 CLIENT STUDIO APPLICATION (User's Laptop)
  // -------------------------------------------------------------
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      <ClientSidebar currentView={clientView} onNavigate={setClientView} />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <ClientTopbar 
          pageTitle={getClientPageTitle()} 
          onNavigateToJob={() => setClientView('active_job')} 
        />

        <div className="flex-1 overflow-hidden">
          {clientView === 'dashboard' && <DashboardView onNavigate={setClientView} />}
          {clientView === 'render_job' && <RenderJobView onJobSubmitted={() => setClientView('active_job')} />}
          {clientView === 'active_job' && <ActiveJobView />}
          {clientView === 'ai_studio' && <AIStudioView />}
          {clientView === 'benchmarks' && <BenchmarksView />}
          {clientView === 'settings' && <SettingsView />}
          {clientView === 'docs' && <DocsView />}
        </div>
      </main>
    </div>
  );
};

export default App;
