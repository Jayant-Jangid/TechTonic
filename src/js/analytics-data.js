// KisanSetu Advanced Agricultural Market Intelligence & Predictive Analytics Engine
// Parsed from Official Agmarknet, CACP, and e-NAM Registries
// (msp_mandi_variation_2025_2026.csv, seasonal_crop_arrivals_realization.csv, enam_mandis_trade_by_state.csv)

const PRICE_VARIATION_DATA = [
  {
    commodity: 'Paddy',
    fullName: 'Paddy (Rice unmilled)',
    year: 2026,
    category: 'Cereals',
    msp: 2369,
    mandiPrice: 2306,
    variationPercent: -2.66,
    deficitPerQtl: 63,
    riskLevel: 'Low',
    history: { 2025: { msp: 2300, mandiPrice: 2054, variationPercent: -10.70 } },
    forecast: 'Moderate deficit. Strong FCI procurement window cushions mandi downside in Dec-Jan.'
  },
  {
    commodity: 'Wheat',
    fullName: 'Wheat',
    year: 2026,
    category: 'Cereals',
    msp: 2585,
    mandiPrice: 2430,
    variationPercent: -6.00,
    deficitPerQtl: 155,
    riskLevel: 'Moderate',
    forecast: 'Mandi price drops ~6% below MSP during peak April harvest. Recommended to hold in ventilated silo for 45 days.'
  },
  {
    commodity: 'Maize',
    fullName: 'Maize',
    year: 2026,
    category: 'Coarse Cereals',
    msp: 2400,
    mandiPrice: 1869,
    variationPercent: -22.13,
    deficitPerQtl: 531,
    riskLevel: 'Critical Deficit',
    forecast: 'Severe -22.13% mandi price crash expected during post-monsoon harvest glut. Direct contract with poultry feed mills advised.'
  },
  {
    commodity: 'Arhar',
    fullName: 'Arhar (Tur)',
    year: 2026,
    category: 'Pulses',
    msp: 8000,
    mandiPrice: 7289,
    variationPercent: -8.89,
    deficitPerQtl: 711,
    riskLevel: 'Moderate',
    history: { 2025: { msp: 7550, mandiPrice: 6492, variationPercent: -14.00 } },
    forecast: 'Deficit contracted from -14% in 2025 to -8.89% in 2026 due to domestic buffer restocking.'
  },
  {
    commodity: 'Gram',
    fullName: 'Gram (whole)',
    year: 2026,
    category: 'Pulses',
    msp: 5875,
    mandiPrice: 5616,
    variationPercent: -4.41,
    deficitPerQtl: 259,
    riskLevel: 'Low',
    forecast: 'Stable pulses demand. Mandi floor holds within -4.4% of MSP benchmark.'
  },
  {
    commodity: 'Moong',
    fullName: 'Moong',
    year: 2026,
    category: 'Pulses',
    msp: 8768,
    mandiPrice: 6929,
    variationPercent: -20.97,
    deficitPerQtl: 1839,
    riskLevel: 'Critical Deficit',
    history: { 2025: { msp: 8682, mandiPrice: 6869, variationPercent: -20.90 } },
    forecast: 'Persistent severe price suppression (-20.97%). Open mandi realization leaves ₹1,839/Qtl deficit vs Govt MSP.'
  },
  {
    commodity: 'Soyabean',
    fullName: 'Soyabean',
    year: 2025,
    category: 'Oilseeds',
    msp: 4892,
    mandiPrice: 4199,
    variationPercent: -14.20,
    deficitPerQtl: 693,
    riskLevel: 'High Deficit',
    forecast: 'Global edible oil import dynamics suppress domestic seed mandi realizations by -14.2% below MSP.'
  },
  {
    commodity: 'Bajra',
    fullName: 'Bajra',
    year: 2026,
    category: 'Coarse Cereals',
    msp: 2775,
    mandiPrice: 2206,
    variationPercent: -20.50,
    deficitPerQtl: 569,
    riskLevel: 'Critical Deficit',
    forecast: 'Heavy arrival glut in western states (Rajasthan/Haryana) creates -20.5% price gap vs MSP.'
  },
  {
    commodity: 'Masur',
    fullName: 'Masur (Lentil)',
    year: 2026,
    category: 'Pulses',
    msp: 7000,
    mandiPrice: 6523,
    variationPercent: -6.81,
    deficitPerQtl: 477,
    riskLevel: 'Moderate',
    forecast: 'Moderate -6.81% discount in private APMC yards. Direct mill off-take offers full parity with MSP.'
  },
  {
    commodity: 'Urad',
    fullName: 'Urad',
    year: 2026,
    category: 'Pulses',
    msp: 7800,
    mandiPrice: 7537,
    variationPercent: -3.37,
    deficitPerQtl: 263,
    riskLevel: 'Low',
    forecast: 'High commercial demand from FMCG and flour millers keeps realization near parity (-3.37%).'
  }
];

const SEASONAL_TRENDS_DATA = [
  { month: 'Oct', fullMonth: 'October', category: 'Kharif', commodity: 'Paddy / Soyabean', arrivalIndex: 85, priceIndex: 60, phase: 'Peak Harvest Arrivals (Glut)', type: 'glut' },
  { month: 'Nov', fullMonth: 'November', category: 'Kharif', commodity: 'Paddy / Soyabean', arrivalIndex: 100, priceIndex: 55, phase: 'Peak Harvest Arrivals (Glut)', type: 'glut_peak' },
  { month: 'Dec', fullMonth: 'December', category: 'Kharif', commodity: 'Paddy / Soyabean', arrivalIndex: 70, priceIndex: 75, phase: 'Post-Harvest Tapering', type: 'tapering' },
  { month: 'Jan', fullMonth: 'January', category: 'Kharif', commodity: 'Paddy / Soyabean', arrivalIndex: 40, priceIndex: 90, phase: 'Demand Stabilization', type: 'stabilization' },
  { month: 'Feb', fullMonth: 'February', category: 'Kharif', commodity: 'Paddy / Soyabean', arrivalIndex: 20, priceIndex: 95, phase: 'Lean Season', type: 'lean_window' },
  { month: 'Mar', fullMonth: 'March', category: 'Rabi', commodity: 'Onion (Early)', arrivalIndex: 50, priceIndex: 80, phase: 'Early Harvest', type: 'early_harvest' },
  { month: 'Apr', fullMonth: 'April', category: 'Rabi', commodity: 'Wheat / Gram / Onion', arrivalIndex: 90, priceIndex: 50, phase: 'Peak Harvest Arrivals (Glut)', type: 'glut' },
  { month: 'May', fullMonth: 'May', category: 'Rabi', commodity: 'Wheat / Gram / Onion', arrivalIndex: 100, priceIndex: 45, phase: 'Peak Harvest Arrivals (Glut)', type: 'glut_peak' },
  { month: 'Jun', fullMonth: 'June', category: 'Rabi', commodity: 'Wheat / Gram', arrivalIndex: 60, priceIndex: 75, phase: 'Post-Harvest Tapering', type: 'tapering' },
  { month: 'Jul', fullMonth: 'July', category: 'Rabi', commodity: 'Wheat / Gram', arrivalIndex: 30, priceIndex: 85, phase: 'Demand Stabilization', type: 'stabilization' },
  { month: 'Aug', fullMonth: 'August', category: 'Rabi_Stored', commodity: 'Onion (Stored)', arrivalIndex: 30, priceIndex: 110, phase: 'Lean Season (Storage Depletion)', type: 'lean_depletion' },
  { month: 'Sep', fullMonth: 'September', category: 'Rabi_Stored', commodity: 'Onion (Stored)', arrivalIndex: 15, priceIndex: 140, phase: 'Peak Lean Season (High Volatility)', type: 'peak_lean_spike' }
];

const STATE_MARKET_DATA = [
  { state: 'Haryana', mandis: 108, volumeMT: 34253606, valueCrore: 110749.58, valueDensity: 32332, region: 'North', keyCrops: 'Wheat, Mustard, Paddy' },
  { state: 'Rajasthan', mandis: 173, volumeMT: 28942649, valueCrore: 119691.13, valueDensity: 41354, region: 'North/West', keyCrops: 'Bajra, Mustard, Gram' },
  { state: 'Madhya Pradesh', mandis: 139, volumeMT: 10438145, valueCrore: 34813.82, valueDensity: 33352, region: 'Central', keyCrops: 'Soyabean, Wheat, Gram' },
  { state: 'Andhra Pradesh', mandis: 33, volumeMT: 9096850, valueCrore: 59676.71, valueDensity: 65601, region: 'South', keyCrops: 'Paddy, Chillies, Cotton' },
  { state: 'Uttar Pradesh', mandis: 162, volumeMT: 7673574, valueCrore: 14961.62, valueDensity: 19497, region: 'North', keyCrops: 'Wheat, Paddy, Sugarcane' },
  { state: 'Telangana', mandis: 57, volumeMT: 7596161, valueCrore: 28438.60, valueDensity: 37438, region: 'South', keyCrops: 'Paddy, Cotton, Maize' },
  { state: 'Maharashtra', mandis: 133, volumeMT: 5669341, valueCrore: 21130.40, valueDensity: 37271, region: 'West', keyCrops: 'Onion, Soyabean, Cotton' },
  { state: 'Punjab', mandis: 79, volumeMT: 4194777, valueCrore: 13648.77, valueDensity: 32537, region: 'North', keyCrops: 'Wheat, Basmati Rice' },
  { state: 'Tamil Nadu', mandis: 213, volumeMT: 3062889, valueCrore: 8283.95, valueDensity: 27046, region: 'South', keyCrops: 'Paddy, Spices, Groundnut' },
  { state: 'Gujarat', mandis: 144, volumeMT: 2970027, valueCrore: 11754.42, valueDensity: 39576, region: 'West', keyCrops: 'Cotton, Groundnut, Cumin' },
  { state: 'Odisha', mandis: 66, volumeMT: 2267148, valueCrore: 5754.67, valueDensity: 25382, region: 'East', keyCrops: 'Paddy, Pulses' },
  { state: 'Chhattisgarh', mandis: 20, volumeMT: 1390055, valueCrore: 2918.45, valueDensity: 20995, region: 'Central', keyCrops: 'Paddy' },
  { state: 'Uttarakhand', mandis: 20, volumeMT: 905763, valueCrore: 1443.25, valueDensity: 15934, region: 'North', keyCrops: 'Wheat, Basmati, Pulses' },
  { state: 'Chandigarh', mandis: 1, volumeMT: 788565, valueCrore: 1604.43, valueDensity: 20346, region: 'North', keyCrops: 'Grain Terminal Hub' },
  { state: 'Himachal Pradesh', mandis: 38, volumeMT: 453790, valueCrore: 1717.14, valueDensity: 37839, region: 'North', keyCrops: 'Apples, Vegetables' },
  { state: 'Karnataka', mandis: 5, volumeMT: 246949, valueCrore: 1803.07, valueDensity: 73013, region: 'South', keyCrops: 'Arecanut, Maize, Pulses' },
  { state: 'Jammu and Kashmir', mandis: 17, volumeMT: 169339, valueCrore: 1052.99, valueDensity: 62182, region: 'North', keyCrops: 'Apple, Saffron, Walnut' },
  { state: 'West Bengal', mandis: 18, volumeMT: 103371, valueCrore: 202.87, valueDensity: 19625, region: 'East', keyCrops: 'Paddy, Jute, Potato' },
  { state: 'Jharkhand', mandis: 19, volumeMT: 34398, valueCrore: 68.23, valueDensity: 19835, region: 'East', keyCrops: 'Paddy, Vegetables' },
  { state: 'Bihar', mandis: 20, volumeMT: 3395, valueCrore: 14.75, valueDensity: 43446, region: 'East', keyCrops: 'Maize, Pulses' },
  { state: 'Kerala', mandis: 6, volumeMT: 770, valueCrore: 2.51, valueDensity: 32597, region: 'South', keyCrops: 'Spices, Plantation Crops' },
  { state: 'Goa', mandis: 7, volumeMT: 326, valueCrore: 2.14, valueDensity: 65644, region: 'West', keyCrops: 'Cashew, Coconut' }
];

window.ANALYTICS_DATA = {
  priceVariation: PRICE_VARIATION_DATA,
  seasonalTrends: SEASONAL_TRENDS_DATA,
  stateMarkets: STATE_MARKET_DATA
};