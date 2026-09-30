export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type AssetType = 'Hospital' | 'Power' | 'Road' | 'Shelter' | 'Water';
export type HazardType = 'Storm Surge' | 'Heavy Rainfall' | 'Flash Flood' | 'Extreme Wind';

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: AssetType;
  position: [number, number];
  riskLevel: RiskLevel;
  vulnerabilityScore: number; // 0.00 to 1.00
  populationServed: number;
  factors: string[];
  address: string;
  status: 'OPERATIONAL' | 'IMPEDED' | 'CRITICAL_RISK' | 'EVACUATING';
  zoneId: string;
  backupPower: boolean;
  elevationMeters: number;
}

export interface HazardPolygon {
  id: string;
  name: string;
  hazardType: HazardType;
  riskLevel: RiskLevel;
  confidence: string;
  affectedAreaKm2: number;
  exposedInfrastructureCount: number;
  description: string;
  coordinates: [number, number][]; // Polygon LatLng points
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: RiskLevel;
  assetId?: string;
  zoneId?: string;
  timestamp: string;
  actionRequired: string;
}

export const DEMO_SCENARIO = {
  id: 'CYCLONE-VEER-2026',
  name: 'Cyclone "VEER"',
  status: 'Approaching Landfall',
  category: 'Extremely Severe Cyclonic Storm',
  windSpeed: '185 km/h',
  pressure: '940 hPa',
  stormSurgeHeight: '4.2 meters',
  avgRainfall: '320 mm/24h',
  landfallETA: '14.5 Hours',
  center: [17.5, 83.5] as [number, number],
  
  // Historical & Projected Track
  track: [
    { label: '-24h Past', pos: [14.8, 86.8], wind: '120 km/h', status: 'Past' },
    { label: '-12h Past', pos: [16.1, 85.2], wind: '155 km/h', status: 'Past' },
    { label: 'Current Eye', pos: [17.5, 83.5], wind: '185 km/h', status: 'Current' },
    { label: '+12h Forecast', pos: [18.2, 82.8], wind: '175 km/h', status: 'Forecast' },
    { label: '+24h Landfall', pos: [18.9, 82.1], wind: '140 km/h', status: 'Forecast' }
  ],

  // Translucent Cone of Uncertainty Polygon
  uncertaintyCone: [
    [17.5, 83.5], // Starting from current eye
    [18.5, 83.4], // North flank
    [19.4, 82.7], // Far north cone edge
    [19.1, 81.4], // Far south cone edge
    [18.0, 82.2], // South flank
    [17.5, 83.5]  // Closing loop
  ] as [number, number][],

  // 72-Hour Risk Trend Projection
  riskTrend: [
    { hour: '12h Ago', risk: 0.35, wind: 155, surge: 1.8 },
    { hour: 'Now', risk: 0.65, wind: 185, surge: 3.1 },
    { hour: '+12h (Landfall)', risk: 0.94, wind: 175, surge: 4.2 },
    { hour: '+24h', risk: 0.82, wind: 140, surge: 2.9 },
    { hour: '+48h', risk: 0.45, wind: 85, surge: 1.1 },
    { hour: '+72h', risk: 0.20, wind: 45, surge: 0.4 }
  ]
};

// Spatially Coherent Deterministic Hazard Polygons
export const HAZARD_POLYGONS: HazardPolygon[] = [
  {
    id: 'ZONE-SURGE-01',
    name: 'Visakhapatnam Coastal Storm Surge Sector',
    hazardType: 'Storm Surge',
    riskLevel: 'CRITICAL',
    confidence: '96% High Precision Simulation',
    affectedAreaKm2: 420,
    exposedInfrastructureCount: 14,
    description: 'Direct coastal inundation zone expected with 3.8m–4.5m wave height along shoreline and tidal creek backwaters.',
    coordinates: [
      [17.62, 83.22],
      [17.70, 83.31],
      [17.82, 83.42],
      [17.90, 83.50],
      [17.82, 83.58],
      [17.65, 83.45],
      [17.55, 83.30],
      [17.62, 83.22]
    ]
  },
  {
    id: 'ZONE-FLOOD-02',
    name: 'Yeleru Basin & Urban Inundation Zone',
    hazardType: 'Flash Flood',
    riskLevel: 'HIGH',
    confidence: '91% Hydrological Model',
    affectedAreaKm2: 780,
    exposedInfrastructureCount: 22,
    description: 'Catchment runoff coupled with extreme 300mm+ precipitation driving rapid flood surge across low-lying urban sectors.',
    coordinates: [
      [17.65, 83.05],
      [17.78, 83.15],
      [17.92, 83.30],
      [17.88, 83.45],
      [17.72, 83.35],
      [17.60, 83.18],
      [17.65, 83.05]
    ]
  },
  {
    id: 'ZONE-RAIN-03',
    name: 'Eastern Ghats Outer Rainband Sector',
    hazardType: 'Heavy Rainfall',
    riskLevel: 'MODERATE',
    confidence: '88% Radar Projection',
    affectedAreaKm2: 1250,
    exposedInfrastructureCount: 35,
    description: 'Widespread sustained heavy downpours with hill-slope erosion risk and moderate waterlogging across transit corridors.',
    coordinates: [
      [17.50, 82.80],
      [17.95, 82.90],
      [18.15, 83.20],
      [18.05, 83.60],
      [17.50, 83.40],
      [17.50, 82.80]
    ]
  }
];

// Expanded Infrastructure Assets across 5 categories
export const ASSETS: InfrastructureAsset[] = [
  {
    id: 'HOSP-01',
    name: 'Visakha General Hospital',
    type: 'Hospital',
    position: [17.72, 83.32],
    riskLevel: 'CRITICAL',
    vulnerabilityScore: 0.92,
    populationServed: 45000,
    factors: ['Coastal Flood Zone', 'Basement Generators Vulnerable', 'Single Arterial Access Road'],
    address: 'Beach Road, Maharani Peta, Visakhapatnam',
    status: 'CRITICAL_RISK',
    zoneId: 'ZONE-SURGE-01',
    backupPower: false,
    elevationMeters: 4.2
  },
  {
    id: 'HOSP-02',
    name: 'KIMS ICON Super Specialty PHC',
    type: 'Hospital',
    position: [17.78, 83.25],
    riskLevel: 'HIGH',
    vulnerabilityScore: 0.74,
    populationServed: 28000,
    factors: ['Urban Drainage Overflow Risk', 'Oxygen Tank Ground Access'],
    address: 'Sheela Nagar, Gajuwaka, Visakhapatnam',
    status: 'IMPEDED',
    zoneId: 'ZONE-FLOOD-02',
    backupPower: true,
    elevationMeters: 12.5
  },
  {
    id: 'PWR-09',
    name: 'Simhadri Super Thermal Substation',
    type: 'Power',
    position: [17.65, 83.15],
    riskLevel: 'HIGH',
    vulnerabilityScore: 0.81,
    populationServed: 180000,
    factors: ['Storm Surge Substation Inundation', 'High Voltage Switchyard Corrosion Risk'],
    address: 'Deepanjali Nagar, Parawada',
    status: 'IMPEDED',
    zoneId: 'ZONE-SURGE-01',
    backupPower: true,
    elevationMeters: 6.8
  },
  {
    id: 'PWR-03',
    name: 'Pendurthi Central Grid Substation',
    type: 'Power',
    position: [17.80, 83.20],
    riskLevel: 'MODERATE',
    vulnerabilityScore: 0.58,
    populationServed: 95000,
    factors: ['High Wind Overhead Line Tension', 'Tree Canopy Exposure'],
    address: 'Pendurthi Main Junction',
    status: 'OPERATIONAL',
    zoneId: 'ZONE-FLOOD-02',
    backupPower: true,
    elevationMeters: 28.0
  },
  {
    id: 'ROAD-16',
    name: 'NH-16 Coastal Expressway (Segment 4)',
    type: 'Road',
    position: [17.85, 83.45],
    riskLevel: 'CRITICAL',
    vulnerabilityScore: 0.88,
    populationServed: 250000, // transit corridor daily volume
    factors: ['Embankment Erosion Exposure', 'High Wave Overwash Risk', 'Landslide Cut Slopes'],
    address: 'Bheemili Coastal Highway Corridor',
    status: 'IMPEDED',
    zoneId: 'ZONE-SURGE-01',
    backupPower: false,
    elevationMeters: 2.1
  },
  {
    id: 'ROAD-04',
    name: 'Anakapalle Inland Highway Link',
    type: 'Road',
    position: [17.68, 83.02],
    riskLevel: 'MODERATE',
    vulnerabilityScore: 0.48,
    populationServed: 110000,
    factors: ['Bridge Abutment Water Scour', 'Heavy Rain Silt Accumulation'],
    address: 'Anakapalle Bypass Corridor',
    status: 'OPERATIONAL',
    zoneId: 'ZONE-RAIN-03',
    backupPower: false,
    elevationMeters: 35.0
  },
  {
    id: 'SHELTER-05',
    name: 'Gajuwaka High School Cyclone Shelter',
    type: 'Shelter',
    position: [17.71, 83.21],
    riskLevel: 'HIGH',
    vulnerabilityScore: 0.68,
    populationServed: 3500, // capacity count
    factors: ['Low Ground Approach Road', 'Potential Overcrowding', 'Potable Water Tank Storage Risk'],
    address: 'High School Road, Gajuwaka',
    status: 'OPERATIONAL',
    zoneId: 'ZONE-FLOOD-02',
    backupPower: true,
    elevationMeters: 14.0
  },
  {
    id: 'SHELTER-12',
    name: 'Bheemili Multi-Purpose Relief Center',
    type: 'Shelter',
    position: [17.89, 83.44],
    riskLevel: 'CRITICAL',
    vulnerabilityScore: 0.85,
    populationServed: 5000,
    factors: ['Direct Coast Proximity (<300m)', 'Extreme Wind Structural Exposure'],
    address: 'Light House Road, Bheemunipatnam',
    status: 'EVACUATING',
    zoneId: 'ZONE-SURGE-01',
    backupPower: true,
    elevationMeters: 8.5
  },
  {
    id: 'WATER-02',
    name: 'Thatipudi Reservoir Pumping Station',
    type: 'Water',
    position: [17.76, 83.10],
    riskLevel: 'MODERATE',
    vulnerabilityScore: 0.52,
    populationServed: 310000,
    factors: ['High Turbidity Silt Intake', 'Pump Motor Submergence Risk'],
    address: 'Gothivada Water Works Complex',
    status: 'OPERATIONAL',
    zoneId: 'ZONE-RAIN-03',
    backupPower: true,
    elevationMeters: 45.0
  }
];

// Active Synchronized Alerts (Linked to assets & zones for bi-directional map focus)
export const ACTIVE_ALERTS: AlertItem[] = [
  {
    id: 'ALT-101',
    title: 'CRITICAL: Visakha General Hospital Power Risk',
    message: 'Storm surge inundation threatening basement electrical switches. Generator failure imminent within 6 hours without pre-positioned pumps.',
    severity: 'CRITICAL',
    assetId: 'HOSP-01',
    zoneId: 'ZONE-SURGE-01',
    timestamp: '10 MINS AGO',
    actionRequired: 'Deploy mobile high-capacity pumps & initiate top-floor emergency power bypass.'
  },
  {
    id: 'ALT-102',
    title: 'HIGH: NH-16 Coastal Segment Overwash Imminent',
    message: 'Wave heights exceeding 4 meters causing structural crest erosion. Evacuation traffic at risk of total standstill.',
    severity: 'CRITICAL',
    assetId: 'ROAD-16',
    zoneId: 'ZONE-SURGE-01',
    timestamp: '25 MINS AGO',
    actionRequired: 'Divert heavy evacuation traffic to Inland Highway Link (ROAD-04).'
  },
  {
    id: 'ALT-103',
    title: 'HIGH: Simhadri Substation Water Ingress Warning',
    message: 'Tidal backwater rising near 220kV switchyard perimeter fence. Potential grid tripping affecting 180k citizens.',
    severity: 'HIGH',
    assetId: 'PWR-09',
    zoneId: 'ZONE-SURGE-01',
    timestamp: '42 MINS AGO',
    actionRequired: 'Erect sandbag flood barrier and dispatch mobile substation unit.'
  },
  {
    id: 'ALT-104',
    title: 'MODERATE: Shelter 12 Wind Resistance Advisory',
    message: 'Sustained winds reaching 170 km/h facing unshielded eastern facade of Bheemili Relief Center.',
    severity: 'MODERATE',
    assetId: 'SHELTER-12',
    zoneId: 'ZONE-SURGE-01',
    timestamp: '1 HOUR AGO',
    actionRequired: 'Move occupants to reinforced interior hall and clear windows.'
  }
];
