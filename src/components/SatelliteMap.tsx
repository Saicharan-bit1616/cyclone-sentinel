import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEMO_SCENARIO, HAZARD_POLYGONS, ASSETS } from '../data/scenario';
import type { InfrastructureAsset, HazardPolygon, RiskLevel, AssetType } from '../data/scenario';
import { Layers, Eye, EyeOff } from 'lucide-react';

// Custom Markers Generator
function createCustomIcon(type: AssetType, risk: RiskLevel, isSelected: boolean) {
  let color = '#16a34a'; // default green
  switch (risk) {
    case 'CRITICAL': color = '#dc2626'; break;
    case 'HIGH': color = '#ea580c'; break;
    case 'MODERATE': color = '#ca8a04'; break;
    case 'LOW': color = '#16a34a'; break;
  }

  let symbol = '📍';
  if (type === 'Hospital') symbol = '🏥';
  else if (type === 'Power') symbol = '⚡';
  else if (type === 'Road') symbol = '🛣️';
  else if (type === 'Shelter') symbol = '🛡️';
  else if (type === 'Water') symbol = '💧';

  const scale = isSelected ? 'marker-selected-glow scale-125 z-50 ring-2 ring-white shadow-xl' : 'hover:scale-110';

  const svgHtml = `
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white transition-all duration-300 transform ${scale}" style="background-color: ${color}; box-shadow: 0 4px 12px rgba(15,23,42,0.35);">
      <span class="text-xs select-none">${symbol}</span>
      ${isSelected ? `<div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 border border-white rounded-full animate-ping"></div>` : ''}
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}

// Storm Eye Pulsing Marker
function createStormEyeIcon() {
  const svgHtml = `
    <div class="relative flex items-center justify-center w-9 h-9">
      <div class="absolute w-9 h-9 bg-red-500/40 rounded-full animate-ping"></div>
      <div class="relative w-7 h-7 bg-red-600 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
        <span class="text-white font-bold text-xs select-none">🌀</span>
      </div>
    </div>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'storm-eye-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

// Map Auto-Fly controller
function MapController({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), { duration: 1.2, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
}

interface SatelliteMapProps {
  selectedAsset: InfrastructureAsset | null;
  selectedZone: HazardPolygon | null;
  onSelectAsset: (asset: InfrastructureAsset) => void;
  onSelectZone: (zone: HazardPolygon) => void;
}

export const SatelliteMap: React.FC<SatelliteMapProps> = ({
  selectedAsset,
  selectedZone,
  onSelectAsset,
  onSelectZone
}) => {
  const [basemap, setBasemap] = useState<'satellite' | 'street' | 'dark'>('satellite');
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEMO_SCENARIO.center);
  const [mapZoom, setMapZoom] = useState<number>(9.5);

  // Layer Toggles
  const [showHazards, setShowHazards] = useState(true);
  const [showTrack, setShowTrack] = useState(true);
  const [showCone, setShowCone] = useState(true);
  const [showAssets, setShowAssets] = useState(true);

  // Sync center when asset or zone is selected
  useEffect(() => {
    if (selectedAsset) {
      setMapCenter(selectedAsset.position);
      setMapZoom(12.5);
    } else if (selectedZone && selectedZone.coordinates.length > 0) {
      setMapCenter(selectedZone.coordinates[0]);
      setMapZoom(10.5);
    } else {
      setMapCenter(DEMO_SCENARIO.center);
      setMapZoom(9.5);
    }
  }, [selectedAsset, selectedZone]);

  const tileUrls = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const getPolygonColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL': return '#dc2626';
      case 'HIGH': return '#ea580c';
      case 'MODERATE': return '#ca8a04';
      case 'LOW': return '#16a34a';
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <MapContainer
        center={DEMO_SCENARIO.center}
        zoom={9.5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Tile Layer */}
        <TileLayer
          url={tileUrls[basemap]}
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          maxZoom={18}
        />

        {/* Labels Overlay for Satellite */}
        {basemap === 'satellite' && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
            opacity={0.7}
          />
        )}

        {/* Uncertainty Cone Polygon */}
        {showCone && (
          <Polygon
            positions={DEMO_SCENARIO.uncertaintyCone}
            pathOptions={{
              color: '#dc2626',
              fillColor: '#ef4444',
              fillOpacity: 0.15,
              weight: 1.5,
              dashArray: '6, 6'
            }}
          >
            <Tooltip sticky>
              <div className="text-xs font-semibold text-red-600">
                Forecast Corridor (Uncertainty Cone)
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* Cyclone Forecast Track Polyline */}
        {showTrack && (
          <Polyline
            positions={DEMO_SCENARIO.track.map(t => t.pos as [number, number])}
            pathOptions={{
              color: '#ef4444',
              weight: 3,
              dashArray: '6, 6',
              opacity: 0.9
            }}
          />
        )}

        {/* Cyclone Eye Marker */}
        <Marker position={DEMO_SCENARIO.center} icon={createStormEyeIcon()}>
          <Popup>
            <div className="p-1 max-w-xs text-xs">
              <div className="font-bold text-red-600 text-sm">{DEMO_SCENARIO.name} ({DEMO_SCENARIO.category})</div>
              <div className="text-slate-600 mt-1 space-y-0.5">
                <div>Wind Speed: <strong>{DEMO_SCENARIO.windSpeed}</strong></div>
                <div>Pressure: <strong>{DEMO_SCENARIO.pressure}</strong></div>
                <div>Surge: <strong>{DEMO_SCENARIO.stormSurgeHeight}</strong></div>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Hazard Polygons */}
        {showHazards && HAZARD_POLYGONS.map(zone => {
          const isSelected = selectedZone?.id === zone.id;
          const color = getPolygonColor(zone.riskLevel);
          return (
            <Polygon
              key={zone.id}
              positions={zone.coordinates}
              eventHandlers={{ click: () => onSelectZone(zone) }}
              pathOptions={{
                color: isSelected ? '#ffffff' : color,
                fillColor: color,
                fillOpacity: isSelected ? 0.40 : 0.22,
                weight: isSelected ? 3 : 1.5,
                dashArray: isSelected ? undefined : '4, 4'
              }}
            >
              <Tooltip sticky>
                <div className="p-1 text-xs">
                  <div className="font-bold" style={{ color }}>{zone.name}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">
                    Risk: <strong>{zone.riskLevel}</strong> | Exposed: <strong>{zone.exposedInfrastructureCount} Facilities</strong>
                  </div>
                </div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* Infrastructure Asset Markers */}
        {showAssets && ASSETS.map(asset => {
          const isSelected = selectedAsset?.id === asset.id;
          return (
            <Marker
              key={asset.id}
              position={asset.position}
              icon={createCustomIcon(asset.type, asset.riskLevel, isSelected)}
              eventHandlers={{ click: () => onSelectAsset(asset) }}
            >
              <Popup>
                {/* Floating Information Card */}
                <div className="p-2.5 max-w-xs text-xs select-none">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{asset.type}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      asset.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {asset.riskLevel} RISK
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{asset.name}</h4>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase font-bold">Vulnerability</span>
                      <strong className="text-red-600">{Math.round(asset.vulnerabilityScore * 100)}% Score</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase font-bold">Pop. Served</span>
                      <strong className="text-slate-800">{asset.populationServed.toLocaleString()}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectAsset(asset)}
                    className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all text-center block"
                  >
                    Analyze Vulnerability
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Controls & Layer Toggles (Top-Right) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2.5 select-none">
        {/* Basemap Switcher */}
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-1 flex gap-1 shadow-md text-xs">
          {(['satellite', 'street', 'dark'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setBasemap(mode)}
              className={`px-3 py-1 font-semibold rounded-lg transition-all capitalize ${
                basemap === mode ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Polished Layer Toggles */}
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-2 shadow-md text-[11px] space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1 flex items-center gap-1">
            <Layers size={12} /> Layers
          </div>
          <button
            onClick={() => setShowHazards(!showHazards)}
            className={`w-full flex items-center justify-between px-2 py-1 rounded font-medium transition-colors ${
              showHazards ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>Hazard Zones</span>
            {showHazards ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button
            onClick={() => setShowTrack(!showTrack)}
            className={`w-full flex items-center justify-between px-2 py-1 rounded font-medium transition-colors ${
              showTrack ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>Cyclone Track</span>
            {showTrack ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button
            onClick={() => setShowCone(!showCone)}
            className={`w-full flex items-center justify-between px-2 py-1 rounded font-medium transition-colors ${
              showCone ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>Forecast Cone</span>
            {showCone ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button
            onClick={() => setShowAssets(!showAssets)}
            className={`w-full flex items-center justify-between px-2 py-1 rounded font-medium transition-colors ${
              showAssets ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>Infrastructure</span>
            {showAssets ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
        </div>
      </div>

      {/* Small Floating Translucent Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 shadow-lg space-y-2.5 max-w-xs pointer-events-auto select-none">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Risk</span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Low
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Moderate
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Critical
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Track</span>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-red-500 border-b border-dashed border-red-400" />
              <span>Forecast Track</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-2 bg-red-500/20 border border-dashed border-red-500/60 rounded-xs" />
              <span>Forecast Cone</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-600 font-semibold">
          <span>🏥 Hosp</span>
          <span>⚡ Power</span>
          <span>🛣️ Road</span>
          <span>🛡️ Shelter</span>
          <span>💧 Water</span>
        </div>
      </div>
    </div>
  );
};
