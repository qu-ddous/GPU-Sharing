import React, { useState } from 'react';
import { ClientSidebar, ClientNavView } from './components/client/ClientSidebar.js';
import { ClientTopbar } from './components/client/ClientTopbar.js';

// All Views
import { DashboardView } from './views/client/DashboardView.js';
import { RenderJobView } from './views/client/RenderJobView.js';
import { ActiveJobView } from './views/client/ActiveJobView.js';
import { AIStudioView } from './views/client/AIStudioView.js';
import { BenchmarksView } from './views/client/BenchmarksView.js';
import { SettingsView } from './views/client/SettingsView.js';
import { DocsView } from './views/client/DocsView.js';
import { ServerOverviewView } from './views/server/ServerOverviewView.js';
import { ServerRenderQueueView } from './views/server/ServerRenderQueueView.js';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ClientNavView>('dashboard');

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'GPUShare • Dashboard Overview';
      case 'render_job': return 'GPUShare • Video & Workspace Task Offloading';
      case 'active_job': return 'GPUShare • Live Monitor & Console Stream';
      case 'ai_studio': return 'GPUShare • AI Training & Google Lens Studio';
      case 'benchmarks': return 'GPUShare • Hardware Speedup Benchmark Suite';
      case 'server_overview': return 'GPUShare • Dedicated GPU Worker Node Monitor';
      case 'server_queue': return 'GPUShare • Remote Render Queue & Priority';
      case 'settings': return 'GPUShare • Host Connection & Storage Settings';
      case 'docs': return 'GPUShare • Bilingual Documentation & Manual';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      <ClientSidebar currentView={currentView} onNavigate={setCurrentView} />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <ClientTopbar 
          pageTitle={getPageTitle()} 
          onNavigateToJob={() => setCurrentView('active_job')} 
        />

        <div className="flex-1 overflow-hidden">
          {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
          {currentView === 'render_job' && <RenderJobView onJobSubmitted={() => setCurrentView('active_job')} />}
          {currentView === 'active_job' && <ActiveJobView />}
          {currentView === 'ai_studio' && <AIStudioView />}
          {currentView === 'benchmarks' && <BenchmarksView />}
          {currentView === 'server_overview' && <ServerOverviewView />}
          {currentView === 'server_queue' && <ServerRenderQueueView />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'docs' && <DocsView />}
        </div>
      </main>
    </div>
  );
};

export default App;
