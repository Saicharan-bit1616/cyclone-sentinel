import React, { useState } from 'react';
import { ASSETS } from '../../data/scenario';
import type { InfrastructureAsset, AssetType, RiskLevel } from '../../data/scenario';
import { Search, MapPin, ExternalLink, Shield } from 'lucide-react';

interface InfrastructureTabProps {
  onSelectAssetAndJumpToMap: (asset: InfrastructureAsset) => void;
}

export const InfrastructureTab: React.FC<InfrastructureTabProps> = ({ onSelectAssetAndJumpToMap }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<AssetType | 'ALL'>('ALL');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'ALL'>('ALL');

  const categories: { label: string; value: AssetType | 'ALL' }[] = [
    { label: 'All Assets', value: 'ALL' },
    { label: 'Hospitals', value: 'Hospital' },
    { label: 'Power', value: 'Power' },
    { label: 'Roads', value: 'Road' },
    { label: 'Shelters', value: 'Shelter' },
    { label: 'Water', value: 'Water' }
  ];

  const filteredAssets = ASSETS.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || asset.type === filterType;
    const matchesRisk = filterRisk === 'ALL' || asset.riskLevel === filterRisk;
    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <div className="flex-1 bg-slate-100 p-6 overflow-y-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Infrastructure Inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of critical lifeline assets exposed to Cyclone VEER impact zones.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Showing {filteredAssets.length} of {ASSETS.length} Assets
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search infrastructure by name, ID, or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center justify-between gap-4 pt-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setFilterType(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === cat.value
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Risk Level:</span>
            <select
              value={filterRisk}
              onChange={e => setFilterRisk(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">All Levels</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MODERATE">Moderate Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map(asset => (
          <div
            key={asset.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-blue-400 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Shield size={13} className="text-blue-600" />
                  <span>{asset.id} • {asset.type}</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  asset.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                  asset.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {asset.riskLevel}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{asset.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" /> {asset.address}
              </p>

              {/* Vulnerability Meter */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Vulnerability Score</span>
                  <span className="text-red-600">{Math.round(asset.vulnerabilityScore * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${asset.vulnerabilityScore * 100}%` }}
                  />
                </div>
              </div>

              {/* Factors */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {asset.factors.map((f, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                    • {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Pop. Served: <strong className="text-slate-800 font-bold">{asset.populationServed.toLocaleString()}</strong>
              </span>
              <button
                onClick={() => onSelectAssetAndJumpToMap(asset)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                View on Map <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
