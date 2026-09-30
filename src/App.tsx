import React, { useState } from 'react';
import {
  Activity, Map as MapIcon, Shield, AlertTriangle, Info, ChevronRight
} from 'lucide-react';
import { HeaderKPI } from './components/HeaderKPI';
import { OverviewTab } from './components/Tabs/OverviewTab';
import { RiskMapTab } from './components/Tabs/RiskMapTab';
import { InfrastructureTab } from './components/Tabs/InfrastructureTab';
import { AlertsTab } from './components/Tabs/AlertsTab';
import { ASSETS, HAZARD_POLYGONS } from './data/scenario';
import type { InfrastructureAsset, HazardPolygon } from './data/scenario';
import { getAIAssessment } from './services/aiService';
import type { AIAssessmentResult } from './services/aiService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Risk Map' | 'Infrastructure' | 'Alerts'>('Overview');
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(ASSETS[0]);
  const [selectedZone, setSelectedZone] = useState<HazardPolygon | null>(null);
  const [assessment, setAssessment] = useState<AIAssessmentResult | null>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState<boolean>(false);

  // Initial load assessment for default asset
  React.useEffect(() => {
    if (selectedAsset && !assessment) {
      handleAssetSelect(selectedAsset);
    }
  }, []);

  const handleAssetSelect = async (asset: InfrastructureAsset) => {
    setSelectedAsset(asset);
    setSelectedZone(null);
    setIsLoadingAssessment(true);
    try {
      const matchingZone = HAZARD_POLYGONS.find(z => z.id === asset.zoneId);
      const result = await getAIAssessment(asset, matchingZone);
      setAssessment(result);
    } catch (err) {
      console.error('Failed to get assessment:', err);
    } finally {
      setIsLoadingAssessment(false);
    }
  };

  const handleZoneSelect = (zone: HazardPolygon) => {
    setSelectedZone(zone);
    setSelectedAsset(null);
    setAssessment(null);
  };

  const handleSelectAlertAsset = (asset: InfrastructureAsset) => {
    handleAssetSelect(asset);
    setActiveTab('Overview');
  };

  const handleSelectInfrastructureAsset = (asset: InfrastructureAsset) => {
    handleAssetSelect(asset);
    setActiveTab('Overview');
  };

  const handleClosePanel = () => {
    setSelectedAsset(null);
    setSelectedZone(null);
    setAssessment(null);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden select-none">
      {/* Polished White Sidebar (~240px) */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Branding Header */}
        <div className="p-5 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0">
              🌀
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">CYCLONE SENTINEL</h1>
              <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">AI Disaster Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-3.5 space-y-6 overflow-y-auto">
          {/* Section: MONITOR */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Monitor
            </div>
            <div className="space-y-1">
              {[
                { name: 'Overview', icon: Activity },
                { name: 'Risk Map', icon: MapIcon }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name as any)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: ANALYZE */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Analyze
            </div>
            <div className="space-y-1">
              {[
                { name: 'Infrastructure', icon: Shield },
                { name: 'Alerts', icon: AlertTriangle }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name as any)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: SYSTEM QUICK ACTION */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              System
            </div>
            <button
              onClick={() => {
                if (ASSETS.length > 0) handleAssetSelect(ASSETS[0]);
                setActiveTab('Overview');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Info size={15} className="text-slate-400" />
              <span>Hospital AI Audit</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer Status */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>System Operational</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Simulation Mode Active</span>
        </div>
      </aside>

      {/* Main Responsive Dashboard Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Telemetry */}
        <HeaderKPI />

        {/* Tab Content Views */}
        {activeTab === 'Overview' && (
          <OverviewTab
            selectedAsset={selectedAsset}
            selectedZone={selectedZone}
            assessment={assessment}
            isLoadingAssessment={isLoadingAssessment}
            onSelectAsset={handleAssetSelect}
            onSelectZone={handleZoneSelect}
            onClosePanel={handleClosePanel}
          />
        )}

        {activeTab === 'Risk Map' && (
          <RiskMapTab
            selectedAsset={selectedAsset}
            selectedZone={selectedZone}
            assessment={assessment}
            isLoadingAssessment={isLoadingAssessment}
            onSelectAsset={handleAssetSelect}
            onSelectZone={handleZoneSelect}
            onClosePanel={handleClosePanel}
          />
        )}

        {activeTab === 'Infrastructure' && (
          <InfrastructureTab
            onSelectAssetAndJumpToMap={handleSelectInfrastructureAsset}
          />
        )}

        {activeTab === 'Alerts' && (
          <AlertsTab
            onSelectAlertAsset={handleSelectAlertAsset}
          />
        )}
      </main>
    </div>
  );
}
