import { GoogleGenAI } from '@google/genai';
import type { InfrastructureAsset, HazardPolygon } from '../data/scenario';
import { DEMO_SCENARIO } from '../data/scenario';

export interface AIAssessmentResult {
  explanation: string;
  consequence: string;
  recommendations: string[];
  priorityReason: string;
  source: 'GEMINI_AI' | 'RULE_ENGINE';
  fallbackNotice?: string;
}

/**
 * Deterministic Rule-Based Fallback Generator
 * Ensures the prototype NEVER breaks regardless of network or API key availability.
 */
function getRuleBasedAssessment(asset: InfrastructureAsset, hazardZone?: HazardPolygon): AIAssessmentResult {
  const factorsList = asset.factors.join(', ');
  const zoneInfo = hazardZone ? `situated inside the ${hazardZone.name} (${hazardZone.hazardType})` : 'in the path of Cyclone VEER';

  let explanation = `${asset.name} is classified as ${asset.riskLevel} risk with a ${Math.round(asset.vulnerabilityScore * 100)}% vulnerability rating. It is ${zoneInfo} at an elevation of ${asset.elevationMeters}m MSL. Critical vulnerability drivers include: ${factorsList}.`;

  let consequence = '';
  let priorityReason = '';
  let recommendations: string[] = [];

  switch (asset.type) {
    case 'Hospital':
      consequence = `Disruption of intensive care facilities, loss of chilled drug storage, and blocked emergency ambulance routes serving ~${asset.populationServed.toLocaleString()} residents.`;
      priorityReason = 'High life-safety impact requiring continuous backup power and uninterrupted triage capabilities.';
      recommendations = [
        'Pre-deploy emergency 500kVA mobile diesel generators to high ground above 6m elevation.',
        'Stage 4x4 high-clearance ambulances at designated inland relay points.',
        'Pre-evacuate ventilator-dependent and non-critical patients to secondary inland general hospitals.'
      ];
      break;

    case 'Power':
      consequence = `Grid blackout affecting ~${asset.populationServed.toLocaleString()} consumers, threatening regional water pumping stations and hospital emergency grids.`;
      priorityReason = 'Systemic cascade failure point for critical public utilities in coastal sectors.';
      recommendations = [
        'Erect sandbag perimeter barriers (2m height) around 220kV switchyard transformer bays.',
        'Pre-stage high-capacity submersible dewatering pumps at cable trench sumps.',
        'Isolate low-elevation coastal feeder lines to prevent busbar short-circuit trips.'
      ];
      break;

    case 'Road':
      consequence = `Total severance of primary coastal evacuation corridor, stranding ~${asset.populationServed.toLocaleString()} daily transit commuters and delaying relief convoys.`;
      priorityReason = 'Critical lifeline bottleneck preventing emergency vehicle deployment to high-impact landfall zones.';
      recommendations = [
        'Pre-position heavy earthmovers and tree-clearing crews at 5km intervals.',
        'Enforce proactive traffic diversion to inland high-elevation secondary roads.',
        'Deploy mobile warning signages and flood depth gauges at low-lying underpasses.'
      ];
      break;

    case 'Shelter':
      consequence = `Potential structural wall breach or access isolation for ${asset.populationServed.toLocaleString()} evacuees during peak storm surge and 185 km/h winds.`;
      priorityReason = 'Direct human exposure center accommodating vulnerable coastal populations.';
      recommendations = [
        'Secure exterior structural shutters and reinforce emergency rooftop water tanks.',
        'Pre-stock 72-hour emergency rations, medical kits, and portable water filtration units.',
        'Establish VHF radio fallback links with District Emergency Operations Center (DEOC).'
      ];
      break;

    case 'Water':
      consequence = `Contamination of potable water distribution networks serving ${asset.populationServed.toLocaleString()} citizens due to river turbidity and pump submergence.`;
      priorityReason = 'Essential public health utility guarding against post-cyclone waterborne disease outbreaks.';
      recommendations = [
        'Elevate pump motor control panels with waterproof sealing.',
        'Pre-chlorinate emergency storage reservoirs to maximum safe levels.',
        'Deploy mobile water tanker trucks to pre-identified community distribution points.'
      ];
      break;

    default:
      consequence = `Severe operational interruption affecting critical community services.`;
      priorityReason = 'High exposure to multi-hazard cyclone impact factors.';
      recommendations = [
        'Secure asset perimeter and clear loose debris.',
        'Verify backup generator fuel reserves and emergency communications.',
        'Establish hourly telemetry reports to command center.'
      ];
  }

  return {
    explanation,
    consequence,
    recommendations,
    priorityReason,
    source: 'RULE_ENGINE',
    fallbackNotice: 'AI reasoning API key unconfigured — displaying deterministic rule-based operational assessment.'
  };
}

/**
 * Main Assessment Service
 * Tries Gemini API first (if VITE_GEMINI_KEY is provided), and seamlessly falls back to rule-based engine.
 */
export async function getAIAssessment(
  asset: InfrastructureAsset,
  hazardZone?: HazardPolygon
): Promise<AIAssessmentResult> {
  const apiKey = import.meta.env.VITE_GEMINI_KEY || (typeof process !== 'undefined' ? process.env.VITE_GEMINI_KEY : undefined);

  // Fallback if no API key present
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    return getRuleBasedAssessment(asset, hazardZone);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert disaster response AI assistant for CYCLONE SENTINEL command center.
Analyze this infrastructure asset under Cyclone "${DEMO_SCENARIO.name}" (${DEMO_SCENARIO.category}, Wind: ${DEMO_SCENARIO.windSpeed}, Surge: ${DEMO_SCENARIO.stormSurgeHeight}):

ASSET DETAILS:
- Name: ${asset.name} (${asset.type})
- Risk Level: ${asset.riskLevel} (Vulnerability Index: ${Math.round(asset.vulnerabilityScore * 100)}%)
- Elevation: ${asset.elevationMeters}m MSL
- Population Impacted: ${asset.populationServed.toLocaleString()}
- Vulnerability Factors: ${asset.factors.join('; ')}
- Hazard Context: ${hazardZone ? hazardZone.name + ' (' + hazardZone.hazardType + ')' : 'Direct Landfall Corridor'}

Provide your response strictly as valid JSON with NO markdown formatting, matching this format:
{
  "explanation": "Clear 2-sentence explanation of WHY this specific asset is vulnerable under these storm conditions.",
  "consequence": "Concise summary of operational and human consequences if hit.",
  "priorityReason": "Short justification of why this asset deserves immediate tactical priority.",
  "recommendations": [
    "Action 1 (Specific anticipatory pre-landfall mitigation step)",
    "Action 2 (Specific pre-positioning or evacuation step)",
    "Action 3 (Specific contingency fallback step)"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text?.trim() || '';
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(responseText);

    return {
      explanation: parsed.explanation || `${asset.name} faces severe risk due to ${asset.factors.join(', ')}.`,
      consequence: parsed.consequence || `Loss of critical ${asset.type} services.`,
      priorityReason: parsed.priorityReason || `High vulnerability rating of ${(asset.vulnerabilityScore * 100).toFixed(0)}%.`,
      recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length >= 3
        ? parsed.recommendations.slice(0, 3)
        : getRuleBasedAssessment(asset, hazardZone).recommendations,
      source: 'GEMINI_AI'
    };

  } catch (error) {
    console.warn('Gemini API call failed or unavailable, reverting to rule engine:', error);
    const fallback = getRuleBasedAssessment(asset, hazardZone);
    fallback.fallbackNotice = `AI service error: ${(error as Error).message || 'Call failed'} — displaying rule-based assessment.`;
    return fallback;
  }
}
