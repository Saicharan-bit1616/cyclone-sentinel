import React from 'react';
import { SatelliteMap } from '../SatelliteMap';
import { IntelligencePanel } from '../IntelligencePanel';
import type { InfrastructureAsset, HazardPolygon } from '../../data/scenario';
import { HAZARD_POLYGONS } from '../../data/scenario';
import type { AIAssessmentResult } from '../../services/aiService';
import { ShieldAlert, Waves, CloudRain } from 'lucide-react';

interface RiskMapTabProps {
  selectedAsset: InfrastructureAsset | null;
  selectedZone: HazardPolygon | null;
  assessment: AIAssessmentResult | null;
  isLoadingAssessment: boolean;
  onSelectAsset: (asset: InfrastructureAsset) => void;
  onSelectZone: (zone: HazardPolygon) => void;
  onClosePanel: () => void;
}

export const RiskMapTab: React.FC<RiskMapTabProps> = ({
  selectedAsset,
  selectedZone,
  assessment,
  isLoadingAssessment,
  onSelectAsset,
  onSelectZone,
  onClosePanel
}) => {
  const hazardIcons = [Waves, CloudRain, ShieldAlert];

  return (
    <div className="flex-1 bg-slate-100 p-6 overflow-y-auto space-y-6 select-none">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Geospatial Risk Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Satellite-based cyclone impact analysis and spatial hazard vulnerability modeling.
          </p>
        </div>
      </div>

      {/* Main Large Satellite Map Workspace + Floating Intelligence Panel */}
      <div className="flex flex-col lg:flex-row gap-6 h-[660px]">
        <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <SatelliteMap
            selectedAsset={selectedAsset}
            selectedZone={selectedZone}
            onSelectAsset={onSelectAsset}
            onSelectZone={onSelectZone}
          />
        </div>

        {(selectedAsset || selectedZone) && (
          <IntelligencePanel
            asset={selectedAsset}
            zone={selectedZone}
            assessment={assessment}
            isLoading={isLoadingAssessment}
            onClose={onClosePanel}
            onSelectZone={onSelectZone}
          />
        )}
      </div>

      {/* Hazard Summary Cards Row */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldAlert size={18} className="text-blue-600" />
          <span>Active Hazard Sectors & Summary</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HAZARD_POLYGONS.map((zone, i) => {
            const Icon = hazardIcons[i % hazardIcons.length];

            return (
              <div
                key={zone.id}
                onClick={() => onSelectZone(zone)}
                className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                  selectedZone?.id === zone.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    zone.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    zone.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {zone.riskLevel} RISK
                  </span>
                  <Icon size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{zone.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{zone.description}</p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Affected Area</span>
                    <strong className="text-slate-800 font-bold">{zone.affectedAreaKm2.toLocaleString()} km²</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Exposed</span>
                    <strong className="text-red-600 font-bold">{zone.exposedInfrastructureCount} Facilities</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Precision</span>
                    <strong className="text-emerald-600 font-bold">{zone.confidence.split(' ')[0]}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
