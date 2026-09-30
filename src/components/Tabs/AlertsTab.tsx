import React, { useState } from 'react';
import { ACTIVE_ALERTS, ASSETS } from '../../data/scenario';
import type { InfrastructureAsset, RiskLevel } from '../../data/scenario';
import { ArrowRight, Clock } from 'lucide-react';

interface AlertsTabProps {
  onSelectAlertAsset: (asset: InfrastructureAsset) => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({ onSelectAlertAsset }) => {
  const [filterSeverity, setFilterSeverity] = useState<RiskLevel | 'ALL'>('ALL');

  const filteredAlerts = ACTIVE_ALERTS.filter(alert => {
    return filterSeverity === 'ALL' || alert.severity === filterSeverity;
  });

  return (
    <div className="flex-1 bg-slate-100 p-6 overflow-y-auto space-y-6 select-none">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Emergency Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized tactical warning bulletins for disaster management teams.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-red-100 border border-red-200 rounded-full text-xs font-bold text-red-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          {ACTIVE_ALERTS.length} Active System Bulletins
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE'] as const).map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
              filterSeverity === sev
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {sev === 'ALL' ? 'All Alerts' : `${sev} Severity`}
          </button>
        ))}
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-4 max-w-4xl">
        {filteredAlerts.map(alert => {
          const targetAsset = ASSETS.find(a => a.id === alert.assetId);

          return (
            <div
              key={alert.id}
              className={`p-6 bg-white rounded-2xl border transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row justify-between gap-6 ${
                alert.severity === 'CRITICAL' ? 'border-red-200 border-l-4 border-l-red-600' : 'border-slate-200 border-l-4 border-l-orange-500'
              }`}
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {alert.severity} SEVERITY
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock size={12} /> {alert.timestamp}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{alert.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {alert.message}
                </p>

                <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed font-medium">
                  <strong className="text-blue-700 block text-[10px] uppercase font-bold mb-0.5">Recommended Action:</strong>
                  <span>{alert.actionRequired}</span>
                </div>
              </div>

              {targetAsset && (
                <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[200px]">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Facility</span>
                    <strong className="text-sm font-extrabold text-slate-900 block">{targetAsset.name}</strong>
                    <span className="text-xs text-slate-500 block mt-0.5">{targetAsset.type} • {targetAsset.address}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 w-full">
                    <button
                      onClick={() => onSelectAlertAsset(targetAsset)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      Locate on Map <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
