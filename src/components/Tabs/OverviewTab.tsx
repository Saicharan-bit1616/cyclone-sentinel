import React from 'react';
import { SatelliteMap } from '../SatelliteMap';
import { IntelligencePanel } from '../IntelligencePanel';
import type { InfrastructureAsset, HazardPolygon } from '../../data/scenario';
import { DEMO_SCENARIO, ACTIVE_ALERTS, ASSETS } from '../../data/scenario';
import type { AIAssessmentResult } from '../../services/aiService';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
  PieChart, Pie, Cell
} from 'recharts';
import { Activity, ShieldAlert, ArrowRight, Clock, ExternalLink, BarChart3, PieChart as PieIcon } from 'lucide-react';

interface OverviewTabProps {
  selectedAsset: InfrastructureAsset | null;
  selectedZone: HazardPolygon | null;
  assessment: AIAssessmentResult | null;
  isLoadingAssessment: boolean;
  onSelectAsset: (asset: InfrastructureAsset) => void;
  onSelectZone: (zone: HazardPolygon) => void;
  onClosePanel: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  selectedAsset,
  selectedZone,
  assessment,
  isLoadingAssessment,
  onSelectAsset,
  onSelectZone,
  onClosePanel
}) => {
  // Chart Data: Hazard Distribution
  const hazardDistribution = [
    { name: 'Storm Surge', value: 420, color: '#dc2626' },
    { name: 'Flash Flood', value: 780, color: '#ea580c' },
    { name: 'Heavy Rainfall', value: 1250, color: '#ca8a04' }
  ];

  return (
    <div className="flex-1 bg-slate-100 overflow-y-auto p-6 space-y-6 select-none">
      {/* Top Main View: Hero Satellite Map + Right AI Risk Intelligence Panel */}
      <div className="flex flex-col lg:flex-row gap-6 h-[640px] shrink-0">
        {/* Hero Map Container */}
        <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <SatelliteMap
            selectedAsset={selectedAsset}
            selectedZone={selectedZone}
            onSelectAsset={onSelectAsset}
            onSelectZone={onSelectZone}
          />
        </div>

        {/* Right AI Intelligence Panel */}
        <IntelligencePanel
          asset={selectedAsset}
          zone={selectedZone}
          assessment={assessment}
          isLoading={isLoadingAssessment}
          onClose={onClosePanel}
          onSelectZone={onSelectZone}
        />
      </div>

      {/* Row 2: 72-Hour Risk Trend Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Impact Forecast</span>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-red-500" />
              <span>72-Hour Risk Projection & Inundation Trend</span>
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Risk Index</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-amber-500" /> Warning (0.6)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-red-600" /> Critical (0.8)</span>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DEMO_SCENARIO.riskTrend}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 1.0]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(val: any) => [`${(Number(val) * 100).toFixed(0)}% Vulnerability`, 'Risk Rating']}
              />
              <ReferenceLine y={0.6} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'Warning 60%', fill: '#ca8a04', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={0.8} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'Critical 80%', fill: '#dc2626', fontSize: 10, position: 'right' }} />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="#dc2626"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#riskGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Active Alerts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts (Col Span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-600" />
              <span>Active Emergency Alerts</span>
            </h3>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
              {ACTIVE_ALERTS.length} Bulletins Active
            </span>
          </div>

          <div className="space-y-3">
            {ACTIVE_ALERTS.slice(0, 3).map(alert => {
              const targetAsset = ASSETS.find(a => a.id === alert.assetId);

              return (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> {alert.timestamp}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                    <p className="text-xs text-slate-600 leading-snug line-clamp-1">{alert.message}</p>
                  </div>

                  {targetAsset && (
                    <button
                      onClick={() => onSelectAsset(targetAsset)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm shrink-0 flex items-center gap-1 transition-all"
                    >
                      Locate on Map <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Visualizations: Hazard Distribution Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <PieIcon size={18} className="text-indigo-600" />
              <span>Hazard Inundation Area</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">km²</span>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hazardDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {hazardDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                  formatter={(val: any) => [`${val} km²`, 'Affected Area']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold text-slate-600 pt-2 border-t border-slate-100">
            <div>
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block mr-1" /> Surge
            </div>
            <div>
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block mr-1" /> Flood
            </div>
            <div>
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block mr-1" /> Rain
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Top Priority Infrastructure Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-600" />
            <span>Top Priority Infrastructure Exposure</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">Ordered by Vulnerability Index</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ASSETS.slice(0, 4).map(asset => (
            <div
              key={asset.id}
              className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{asset.type}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    asset.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {asset.riskLevel}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-sm">{asset.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{asset.address}</p>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span>Vulnerability</span>
                    <span className="text-red-600">{Math.round(asset.vulnerabilityScore * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${asset.vulnerabilityScore * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectAsset(asset)}
                className="mt-4 w-full py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1 transition-all"
              >
                Analyze <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
