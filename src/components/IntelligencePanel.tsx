import React, { useState } from 'react';
import type { InfrastructureAsset, HazardPolygon } from '../data/scenario';
import { HAZARD_POLYGONS } from '../data/scenario';
import type { AIAssessmentResult } from '../services/aiService';
import { Activity, Sparkles, Cpu, X, FileText, ChevronRight, AlertCircle, Zap, Truck, Navigation } from 'lucide-react';

interface IntelligencePanelProps {
  asset: InfrastructureAsset | null;
  zone: HazardPolygon | null;
  assessment: AIAssessmentResult | null;
  isLoading: boolean;
  onClose: () => void;
  onSelectZone: (zone: HazardPolygon) => void;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  asset,
  zone,
  assessment,
  isLoading,
  onClose,
  onSelectZone
}) => {
  const [noticeGenerated, setNoticeGenerated] = useState(false);

  // If no asset is selected, show prompt or selected hazard polygon info
  if (!asset) {
    if (zone) {
      return (
        <aside className="w-[380px] bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full overflow-y-auto shrink-0 select-none">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-start justify-between">
            <div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                zone.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                zone.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {zone.riskLevel} SEVERITY
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-2">{zone.name}</h2>
              <p className="text-xs text-slate-500">{zone.hazardType} Sector</p>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-6 flex-1 text-xs">
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pb-5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Model Confidence</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{zone.confidence}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Affected Area</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{zone.affectedAreaKm2.toLocaleString()} km²</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exposed Assets</span>
                <span className="text-sm font-extrabold text-red-600 mt-0.5 block">{zone.exposedInfrastructureCount} Facilities</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hazard Type</span>
                <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{zone.hazardType}</span>
              </div>
            </div>

            {/* Zone Dynamics */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Zone Dynamics</h3>
              <p className="text-slate-700 leading-relaxed font-normal text-xs">
                {zone.description}
              </p>
            </div>

            {/* Operational Advice */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Operational Advice</h3>
              <p className="text-slate-700 leading-relaxed font-normal text-xs">
                Select specific infrastructure markers inside this sector to view AI vulnerability reasoning and pre-landfall mitigation steps.
              </p>
            </div>
          </div>
        </aside>
      );
    }

    return (
      <aside className="w-[380px] bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full items-center justify-center p-8 text-center shrink-0 select-none">
        <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-3 text-blue-600">
          <Activity size={24} />
        </div>
        <h3 className="font-extrabold text-slate-900 text-base">AI Risk Intelligence</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs">
          Select an infrastructure marker or hazard sector on the map to inspect AI vulnerability scores and tactical recommendations.
        </p>
      </aside>
    );
  }

  const parentZone = HAZARD_POLYGONS.find(z => z.id === asset.zoneId);
  const actionIcons = [Zap, Truck, Navigation];

  return (
    <aside className="w-[380px] bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full overflow-y-auto shrink-0 select-none">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} /> AI Risk Intelligence
          </span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-start justify-between gap-2 mt-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">{asset.name}</h2>
          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
            asset.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {asset.riskLevel} RISK
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-1">{asset.type} • {asset.address}</p>

        {parentZone && (
          <button
            onClick={() => onSelectZone(parentZone)}
            className="mt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Sector: {parentZone.name}</span> <ChevronRight size={12} />
          </button>
        )}
      </div>

      <div className="p-5 space-y-6 flex-1 text-xs">
        {/* RISK SCORE (Visual Circular Ring Score Display) */}
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">Risk Score</span>
          <div className="flex items-center gap-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {/* Ring Chart */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={asset.vulnerabilityScore > 0.8 ? 'text-red-600' : 'text-orange-500'}
                  strokeDasharray={`${Math.round(asset.vulnerabilityScore * 100)}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-black text-sm text-slate-900">{Math.round(asset.vulnerabilityScore * 100)}%</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Pop. Served</span>
                <strong className="text-slate-800 font-bold">{asset.populationServed.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Elevation</span>
                <strong className="text-slate-800 font-bold">{asset.elevationMeters}m MSL</strong>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Backup Power</span>
                <strong className={`font-bold ${asset.backupPower ? 'text-emerald-600' : 'text-red-600'}`}>
                  {asset.backupPower ? 'Available' : 'None Available'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* AI STATUS INDICATOR (Subtle status line) */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            {assessment?.source === 'GEMINI_AI' ? <Sparkles size={13} className="text-blue-600" /> : <Cpu size={13} className="text-amber-500" />}
            <span className="font-semibold uppercase tracking-wider">
              {assessment?.source === 'GEMINI_AI' ? 'Gemini AI Assessment' : 'Rule Engine Assessment'}
            </span>
          </div>
          {assessment?.source === 'GEMINI_AI' && (
            <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">LIVE</span>
          )}
        </div>

        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Synthesizing intelligence report...</span>
          </div>
        ) : assessment ? (
          <div className="space-y-5">
            {/* Fallback Warning Badge */}
            {assessment.fallbackNotice && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-lg flex items-start gap-2 leading-tight">
                <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                <span>AI reasoning unavailable — displaying deterministic rule-based operational assessment.</span>
              </div>
            )}

            {/* WHY VULNERABLE */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Why Vulnerable</h3>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {asset.factors.map((factor, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-md text-[11px] border border-slate-200">
                    {factor}
                  </span>
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                {assessment.explanation}
              </p>
            </div>

            {/* POTENTIAL IMPACT */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1.5">Potential Impact</h3>
              <p className="text-slate-700 leading-relaxed text-xs">
                {assessment.consequence}
              </p>
            </div>

            {/* TACTICAL PRIORITY */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Tactical Priority</h3>
              <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl text-blue-900 leading-relaxed text-xs font-medium">
                {assessment.priorityReason}
              </div>
            </div>

            {/* RECOMMENDED ACTIONS (Three Individual Cards with Breathing Room) */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">Recommended Actions</h3>
              <div className="space-y-3">
                {assessment.recommendations.map((rec, i) => {
                  const Icon = actionIcons[i % actionIcons.length];
                  return (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        0{i + 1}
                      </span>
                      <div>
                        <div className="text-slate-900 font-bold text-xs flex items-center gap-1.5 mb-0.5">
                          <Icon size={13} className="text-blue-600" />
                          <span>Action Step 0{i + 1}</span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">{rec}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Prominent Primary Action Button */}
      <div className="p-5 border-t border-slate-100 bg-white">
        {noticeGenerated ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center justify-between">
            <span>Emergency Warning Dispatched</span>
            <button onClick={() => setNoticeGenerated(false)} className="text-[10px] underline">Reset</button>
          </div>
        ) : (
          <button
            onClick={() => setNoticeGenerated(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <FileText size={16} /> Generate Emergency Warning
          </button>
        )}
      </div>
    </aside>
  );
};
