import React, { useState } from 'react';
import { DEMO_SCENARIO, ASSETS } from '../data/scenario';
import { Wind, ShieldAlert, Clock, AlertCircle, Waves, CloudRain, RefreshCw, Download, CheckCircle } from 'lucide-react';

export const HeaderKPI: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reportExported, setReportExported] = useState(false);

  const criticalCount = ASSETS.filter(a => a.riskLevel === 'CRITICAL' || a.riskLevel === 'HIGH').length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleExport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 2500);
  };

  return (
    <div className="bg-slate-50 border-b border-slate-200/80 shrink-0 select-none">
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
        {/* Left Scenario Info */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Cyclone VEER</h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold border border-red-200 uppercase tracking-wider">
                Active Scenario
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {DEMO_SCENARIO.category} • Visakhapatnam Coastal Sector
            </p>
          </div>
        </div>

        {/* Right Actions & Simulation Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Simulation Mode</span>
            <span className="text-amber-400">•</span>
            <span className="text-amber-700">Demo Scenario</span>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* Useful Action Buttons */}
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            {reportExported ? <CheckCircle size={13} /> : <Download size={13} />}
            <span>{reportExported ? 'Exported PDF' : 'Export Report'}</span>
          </button>
        </div>
      </header>

      {/* KPI Cards Row */}
      <div className="p-4 px-6 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-3.5 min-w-max">
          {/* 1. Active Cyclone */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 px-4 shadow-sm hover:shadow transition-all w-48 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>Active Cyclone</span>
              <span className="w-2 h-2 rounded-full bg-red-500" />
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block">VEER</span>
              <span className="text-[11px] font-semibold text-slate-500 block">Extremely Severe</span>
            </div>
          </div>

          {/* 2. Peak Wind */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 px-4 shadow-sm hover:shadow transition-all w-48 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>Peak Wind</span>
              <Wind size={15} className="text-blue-500" />
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block">{DEMO_SCENARIO.windSpeed}</span>
              <span className="text-[11px] font-semibold text-blue-600 block">Category 4 Equivalent</span>
            </div>
          </div>

          {/* 3. Regional Risk */}
          <div className="bg-white border border-red-200/80 bg-gradient-to-br from-white to-red-50/30 rounded-xl p-3.5 px-4 shadow-sm hover:shadow transition-all w-48 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>Regional Risk</span>
              <ShieldAlert size={15} className="text-red-500" />
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">0.94</span>
                <span className="text-[11px] font-bold text-red-600 uppercase">CRITICAL</span>
              </div>
              <span className="text-[11px] font-semibold text-red-600/80 block">Extreme Exposure</span>
            </div>
          </div>

          {/* 4. Landfall ETA */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 px-4 shadow-sm hover:shadow transition-all w-48 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>Landfall</span>
              <Clock size={15} className="text-amber-500" />
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-extrabold text-amber-600 tracking-tight block">{DEMO_SCENARIO.landfallETA}</span>
              <span className="text-[11px] font-semibold text-slate-500 block">Estimated ETA</span>
            </div>
          </div>

          {/* 5. Exposed Assets */}
          <div className="bg-white border border-orange-200/80 rounded-xl p-3.5 px-4 shadow-sm hover:shadow transition-all w-48 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>Exposed Assets</span>
              <AlertCircle size={15} className="text-orange-500" />
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-orange-600">{criticalCount} / {ASSETS.length}</span>
                <span className="text-[11px] font-bold text-orange-600 uppercase">High Risk</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 block">Lifeline Facilities</span>
            </div>
          </div>

          {/* 6. Peak Surge */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 px-4 shadow-sm hover:shadow transition-all w-48 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>Peak Surge</span>
              <Waves size={15} className="text-cyan-500" />
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block">{DEMO_SCENARIO.stormSurgeHeight}</span>
              <span className="text-[11px] font-semibold text-cyan-600 block">Coastal Inundation</span>
            </div>
          </div>

          {/* 7. Expected Rainfall */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 px-4 shadow-sm hover:shadow transition-all w-48 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>Expected Rain</span>
              <CloudRain size={15} className="text-indigo-500" />
            </div>
            <div className="mt-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block">{DEMO_SCENARIO.avgRainfall}</span>
              <span className="text-[11px] font-semibold text-indigo-600 block">24h Forecast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
