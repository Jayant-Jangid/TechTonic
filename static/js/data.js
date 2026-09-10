// KisanSetu Data Store and Mock Seed Data
const INITIAL_CROPS = [
  {
    id: 'crop-101',
    name: 'Sharbati Golden Wheat',
    category: 'Cereals',
    quantity: 45,
    unit: 'Quintal',
    pricePerUnit: 2650, // INR per quintal
    mandiPrice: 2420,
    mspPrice: 2275,
    isOrganic: true,
    organicCertNo: 'NPOP/NAB/0019/MH',
    harvestDaysAgo: 2,
    harvestDate: '2026-09-08',
    freshnessIndex: 96, // %
    grade: 'A+',
    gradeLabel: 'Export Grade A+',
    qualitySpecs: {
      moisture: 10.2, // %
      foreignMatter: 0.3, // %
      uniformity: 98, // %
      grainSize: 'Extra Bold'
    },
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    farmLocation: 'Nashik Agro-Cluster, Maharashtra',
    coordinates: { lat: 19.9975, lng: 73.7898 },
    deliveryRadiusKm: 85,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    description: 'Direct harvest from pesticide-free black soil. High protein luster grains, sun-dried naturally.',
    interestedBuyers: [
      { id: 'b-1', name: 'FreshRoots Organic Supermarket', type: 'Retail Chain', offeredPrice: 2600, qtyNeeded: 30, distanceKm: 42, rating: 4.9 },
      { id: 'b-2', name: 'Pune Artisan Bakers Union', type: 'Commercial Buyer', offeredPrice: 2650, qtyNeeded: 15, distanceKm: 68, rating: 4.8 },
      { id: 'b-3', name: 'Mahindra Agri Procure', type: 'Institutional Buyer', offeredPrice: 2580, qtyNeeded: 45, distanceKm: 110, rating: 4.7 }
    ],
    status: 'active',
    createdAt: '2026-09-08T10:30:00Z'
  },
  {
    id: 'crop-102',
    name: 'Alphonso Ratnagiri Mangoes',
    category: 'Fruits',
    quantity: 120,
    unit: 'Crates (12 Doz/crate)',
    pricePerUnit: 1850,
    mandiPrice: 1720,
    mspPrice: 1600,
    isOrganic: true,
    organicCertNo: 'JAIVIK-MH-8821',
    harvestDaysAgo: 1,
    harvestDate: '2026-09-09',
    freshnessIndex: 99,
    grade: 'A+',
    gradeLabel: 'Geographical Indication (GI) Export',
    qualitySpecs: {
      moisture: 14.0,
      foreignMatter: 0.0,
      uniformity: 99,
      grainSize: '280g - 320g avg'
    },
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    farmLocation: 'Ratnagiri Coastal Orchards, Maharashtra',
    coordinates: { lat: 16.9902, lng: 73.3120 },
    deliveryRadiusKm: 150,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    description: 'Tree-ripened authentic Ratnagiri Alphonso. Naturally aromatic with no carbide artificial ripening.',
    interestedBuyers: [
      { id: 'b-4', name: 'KisanDirect Gourmet Express', type: 'Export Broker', offeredPrice: 1900, qtyNeeded: 80, distanceKm: 120, rating: 5.0 },
      { id: 'b-5', name: 'Nature Basket Delights', type: 'Retail Chain', offeredPrice: 1820, qtyNeeded: 40, distanceKm: 95, rating: 4.6 }
    ],
    status: 'active',
    createdAt: '2026-09-09T08:15:00Z'
  },
  {
    id: 'crop-103',
    name: 'Pusa 1121 Basmati Rice (Paddy)',
    category: 'Cereals',
    quantity: 60,
    unit: 'Quintal',
    pricePerUnit: 3800,
    mandiPrice: 3600,
    mspPrice: 3450,
    isOrganic: false,
    organicCertNo: '',
    harvestDaysAgo: 4,
    harvestDate: '2026-09-06',
    freshnessIndex: 91,
    grade: 'A',
    gradeLabel: 'Premium Grade A',
    qualitySpecs: {
      moisture: 11.5,
      foreignMatter: 0.8,
      uniformity: 95,
      grainSize: '8.4mm Extra Long'
    },
    farmerId: 'farmer-2',
    farmerName: 'Balwinder Dhillon',
    farmLocation: 'Karnal Agri Belt, Haryana',
    coordinates: { lat: 29.6857, lng: 76.9905 },
    deliveryRadiusKm: 120,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional long-grain Basmati paddy with unmatched natural scent. Freshly harvested.',
    interestedBuyers: [
      { id: 'b-6', name: 'Taj Agro Exporters', type: 'Wholesale Mill', offeredPrice: 3750, qtyNeeded: 60, distanceKm: 45, rating: 4.9 }
    ],
    status: 'active',
    createdAt: '2026-09-06T14:00:00Z'
  },
  {
    id: 'crop-104',
    name: 'Red Hybrid Vine Tomatoes',
    category: 'Vegetables',
    quantity: 350,
    unit: 'Crates (25kg/crate)',
    pricePerUnit: 480,
    mandiPrice: 420,
    mspPrice: 380,
    isOrganic: true,
    organicCertNo: 'IND-ORG-4421',
    harvestDaysAgo: 1,
    harvestDate: '2026-09-09',
    freshnessIndex: 98,
    grade: 'A',
    gradeLabel: 'Super Fresh Grade A',
    qualitySpecs: {
      moisture: 18.0,
      foreignMatter: 0.1,
      uniformity: 96,
      grainSize: 'Firm / 65mm'
    },
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    farmLocation: 'Dindori Greenhouse, Nashik',
    coordinates: { lat: 20.2036, lng: 73.8317 },
    deliveryRadiusKm: 60,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    description: 'Firm, glossy, high-lycopene greenhouse tomatoes. Zero transit bruising with specialized crating.',
    interestedBuyers: [
      { id: 'b-7', name: 'SabziMandi Direct Pune', type: 'Local Market', offeredPrice: 470, qtyNeeded: 150, distanceKm: 55, rating: 4.7 }
    ],
    status: 'active',
    createdAt: '2026-09-09T06:45:00Z'
  },
  {
    id: 'crop-105',
    name: 'Lakadong High-Curcumin Turmeric',
    category: 'Spices',
    quantity: 18,
    unit: 'Quintal',
    pricePerUnit: 8400,
    mandiPrice: 7900,
    mspPrice: 7200,
    isOrganic: true,
    organicCertNo: 'APEDA/NER/7762',
    harvestDaysAgo: 5,
    harvestDate: '2026-09-05',
    freshnessIndex: 94,
    grade: 'A+',
    gradeLabel: 'Export Curcumin 7.5%+',
    qualitySpecs: {
      moisture: 8.5,
      foreignMatter: 0.2,
      uniformity: 99,
      grainSize: 'Finger Rhizome'
    },
    farmerId: 'farmer-3',
    farmerName: 'Sangita Devi',
    farmLocation: 'Jaintia Hills Organic Cluster, Meghalaya',
    coordinates: { lat: 25.4670, lng: 92.2038 },
    deliveryRadiusKm: 250,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    description: 'World-renowned Lakadong turmeric with lab-tested 7.8% active curcumin content. Sun dried on bamboo mats.',
    interestedBuyers: [
      { id: 'b-8', name: 'BioAyur Pharmaceuticals', type: 'Pharma / Wellness', offeredPrice: 8400, qtyNeeded: 18, distanceKm: 210, rating: 5.0 }
    ],
    status: 'active',
    createdAt: '2026-09-05T09:00:00Z'
  },
  {
    id: 'crop-106',
    name: 'Yellow Mustard Seed (Sarson)',
    category: 'Oilseeds',
    quantity: 75,
    unit: 'Quintal',
    pricePerUnit: 5350,
    mandiPrice: 5100,
    mspPrice: 4850,
    isOrganic: false,
    organicCertNo: '',
    harvestDaysAgo: 3,
    harvestDate: '2026-09-07',
    freshnessIndex: 93,
    grade: 'B+',
    gradeLabel: 'Standard High-Oil Grade',
    qualitySpecs: {
      moisture: 7.8,
      foreignMatter: 1.1,
      uniformity: 91,
      grainSize: 'Oil content 41%'
    },
    farmerId: 'farmer-4',
    farmerName: 'Harish Choudhary',
    farmLocation: 'Bharatpur, Rajasthan',
    coordinates: { lat: 27.2152, lng: 77.5030 },
    deliveryRadiusKm: 140,
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    description: 'High pungency cold-press grade yellow mustard. Excellent oil yield with minimal husk.',
    interestedBuyers: [
      { id: 'b-9', name: 'Kachi Ghani Mills Ltd', type: 'Oil Processor', offeredPrice: 5250, qtyNeeded: 75, distanceKm: 80, rating: 4.8 }
    ],
    status: 'active',
    createdAt: '2026-09-07T11:20:00Z'
  },
  {
    id: 'crop-107',
    name: 'Nashik Red Onion (Garwa Grade)',
    category: 'Vegetables',
    quantity: 400,
    unit: 'Quintal',
    pricePerUnit: 2150,
    mandiPrice: 1980,
    mspPrice: 1800,
    isOrganic: false,
    organicCertNo: '',
    harvestDaysAgo: 2,
    harvestDate: '2026-09-08',
    freshnessIndex: 96,
    grade: 'A',
    gradeLabel: 'Mandi Benchmark Grade A',
    qualitySpecs: {
      moisture: 12.0,
      foreignMatter: 0.4,
      uniformity: 95,
      grainSize: 'Medium-Large (55-65mm)'
    },
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    farmLocation: 'Lasalgaon Mandi Belt, Nashik',
    coordinates: { lat: 20.1472, lng: 74.2255 },
    deliveryRadiusKm: 90,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    description: 'Thick-layered pungent red onions with great storage life. Cured naturally in farm ventilated sheds.',
    interestedBuyers: [
      { id: 'b-10', name: 'APMC Vashi Wholesale Traders', type: 'Wholesale Buyer', offeredPrice: 2100, qtyNeeded: 200, distanceKm: 140, rating: 4.8 }
    ],
    status: 'active',
    createdAt: '2026-09-08T09:00:00Z'
  },
  {
    id: 'crop-108',
    name: 'Nagpur Sweet Mandarin Oranges',
    category: 'Fruits',
    quantity: 180,
    unit: 'Crates (20kg/crate)',
    pricePerUnit: 1250,
    mandiPrice: 1150,
    mspPrice: 1050,
    isOrganic: true,
    organicCertNo: 'JAIVIK-MH-9944',
    harvestDaysAgo: 1,
    harvestDate: '2026-09-09',
    freshnessIndex: 99,
    grade: 'A+',
    gradeLabel: 'GI Certified Sweet Grade',
    qualitySpecs: {
      moisture: 15.0,
      foreignMatter: 0.0,
      uniformity: 98,
      grainSize: 'Grade 1 Extra Sweet'
    },
    farmerId: 'farmer-5',
    farmerName: 'Sanjay Deshmukh',
    farmLocation: 'Katol Agro-Belt, Nagpur',
    coordinates: { lat: 21.2825, lng: 78.5869 },
    deliveryRadiusKm: 180,
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
    description: 'Juicy, sweet, thin-peel Nagpur mandarin oranges. Harvested early morning for optimal fruit turgidity.',
    interestedBuyers: [
      { id: 'b-11', name: 'Citrus Fresh Juicery', type: 'Processor', offeredPrice: 1220, qtyNeeded: 80, distanceKm: 45, rating: 4.9 }
    ],
    status: 'active',
    createdAt: '2026-09-09T07:30:00Z'
  },
  {
    id: 'crop-109',
    name: 'Organic Kabuli Chana (Chickpeas 12mm)',
    category: 'Pulses',
    quantity: 90,
    unit: 'Quintal',
    pricePerUnit: 6450,
    mandiPrice: 6150,
    mspPrice: 5440,
    isOrganic: true,
    organicCertNo: 'MP-ORG-2024',
    harvestDaysAgo: 4,
    harvestDate: '2026-09-06',
    freshnessIndex: 94,
    grade: 'A+',
    gradeLabel: 'Export Jumbo Bold 12mm',
    qualitySpecs: {
      moisture: 9.2,
      foreignMatter: 0.1,
      uniformity: 99,
      grainSize: '12mm Jumbo Bold'
    },
    farmerId: 'farmer-6',
    farmerName: 'Devendra Solanki',
    farmLocation: 'Ujjain Agro-Hub, Madhya Pradesh',
    coordinates: { lat: 23.1765, lng: 75.7885 },
    deliveryRadiusKm: 160,
    imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    description: 'Cleaned, machine-graded jumbo Kabuli chickpeas. Unpolished, 100% natural pesticide-free cultivation.',
    interestedBuyers: [
      { id: 'b-12', name: 'Haldiram Snacks Procurement', type: 'Food Processor', offeredPrice: 6400, qtyNeeded: 90, distanceKm: 110, rating: 5.0 }
    ],
    status: 'active',
    createdAt: '2026-09-06T11:00:00Z'
  },
  {
    id: 'crop-110',
    name: 'Tellicherry Extra Bold Black Pepper',
    category: 'Spices',
    quantity: 30,
    unit: 'Quintal',
    pricePerUnit: 32000,
    mandiPrice: 30500,
    mspPrice: 28000,
    isOrganic: true,
    organicCertNo: 'IND-SPICE-8812',
    harvestDaysAgo: 5,
    harvestDate: '2026-09-05',
    freshnessIndex: 97,
    grade: 'A+',
    gradeLabel: 'TGSEB Grade 4.75mm',
    qualitySpecs: {
      moisture: 10.0,
      foreignMatter: 0.1,
      uniformity: 98,
      grainSize: '4.75mm Extra Bold'
    },
    farmerId: 'farmer-7',
    farmerName: 'George Kuriakose',
    farmLocation: 'Wayanad High Ranges, Kerala',
    coordinates: { lat: 11.6854, lng: 76.1320 },
    deliveryRadiusKm: 250,
    imageUrl: 'https://images.unsplash.com/photo-1599909682702-8924b1227f5a?auto=format&fit=crop&w=800&q=80',
    description: 'King of Spices. Handpicked ripe berries, sun-dried on elevation slopes for intense piperine heat and aroma.',
    interestedBuyers: [
      { id: 'b-13', name: 'Kerala Spice Exporters Guild', type: 'Exporter', offeredPrice: 32000, qtyNeeded: 30, distanceKm: 85, rating: 5.0 }
    ],
    status: 'active',
    createdAt: '2026-09-05T12:00:00Z'
  },
  {
    id: 'crop-111',
    name: 'Yellow Soybean (JS-335 Variety)',
    category: 'Oilseeds',
    quantity: 150,
    unit: 'Quintal',
    pricePerUnit: 4750,
    mandiPrice: 4550,
    mspPrice: 4300,
    isOrganic: false,
    organicCertNo: '',
    harvestDaysAgo: 2,
    harvestDate: '2026-09-08',
    freshnessIndex: 95,
    grade: 'A',
    gradeLabel: 'Certified Seed Harvest',
    qualitySpecs: {
      moisture: 8.8,
      foreignMatter: 0.7,
      uniformity: 94,
      grainSize: 'Oil 20% / Protein 40%'
    },
    farmerId: 'farmer-8',
    farmerName: 'Mahesh Patil',
    farmLocation: 'Latur Agro-Market, Maharashtra',
    coordinates: { lat: 18.4088, lng: 76.5604 },
    deliveryRadiusKm: 110,
    imageUrl: 'https://images.unsplash.com/photo-1599307767316-776533bb941c?auto=format&fit=crop&w=800&q=80',
    description: 'High protein yellow soybean with 20% oil content and 40% protein. Ideal for soymilk, tofu, and cold milling.',
    interestedBuyers: [
      { id: 'b-14', name: 'SoyaRich Proteins Pune', type: 'Commercial Mill', offeredPrice: 4700, qtyNeeded: 100, distanceKm: 190, rating: 4.7 }
    ],
    status: 'active',
    createdAt: '2026-09-08T14:30:00Z'
  },
  {
    id: 'crop-112',
    name: 'Shankar-6 Long Staple Cotton',
    category: 'Cash Crops',
    quantity: 80,
    unit: 'Quintal',
    pricePerUnit: 7100,
    mandiPrice: 6800,
    mspPrice: 6620,
    isOrganic: false,
    organicCertNo: '',
    harvestDaysAgo: 3,
    harvestDate: '2026-09-07',
    freshnessIndex: 94,
    grade: 'A',
    gradeLabel: 'Spinning Mill Premium',
    qualitySpecs: {
      moisture: 7.5,
      foreignMatter: 1.2,
      uniformity: 93,
      grainSize: 'Staple Length 28.5mm'
    },
    farmerId: 'farmer-9',
    farmerName: 'Mansukhbhai Patel',
    farmLocation: 'Rajkot Cotton Belt, Gujarat',
    coordinates: { lat: 22.3039, lng: 70.8022 },
    deliveryRadiusKm: 130,
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    description: 'Shankar-6 white cotton with 28mm staple length and high tensile micronaire strength. Clean ginning grade.',
    interestedBuyers: [
      { id: 'b-15', name: 'Vardhman Spinning Consortium', type: 'Textile Mill', offeredPrice: 7050, qtyNeeded: 80, distanceKm: 150, rating: 4.9 }
    ],
    status: 'active',
    createdAt: '2026-09-07T16:00:00Z'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ord-900',
    cropId: 'crop-101',
    cropName: 'Sharbati Golden Wheat',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    buyerId: 'buyer-201',
    buyerName: 'Priya Sharma (GreenBites Co-op)',
    buyerType: 'Consumer Collective',
    buyerPhone: '+91 98201 44552',
    deliveryAddress: 'Flat 402, Sunshine Heights, Kalyani Nagar, Pune, MH 411006',
    distanceKm: 48,
    quantity: 15,
    unit: 'Quintal',
    listedPrice: 2650,
    offeredPrice: 2650,
    totalAmount: 39750,
    paymentMode: 'UPI / Direct Mandi Escrow',
    status: 'delivered',
    assignedDriverId: 'driver-301',
    createdAt: '2026-09-05T09:30:00Z',
    notes: 'Successfully delivered to buyer warehouse. Quality verified.',
    reviewRating: 5.0,
    reviewText: 'Outstanding harvest freshness and crisp quality! Direct mandi dispatch arrived right on schedule.',
    reviewTags: ['Farm Fresh Quality', 'Punctual Delivery', 'Pristine Packaging']
  },
  {
    id: 'ord-901',
    cropId: 'crop-101',
    cropName: 'Sharbati Golden Wheat',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    buyerId: 'buyer-201',
    buyerName: 'Priya Sharma (GreenBites Co-op)',
    buyerType: 'Consumer Collective',
    buyerPhone: '+91 98201 44552',
    deliveryAddress: 'Flat 402, Sunshine Heights, Kalyani Nagar, Pune, MH 411006',
    distanceKm: 48,
    quantity: 20,
    unit: 'Quintal',
    listedPrice: 2650,
    offeredPrice: 2600,
    totalAmount: 52000,
    paymentMode: 'UPI / Mandi Escrow',
    status: 'pending',
    createdAt: '2026-09-09T18:30:00Z',
    notes: 'Please verify packaging in moisture-proof 50kg gunny bags.'
  },
  {
    id: 'ord-902',
    cropId: 'crop-104',
    cropName: 'Red Hybrid Vine Tomatoes',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    buyerId: 'buyer-202',
    buyerName: 'Vikram Mehta (Apex Kitchens)',
    buyerType: 'Restaurant Fleet',
    buyerPhone: '+91 94220 89112',
    deliveryAddress: 'Central Commissary, MIDC Bhosari, Pune, MH 411026',
    distanceKm: 54,
    quantity: 80,
    unit: 'Crates',
    listedPrice: 480,
    offeredPrice: 460,
    totalAmount: 36800,
    paymentMode: 'Kisan Pay NetBanking',
    status: 'pending',
    createdAt: '2026-09-09T20:15:00Z',
    notes: 'Urgent early morning delivery requested by 6:00 AM.'
  },
  {
    id: 'ord-903',
    cropId: 'crop-102',
    cropName: 'Alphonso Ratnagiri Mangoes',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    buyerId: 'buyer-203',
    buyerName: 'Aditi Deshmukh',
    buyerType: 'Direct Household',
    buyerPhone: '+91 91672 33490',
    deliveryAddress: 'Row House 12, Baner Pashan Link Rd, Pune',
    distanceKm: 62,
    quantity: 5,
    unit: 'Crates',
    listedPrice: 1850,
    offeredPrice: 1850,
    totalAmount: 9250,
    paymentMode: 'UPI Instant',
    status: 'accepted',
    assignedDriverId: 'driver-301',
    createdAt: '2026-09-09T14:10:00Z',
    notes: 'GI tagged authentication seal required.'
  },
  {
    id: 'ord-904',
    cropId: 'crop-101',
    cropName: 'Sharbati Golden Wheat',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    buyerId: 'buyer-204',
    buyerName: 'Sahyadri Flour Mills',
    buyerType: 'Commercial Processor',
    buyerPhone: '+91 98811 77209',
    deliveryAddress: 'Sector 7, Chakan Industrial Area, Pune',
    distanceKm: 58,
    quantity: 25,
    unit: 'Quintal',
    listedPrice: 2650,
    offeredPrice: 2550,
    totalAmount: 63750,
    paymentMode: 'Mandi Escrow',
    status: 'dispatched',
    assignedDriverId: 'driver-301',
    createdAt: '2026-09-08T11:00:00Z',
    notes: 'Dispatched via Gurpreet Logistics. In transit.'
  }
];

const INITIAL_DRIVER_DATA = {
  driverId: 'driver-301',
  name: 'Gurpreet Singh',
  phone: '+91 98765 43210',
  licenseNo: 'MH-15-2018009214',
  vehicleNo: 'MH-15-EG-4482',
  vehicleType: '10-Wheeler Multi-Axle Truck',
  fuelType: 'BS-VI Diesel / Green-CNG Hybrid',
  maxCapacityTons: 10.0,
  bookedCapacityTons: 6.5,
  availableCapacityTons: 3.5,
  pricing: {
    basePerKm: 28,
    perQuintalPer100Km: 16,
    minTripCharge: 1200,
    reeferSurchargePercent: 15
  },
  assignedRoute: {
    tripId: 'TRIP-8842',
    orderId: 'ord-904',
    status: 'in_transit',
    statusLabel: 'In Transit to Destination',
    transitSpecs: {
      sealNumber: 'SEAL-MH15-88914',
      ambientTemp: '21.8°C (Optimal)',
      ambientHumidity: '52% RH',
      fastagStatus: 'Cleared (Toll #NETC-091)',
      ewayBillNo: 'EWB-2026-99041289',
      estFuelLiters: '28.5 L',
      marineInsurance: 'Active (Cover: ₹25L)'
    },
    origin: {
      name: 'Ramesh Patel Farm (Nashik Agro-Cluster)',
      address: 'Plot 44, Gat 112, Dindori Agro-Zone, Nashik, MH 422202',
      shortAddress: 'Dindori Agro-Zone, Nashik',
      fullAddress: 'Plot 44, Gat No. 112, Dindori Agro-Zone, Nashik, Maharashtra 422202',
      contact: 'Ramesh Patel (+91 94231 88901)',
      departureTime: 'Today, 08:30 AM'
    },
    destination: {
      name: 'Sahyadri Flour Mills (Chakan Hub)',
      address: 'Sector 7, Chakan Industrial Phase 2, Pune, MH 410501',
      shortAddress: 'Sector 7, Chakan Phase 2, Pune',
      fullAddress: 'Plot C-14, Sector 7, MIDC Chakan Industrial Phase 2, Pune, Maharashtra 410501',
      contact: 'Mr. Joshi (+91 98811 77209)',
      estimatedArrival: 'Today, 01:15 PM'
    },
    cargo: {
      cropName: 'Sharbati Golden Wheat (Grade A+)',
      quantity: '25 Quintals (50 Bags)',
      packaging: '50kg Moisture-Barrier Jute Sacks',
      batchCode: 'LOT-WHEAT-NSK-4402',
      weightTons: 2.5,
      isOrganic: true,
      perishableRisk: 'Low (Dry Commodity Sealed)'
    },
    routeStats: {
      totalDistanceKm: 164,
      coveredDistanceKm: 98,
      remainingDistanceKm: 66,
      estimatedHours: '3h 45m',
      tollBooths: 2,
      tripFee: 5450,
      fuelUsedLiters: 22
    },
    waypoints: [
      { name: 'Nashik Farm Gate (Point A)', time: '08:30 AM', completed: true },
      { name: 'Sinnar Toll Plaza', time: '09:40 AM', completed: true },
      { name: 'Sangamner Bypass (Current)', time: '10:55 AM', completed: true, isCurrent: true },
      { name: 'Alephata Junction', time: '11:45 AM (Est)', completed: false },
      { name: 'Chakan Hub, Pune (Point B)', time: '01:15 PM (Est)', completed: false }
    ]
  },
  orderHistory: [
    {
      tripId: 'TRIP-8839',
      date: '07 Sep 2026',
      cropHaul: 'Vine Ripe Tomatoes (120 Crates • 3.0 Tons)',
      packaging: 'Ventilated Plastic Crates',
      route: 'Nashik Farm Cluster ➔ Pune APMC Yard',
      distanceKm: 160,
      payout: 4800,
      status: 'Delivered',
      rating: 5.0
    },
    {
      tripId: 'TRIP-8835',
      date: '05 Sep 2026',
      cropHaul: 'Organic Basmati Rice (40 Quintals • 4.0 Tons)',
      packaging: 'Double Gunny Sacks',
      route: 'Dindori Farm ➔ Chakan Processing Dock',
      distanceKm: 145,
      payout: 5200,
      status: 'Delivered',
      rating: 4.9
    }
  ],
  availableLoads: [
    {
      id: 'load-501',
      orderId: 'ord-903',
      cropName: 'Alphonso Ratnagiri Mangoes (GI)',
      from: 'Ratnagiri Orchards',
      to: 'Baner Link Rd, Pune',
      weightTons: 0.8,
      distanceKm: 130,
      payout: 3800,
      urgency: 'High (Fragile)'
    },
    {
      id: 'load-502',
      orderId: 'ord-901',
      cropName: 'Sharbati Golden Wheat',
      from: 'Nashik Agro-Cluster',
      to: 'Kalyani Nagar, Pune',
      weightTons: 2.0,
      distanceKm: 155,
      payout: 4600,
      urgency: 'Standard'
    }
  ],
  stats: {
    todayEarnings: 8250,
    weeklyTrips: 9,
    dieselEfficiency: '4.2 km/L',
    rating: 4.95
  }
};

const SMS_BULLETINS = [
  {
    id: 'sms-1',
    sender: 'AGMARKNET-MAH',
    title: 'Daily APMC Mandi Benchmark Rates',
    time: 'Today 06:00 AM',
    category: 'Mandi Rate',
    content: 'Nashik APMC Wheat Grade-A trading at ₹2,420-₹2,550/qtl. Onion arrivals steady at ₹1,800/qtl. MSP minimum floor ₹2,275 actively enforced.',
    urgent: false
  },
  {
    id: 'sms-2',
    sender: 'IMD-MAUSAM',
    title: 'IMD Agro-Meteorological Weather Advisory',
    time: 'Yesterday 05:30 PM',
    category: 'Weather Alert',
    content: 'Light to moderate convective showers expected across North Maharashtra next 48 hrs. Farmers advised to tarp harvested open paddy & dry cereals in covered sheds.',
    urgent: true
  },
  {
    id: 'sms-3',
    sender: 'MIN-AGRI-GOVT',
    title: 'Central MSP & PM-Kisan Procurement Update',
    time: '07 Sep 2026',
    category: 'Govt Policy',
    content: 'Paddy & Soybean MSP direct procurement window opens Sept 15. Electronic warehouse e-NWR receipts eligible for instant zero-collateral Kisan advances.',
    urgent: false
  }
];

const OPERATIONAL_PROFILES = {
  farmer: {
    id: 'farmer-1',
    roleKey: 'farmer',
    name: 'Ramesh Patel',
    tagline: 'Progressive Certified Cultivator & Farm Cluster Head',
    avatar: '🌾',
    phone: '+91 94231 88901',
    email: 'ramesh.patel.kisan@agri.gov.in',
    upiId: 'ramesh.kisan@sbi',
    govtId: 'Kisan Credit Passbook #MH-NSK-4402',
    eNamId: 'e-NAM ID: MH/APMC/NSK/2021-9941',
    kycStatus: 'e-NAM & DigiLocker Verified',
    location: 'Plot 44, Dindori Agro-Zone, Nashik, Maharashtra 422202',
    coordinates: '19.9975° N, 73.7898° E',
    landHolding: '12.5 Acres (9.0A Drip Irrigated • 3.5A Climate Polyhouse)',
    soilHealthCard: 'SHC-MH-2025-8812 (Optimal NPK Cleared, pH 7.2)',
    primaryCrops: ['Sharbati Golden Wheat', 'Alphonso Ratnagiri Mangoes', 'Red Hybrid Tomatoes'],
    certifications: [
      { name: 'NPOP Organic India', certNo: 'NPOP/NAB/0019/MH', status: 'Valid till Nov 2027' },
      { name: 'Soil Health Card', certNo: 'SHC-MH-2025-8812', status: 'Cleared & Optimal' },
      { name: 'National Horticulture Board (NHB)', certNo: 'NHB/MH/2026-99', status: 'Optimal' },
      { name: 'Jaivik Bharat Green Seal', certNo: 'JB-MH-2026-44', status: 'Active' }
    ],
    storageCapacity: '200 Quintals Ventilated Silo • 400 Crates Cold Storage Shed',
    irrigationType: 'Solar Powered Micro-Drip with Fertigation Unit',
    financials: {
      bank: 'State Bank of India (Dindori Branch)',
      accountNo: '•••• •••• •••• 9812',
      ifsc: 'SBIN0004128',
      kccLimit: '₹4,50,000 (Available: ₹3,30,000)',
      mandiEscrowUpi: 'ramesh.kisan@sbi',
      settlementSpeed: 'Direct DBT / Instant Escrow Release'
    },
    operationalStatus: {
      isOnDuty: true,
      statusLabel: 'Farm Active • Harvesting & Accepting Orders',
      currentSeason: 'Kharif-Rabi Transition',
      nextHarvestReady: 'Sharbati Wheat batch (15 days)',
      rating: 4.9,
      reviewsCount: 38,
      lotsDelivered: 54,
      onTimeFulfillment: '100%'
    }
  },
  consumer: {
    id: 'buyer-201',
    roleKey: 'consumer',
    name: 'Priya Sharma',
    tagline: 'Procurement Lead, GreenBites Consumer Co-op & Artisan Kitchens',
    avatar: '🛒',
    phone: '+91 98201 44552',
    email: 'procure@greenbites.coop',
    upiId: 'greenbites.escrow@hdfcbank',
    govtId: 'FSSAI License #11522038000491',
    eNamId: 'GSTIN: 27AABCG9821C1Z4',
    kycStatus: 'Corporate & PAN KYC Verified',
    location: 'Flat 402 & Central Receiving Dock, Sunshine Heights, Kalyani Nagar, Pune, MH 411006',
    coordinates: '18.5480° N, 73.9038° E',
    landHolding: 'Central Commissary Warehouse & 4 Regional Retail Hubs (Pune East & West)',
    soilHealthCard: 'FSSAI Clean Food Safety Certified (A+ Grade)',
    primaryCrops: ['Organic Cereals', 'Fresh Vine Produce', 'GI Fruit Batches'],
    certifications: [
      { name: 'FSSAI Central Food License', certNo: 'FSSAI-11522038000491', status: 'Active & Compliant' },
      { name: 'Fair-Price MSP Compliance', certNo: 'MSP-PLEDGE-98', status: 'A+ Verified Buyer' },
      { name: 'Cold-Chain HACCP Standard', certNo: 'HACCP-MH-2025', status: 'Inspected Aug 2026' }
    ],
    storageCapacity: 'Walk-in Cold Storage Room (15 Tons) • 2 Heavy Pallet Receiving Docks',
    irrigationType: 'N/A (Wholesale Procurement & Food Distribution)',
    financials: {
      bank: 'HDFC Corporate Banking (Pune Main Branch)',
      accountNo: '•••• •••• •••• 4421',
      ifsc: 'HDFC0000039',
      kccLimit: 'Mandi Escrow Wallet: ₹2,50,000 (Instant Clearing)',
      mandiEscrowUpi: 'greenbites.escrow@hdfcbank',
      settlementSpeed: 'Instant Release upon OTP Delivery Confirmation'
    },
    operationalStatus: {
      isOnDuty: true,
      statusLabel: 'Procurement Active • Open for Farmer Quotations',
      currentSeason: 'Weekly Bulk Sourcing Cycle',
      nextHarvestReady: 'Seeking 50 Qtl Organic Wheat & 100 Crates Mangoes',
      rating: 4.95,
      reviewsCount: 46,
      lotsDelivered: 42,
      onTimeFulfillment: '99.5%'
    }
  },
  driver: {
    id: 'driver-301',
    roleKey: 'driver',
    name: 'Gurpreet Singh',
    tagline: 'Heavy Commercial Agro-Fleet Operator & Kisan Vahan Partner',
    avatar: '🚚',
    phone: '+91 98765 43210',
    email: 'gurpreet.vahan@kisanlogistics.in',
    upiId: 'gurpreet.trans@pnb',
    govtId: 'Commercial Driving License #MH-15-2018009214',
    eNamId: 'Vahan RC: MH-15-EG-4482',
    kycStatus: 'Commercial Heavy Transport Endorsed (Valid till Aug 2031)',
    location: 'Base Logistics Yard: Sinnar Transport Nagar, Nashik, Maharashtra 422103',
    coordinates: '19.8450° N, 73.9850° E',
    landHolding: 'Fleet of 3 BS-VI Multi-Axle Trucks & 1 Reefer Cold-Van',
    soilHealthCard: 'Vehicle Green PUC & BS-VI Low Emission Cleared',
    primaryCrops: ['Perishable Horticulture', 'Grain Bags Freight', 'Inter-Mandi Corridors'],
    certifications: [
      { name: 'National Goods Permit (All-India)', certNo: 'NP-5521-MAH', status: 'Valid till 2028' },
      { name: 'Vehicle Fitness Certificate', certNo: 'FC-MH15-2024', status: 'Cleared (Next: Dec 2027)' },
      { name: 'Goods Transit Marine Insurance', certNo: 'POLICY-NIC-98123', status: '₹25 Lakhs Active Cover' },
      { name: 'FASTag Commercial National Tag', certNo: 'NETC-FAST-8812', status: 'Active (Bal: ₹3,840)' }
    ],
    storageCapacity: '10.0 Tons Net Payload (3.5 Tons Available Space)',
    irrigationType: 'GPS Fleet Tracking & Real-Time Temperature Monitoring (IoT)',
    financials: {
      bank: 'Punjab National Bank (Transport Nagar Branch)',
      accountNo: '•••• •••• •••• 7741',
      ifsc: 'PUNB0182400',
      kccLimit: 'Emergency Diesel & Toll Credit: ₹75,000',
      mandiEscrowUpi: 'gurpreet.trans@pnb',
      settlementSpeed: 'Auto-credited upon Consignee OTP verification'
    },
    operationalStatus: {
      isOnDuty: true,
      statusLabel: 'On-Duty • Transit Corridor Nashik-Pune Active',
      currentSeason: 'Monsoon-Harvest Freight Operations',
      nextHarvestReady: 'Return transit load space open from Pune to Nashik',
      rating: 4.95,
      reviewsCount: 112,
      lotsDelivered: 168,
      onTimeFulfillment: '99.2%'
    }
  }
};

class AppStore {
  constructor() {
    this.STORAGE_KEYS = {
      ROLE: 'kisansetu_active_role',
      CROPS: 'kisansetu_crops',
      ORDERS: 'kisansetu_orders',
      DRIVER: 'kisansetu_driver',
      CART: 'kisansetu_cart',
      USER: 'kisansetu_current_user',
      USERS: 'kisansetu_registered_users',
      PROFILES: 'kisansetu_profiles',
      PROFILES_BY_USER: 'kisansetu_profiles_by_user',
      NOTIFICATIONS: 'kisansetu_notifications'
    };
    this.listeners = [];
    this.init();
  }

  init() {
    // Seed crops if missing OR if the stored array is empty (data was accidentally deleted)
    const storedCrops = (() => { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CROPS)); } catch(e) { return null; } })();
    if (!storedCrops || !Array.isArray(storedCrops) || storedCrops.length === 0) {
      localStorage.setItem(this.STORAGE_KEYS.CROPS, JSON.stringify(INITIAL_CROPS));
    }
    // Seed orders if missing OR if the stored array is empty
    const storedOrders = (() => { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ORDERS)); } catch(e) { return null; } })();
    if (!storedOrders || !Array.isArray(storedOrders) || storedOrders.length === 0) {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.DRIVER)) {
      localStorage.setItem(this.STORAGE_KEYS.DRIVER, JSON.stringify(INITIAL_DRIVER_DATA));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.CART)) {
      localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.ROLE)) {
      localStorage.setItem(this.STORAGE_KEYS.ROLE, 'login');
    }
    // Seed notifications if missing OR if array is empty
    const storedNotifs = (() => { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS)); } catch(e) { return null; } })();
    if (!storedNotifs || !Array.isArray(storedNotifs) || storedNotifs.length === 0) {
      const seedNotifications = [
        // Farmer Notifications
        {
          id: 'notif-farmer-1',
          role: 'farmer',
          type: 'order',
          title: 'New Wholesale Order Received',
          message: 'Buyer Priya Sharma (GreenBites Collective) placed an order for 20 Quintals of Sharbati Golden Wheat at ₹2,650/Qtl (Total: ₹53,000).',
          timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
          timeAgo: '8m ago',
          read: false,
          cropName: 'Sharbati Golden Wheat',
          amount: '₹53,000'
        },
        {
          id: 'notif-farmer-2',
          role: 'farmer',
          type: 'price_alert',
          title: 'Mandi Wholesale Price Rise Alert',
          message: 'Nashik APMC Mandi rate for Wheat moved up to ₹2,420/Qtl. Your direct KisanSetu price (₹2,650) yields +₹230/Qtl higher profit.',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          timeAgo: '25m ago',
          read: false,
          cropName: 'Sharbati Golden Wheat'
        },
        {
          id: 'notif-farmer-3',
          role: 'farmer',
          type: 'transit',
          title: 'Truck Freight Pickup Scheduled',
          message: 'Driver Gurpreet Singh (Vehicle MH-15-EG-4482) accepted pickup for Order #ORD-101. Arriving at your farm gate in ~45 mins.',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          timeAgo: '45m ago',
          read: true,
          driverName: 'Gurpreet Singh'
        },
        {
          id: 'notif-farmer-4',
          role: 'farmer',
          type: 'escrow',
          title: 'Buyer Payment Deposited in Escrow',
          message: '₹53,000 advance escrow confirmed for Order #ORD-101. Funds will be released to your UPI upon delivery verification.',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          timeAgo: '1.5h ago',
          read: true,
          amount: '₹53,000'
        },

        // Consumer (Buyer) Notifications
        {
          id: 'notif-consumer-1',
          role: 'consumer',
          type: 'accepted',
          title: 'Order Accepted by Farmer',
          message: 'Farmer Ramesh Patel ACCEPTED your purchase order for 20 Quintals Sharbati Golden Wheat at ₹2,650/Qtl. Produce being bagged.',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          timeAgo: '15m ago',
          read: false,
          cropName: 'Sharbati Golden Wheat'
        },
        {
          id: 'notif-consumer-2',
          role: 'consumer',
          type: 'transit',
          title: 'Truck Dispatched • Live GPS Tracking Active',
          message: 'Carrier Gurpreet Singh has loaded your shipment and departed Nashik farm cluster. Current speed: 56 km/h. ETA: 2h 15m.',
          timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          timeAgo: '35m ago',
          read: false,
          truckNumber: 'MH-15-EG-4482'
        },
        {
          id: 'notif-consumer-3',
          role: 'consumer',
          type: 'harvest',
          title: 'Fresh GI Harvest Listed Near You',
          message: 'Tree-ripened Alphonso Ratnagiri Mangoes (Export Grade A+) just listed by Ramesh Patel at ₹1,850/Crate (within 150 km).',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          timeAgo: '1h ago',
          read: true,
          cropName: 'Alphonso Mangoes'
        },
        {
          id: 'notif-consumer-4',
          role: 'consumer',
          type: 'quality',
          title: 'Agmarknet Lab Quality Verified',
          message: 'Quality test passed: 10.2% moisture, 98% grain uniformity, zero pesticide residue for Order #ORD-101.',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          timeAgo: '2h ago',
          read: true
        },

        // Truck Driver Notifications
        {
          id: 'notif-driver-1',
          role: 'driver',
          type: 'load',
          title: 'New Freight Load Opportunity',
          message: 'New load available: 20 Quintals Wheat from Nashik Agro-Cluster to Pune Central Market. Guaranteed Freight: ₹4,800.',
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          timeAgo: '10m ago',
          read: false,
          fare: '₹4,800'
        },
        {
          id: 'notif-driver-2',
          role: 'driver',
          type: 'pickup',
          title: 'Farmer Marked Load Ready for Pickup',
          message: 'Farmer Ramesh Patel confirmed that 50 gunny bags of Grade A+ Wheat are weighed and ready at Gate 2, Nashik Agro-Cluster.',
          timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          timeAgo: '20m ago',
          read: false
        },
        {
          id: 'notif-driver-3',
          role: 'driver',
          type: 'route',
          title: 'Corridor Traffic & Toll Clearance',
          message: 'Fastag cleared at Ghoti Toll Plaza. NH-60 Bota Ghat bypass clear, average vehicle corridor speed is 55 km/h.',
          timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
          timeAgo: '50m ago',
          read: true
        },
        {
          id: 'notif-driver-4',
          role: 'driver',
          type: 'payment',
          title: 'Freight Payment Credited to UPI',
          message: '₹8,250 freight fare for completed Trip #TRIP-8840 has been transferred directly to your bank account (UPI: driver@okhdfcbank).',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          timeAgo: '3h ago',
          read: true,
          fare: '₹8,250'
        }
      ];
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(seedNotifications));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.PROFILES_BY_USER)) {
      const seedProfiles = {
        'farmer-1': { ...OPERATIONAL_PROFILES.farmer, id: 'farmer-1', userId: 'farmer-1' },
        'buyer-201': { ...OPERATIONAL_PROFILES.consumer, id: 'buyer-201', userId: 'buyer-201' },
        'driver-301': { ...OPERATIONAL_PROFILES.driver, id: 'driver-301', userId: 'driver-301' }
      };
      localStorage.setItem(this.STORAGE_KEYS.PROFILES_BY_USER, JSON.stringify(seedProfiles));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.USERS)) {
      const defaultUsers = [
        {
          id: 'farmer-1',
          role: 'farmer',
          name: 'Ramesh Patel',
          email: 'farmer@kisansetu.in',
          phone: '9423188901',
          password: 'password123',
          upiId: 'ramesh.kisan@sbi',
          govtId: 'Kisan Passbook #MH-NSK-4402',
          location: 'Plot 44, Dindori Agro-Zone, Nashik, Maharashtra',
          landHolding: '12.5 Acres',
          primaryCrop: 'Sharbati Golden Wheat'
        },
        {
          id: 'buyer-201',
          role: 'consumer',
          name: 'Priya Sharma',
          email: 'consumer@kisansetu.in',
          phone: '9820144552',
          password: 'password123',
          upiId: 'greenbites.escrow@hdfcbank',
          govtId: 'FSSAI License #11522038000491',
          location: 'Flat 402, Sunshine Heights, Kalyani Nagar, Pune',
          buyerType: 'Consumer Collective Co-op'
        },
        {
          id: 'driver-301',
          role: 'driver',
          name: 'Gurpreet Singh',
          email: 'driver@kisansetu.in',
          phone: '9876543210',
          password: 'password123',
          upiId: 'gurpreet.trans@pnb',
          govtId: 'Commercial DL #MH-15-2018009214',
          vehicleNo: 'MH-15-EG-4482',
          vehicleType: '10-Wheeler Multi-Axle Truck',
          location: 'Sinnar Transport Nagar, Nashik, Maharashtra'
        },
        {
          id: 'farmer-suresh',
          role: 'farmer',
          name: 'Suresh Adhikari',
          email: 'suresh.adhikari@kisansetu.in',
          phone: '9822019944',
          password: 'password123',
          upiId: 'suresh.adhikari@sbi',
          govtId: 'KCC-MH-NSK-9921',
          location: 'Nashik Agro-Cluster, Maharashtra',
          landHolding: '15 Acres',
          primaryCrop: 'Sharbati Golden Wheat, Vine Tomatoes',
          farmingMethod: 'Certified Organic (NPOP/Jaivik Bharat)',
          irrigationType: 'Automated Drip / Micro-Irrigation',
          soilType: 'Black Cotton Heavy Clay',
          storageCapacity: '50 MT Cold Storage'
        }
      ];
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
    this.initGpsTelemetry();

    // Trigger initial Database Synchronization
    this.syncCropsWithDatabase();
    this.syncOrdersWithDatabase();

    // Continuous Live Database Synchronization (every 2.5s)
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        this.syncCropsWithDatabase();
        this.syncOrdersWithDatabase();
      }, 2500);
    }

    // Cross-tab and cross-window real-time synchronization
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('storage', (e) => {
        if (e.key === this.STORAGE_KEYS.CROPS) {
          this.notify('crop_added', null);
        } else if (e.key === this.STORAGE_KEYS.ORDERS) {
          this.notify('order_updated', null);
          this.notify('order_added', null);
        } else if (e.key === this.STORAGE_KEYS.DRIVER) {
          this.notify('driver_updated', null);
          this.notify('route_updated', null);
        } else if (e.key === this.STORAGE_KEYS.NOTIFICATIONS) {
          this.notify('notifications_updated', null);
        }
      });
    }
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS)) || [];
    } catch (e) {
      return [];
    }
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USER));
    } catch (e) {
      return null;
    }
  }

  async loginUser(identifier, password, selectedRole) {
    identifier = identifier.trim().toLowerCase();

    // 1. Try server REST API first if server is running
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(data.user));
          this.ensureUserProfileExists(data.user);
          this.setActiveRole(data.user.role);
          this.notify('user_logged_in', data.user);
          return { success: true, user: data.user };
        }
      }
    } catch (err) {
      // Offline / direct file protocol fallback
    }

    // 2. Client-side database lookup fallback
    const users = this.getUsers();
    const user = users.find(u => 
      ((u.email && u.email.toLowerCase() === identifier) || (u.phone && String(u.phone) === identifier)) &&
      u.password === password
    );

    if (user) {
      if (selectedRole && user.role !== selectedRole) {
        return { success: false, error: `This account is registered as a ${user.role.toUpperCase()}. Please select the ${user.role.toUpperCase()} portal destination above.` };
      }
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
      this.ensureUserProfileExists(user);
      this.setActiveRole(user.role);
      this.notify('user_logged_in', user);
      return { success: true, user };
    }

    return { success: false, error: 'Invalid mobile/email or password.' };
  }

  // Standardized, Audited Pricing Calculation Engine
  calculatePricing(subtotal, distanceKm = 50) {
    const rawSubtotal = Math.max(0, Number(subtotal) || 0);
    if (rawSubtotal <= 0) {
      return {
        subtotal: 0,
        mandiCess: 0,
        platformFee: 0,
        freightCharge: 0,
        grandTotal: 0,
        savings: 0,
        retailSavings: 0
      };
    }
    const mandiCess = Math.round(rawSubtotal * 0.015); // 1.5% statutory APMC market fee
    const platformFee = Math.max(20, Math.round(rawSubtotal * 0.010)); // 1% tech & escrow protection fee, min ₹20
    const freightCharge = 450; // flat local agro-corridor logistics freight
    const grandTotal = rawSubtotal + mandiCess + platformFee + freightCharge;
    const savings = Math.round(rawSubtotal * 0.15); // 15% middleman brokerage eliminated

    return {
      subtotal: rawSubtotal,
      mandiCess,
      platformFee,
      freightCharge,
      grandTotal,
      savings,
      retailSavings: savings
    };
  }

  // Live OTP Verification Services
  async sendOtp(phone) {
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    // Fallback simulation if offline
    const dummyOtp = String(Math.floor(100000 + Math.random() * 900000));
    const pendingKey = 'kisansetu_pending_otp_' + cleanPhone;
    localStorage.setItem(pendingKey, JSON.stringify({ otp: dummyOtp, expiresAt: Date.now() + 300000 }));
    return {
      success: true,
      phone: cleanPhone,
      otp: dummyOtp,
      expiresInSeconds: 300,
      message: `OTP dispatched to +91 ${cleanPhone}.`
    };
  }

  async verifyOtp(phone, otp) {
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    const cleanOtp = String(otp || '').trim();
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, otp: cleanOtp })
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Invalid OTP verification code.' };
    } catch (e) {}

    // Fallback verification
    const pendingKey = 'kisansetu_pending_otp_' + cleanPhone;
    const item = localStorage.getItem(pendingKey);
    if (!item) return { success: false, error: 'No OTP pending for this number.' };
    try {
      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiresAt) return { success: false, error: 'OTP has expired. Please request a new code.' };
      if (parsed.otp !== cleanOtp) return { success: false, error: 'Incorrect OTP code.' };
      localStorage.removeItem(pendingKey);
      return { success: true, phone: cleanPhone, message: 'OTP verified successfully.' };
    } catch (e) {
      return { success: false, error: 'Failed to verify OTP.' };
    }
  }

  async registerUser(role, name, email, phone, password, extraFields = {}) {
    email = email.trim().toLowerCase();
    phone = phone.trim();
    const upiId = extraFields.upiId || extraFields.upi_id || `${email.split('@')[0]}@okaxis`;
    extraFields.upiId = upiId;

    // 1. Try server REST API first
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, name, email, phone, password, extra_fields: extraFields })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const userObj = {
            ...data.user,
            upiId: data.user.upiId || data.user.upi_id || upiId,
            govtId: data.user.govtId || data.user.govt_id || extraFields.govtId || `${role.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            enamId: data.user.enamId || data.user.enam_id || `KisanSetu/${role.toUpperCase()}/${Math.floor(1000 + Math.random() * 9000)}`,
            landHolding: data.user.landHolding || data.user.land_holding || extraFields.landHolding || extraFields.land_holding,
            buyerType: data.user.buyerType || data.user.buyer_type || extraFields.buyerType || extraFields.buyer_type,
            vehicleType: data.user.vehicleType || data.user.vehicle_type || extraFields.vehicleType || extraFields.vehicle_type,
            vehicleNo: data.user.vehicleNo || data.user.vehicle_no || extraFields.vehicleNo || extraFields.vehicle_no,
            location: data.user.location || extraFields.location || 'Rural Agro Belt',
            password
          };
          // Sync to local
          const users = this.getUsers().filter(u => u.email.toLowerCase() !== email && u.phone !== phone);
          users.push(userObj);
          localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
          localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(userObj));
          this.createProfileForNewUser(userObj, extraFields);
          this.setActiveRole(userObj.role);
          this.notify('user_registered', userObj);
          return { success: true, user: userObj };
        } else if (data.error) {
          return { success: false, error: data.error };
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        if (errData && errData.error) {
          return { success: false, error: errData.error };
        }
      }
    } catch (err) {
      // Offline fallback
    }

    // 2. Client-side database registration fallback
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === email || u.phone === phone)) {
      return { success: false, error: 'An account with this email or phone number already exists. Please sign in instead.' };
    }

    const newUser = {
      id: `${role}-${Date.now()}`,
      role,
      name,
      email,
      phone,
      password,
      upiId,
      location: extraFields.location || 'Rural Agro Belt',
      govtId: extraFields.govtId || `${role.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...extraFields
    };

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(newUser));
    this.createProfileForNewUser(newUser, extraFields);
    this.setActiveRole(role);
    this.notify('user_registered', newUser);
    return { success: true, user: newUser };
  }

  async resetPassword(identifier, newPassword) {
    identifier = identifier.trim().toLowerCase();

    // 1. Try server REST API first
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, newPassword })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Sync client-side database
          const users = this.getUsers();
          const userIdx = users.findIndex(u => u.email.toLowerCase() === identifier || u.phone === identifier);
          if (userIdx !== -1) {
            users[userIdx].password = newPassword;
            localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
          }
          return { success: true, message: data.message || 'Password reset successfully.' };
        } else {
          return { success: false, error: data.error || 'Password reset failed.' };
        }
      }
    } catch (err) {
      // Offline fallback
    }

    // 2. Client-side database lookup fallback
    const users = this.getUsers();
    const userIdx = users.findIndex(u => u.email.toLowerCase() === identifier || u.phone === identifier);
    if (userIdx !== -1) {
      users[userIdx].password = newPassword;
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
      return { success: true, message: `Password reset successfully for ${users[userIdx].name}.` };
    }

    return { success: false, error: 'No account found matching this email or phone number.' };
  }

  getProfilesByUser() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PROFILES_BY_USER));
      if (stored && typeof stored === 'object') return stored;
    } catch (e) {}

    const seedProfiles = {
      'farmer-1': { ...OPERATIONAL_PROFILES.farmer, id: 'farmer-1', userId: 'farmer-1' },
      'buyer-201': { ...OPERATIONAL_PROFILES.consumer, id: 'buyer-201', userId: 'buyer-201' },
      'driver-301': { ...OPERATIONAL_PROFILES.driver, id: 'driver-301', userId: 'driver-301' }
    };
    localStorage.setItem(this.STORAGE_KEYS.PROFILES_BY_USER, JSON.stringify(seedProfiles));
    return seedProfiles;
  }

  ensureUserProfileExists(user) {
    if (!user || !user.id) return;
    const profilesByUser = this.getProfilesByUser();
    if (!profilesByUser[user.id]) {
      this.createProfileForNewUser(user, user.operational_data || {});
    }
  }

  createProfileForNewUser(user, extraFields = {}) {
    const profilesByUser = this.getProfilesByUser();
    const roleKey = user.role;
    const upiId = user.upiId || extraFields.upiId || extraFields.upi_id || `${user.email.split('@')[0]}@okaxis`;
    const base = {
      id: user.id,
      userId: user.id,
      roleKey: user.role,
      name: user.name,
      tagline: roleKey === 'farmer' ? 'Verified Registered Cultivator' : roleKey === 'consumer' ? 'Direct Farm Commercial Buyer' : 'Registered Fleet Carrier',
      avatar: roleKey === 'farmer' ? '🌾' : roleKey === 'consumer' ? '🛒' : '🚚',
      phone: user.phone,
      email: user.email,
      upiId: upiId,
      govtId: user.govtId || `${user.role.toUpperCase()}-REG-${Date.now() % 10000}`,
      eNamId: `KisanSetu/${user.role.toUpperCase()}/${Date.now() % 10000}`,
      kycStatus: 'e-NAM & DigiLocker KYC Verified',
      location: user.location || extraFields.location || 'Registered Regional Cluster',
      coordinates: '19.9975° N, 73.7898° E',
      landHolding: extraFields.land_holding || extraFields.landHolding || (roleKey === 'farmer' ? 'Operational Cultivation Land' : ''),
      soilHealthCard: extraFields.soilType || (roleKey === 'farmer' ? 'Soil Health Standard Cleared (Optimal NPK)' : ''),
      farmingMethod: extraFields.farmingMethod || (roleKey === 'farmer' ? 'Conventional High-Yield Standard' : ''),
      irrigationType: extraFields.irrigationType || (roleKey === 'farmer' ? 'Drip / Micro-Irrigation (Automated)' : 'Commercial Agro Facilities'),
      primaryCrops: extraFields.primaryCrop ? (Array.isArray(extraFields.primaryCrop) ? extraFields.primaryCrop : extraFields.primaryCrop.split(',').map(s => s.trim())) : ['Seasonal Produce'],
      certifications: [
        { name: extraFields.farmingMethod ? `Practice: ${extraFields.farmingMethod}` : 'KisanSetu Direct Network', certNo: `KS-${Date.now() % 10000}`, status: 'Active 2026-2027' }
      ],
      storageCapacity: extraFields.storageCapacity || (roleKey === 'farmer' ? '50 MT Covered Farm Storage' : roleKey === 'driver' ? (extraFields.vehicle_capacity || '8.0 Tons Payload') : 'Receiving Bay (10 Tons)'),
      dockAddress: extraFields.dockAddress || extraFields.location || '',
      vehicleNo: extraFields.vehicleNo || extraFields.vehicle_no || '',
      vehicleType: extraFields.vehicleType || extraFields.vehicle_type || '',
      drivingLicense: extraFields.drivingLicense || extraFields.govtId || '',
      baseCorridor: extraFields.baseCorridor || '',
      financials: {
        bank: 'Primary Linked Settlement Account',
        accountNo: '•••• •••• ' + (user.phone ? user.phone.slice(-4) : '4421'),
        ifsc: 'SBIN0001234',
        kccLimit: 'Verified Escrow Guarantee',
        mandiEscrowUpi: upiId,
        settlementSpeed: 'Instant Direct Mandi Settlement'
      },
      operationalStatus: {
        isOnDuty: true,
        statusLabel: 'Account Active • Operational Grid Ready',
        currentSeason: 'Current Active Season',
        nextHarvestReady: 'Active Lots Ready',
        rating: 5.0,
        reviewsCount: 1,
        lotsDelivered: 0,
        onTimeFulfillment: '100%'
      }
    };
    profilesByUser[user.id] = base;
    localStorage.setItem(this.STORAGE_KEYS.PROFILES_BY_USER, JSON.stringify(profilesByUser));
    return base;
  }

  getProfile(roleOrUserId) {
    const currentUser = this.getCurrentUser();
    const profilesByUser = this.getProfilesByUser();

    // 1. If explicit user ID provided and profile exists
    if (roleOrUserId && profilesByUser[roleOrUserId]) {
      return profilesByUser[roleOrUserId];
    }

    // 2. If user is currently logged in
    if (currentUser) {
      if (!roleOrUserId || roleOrUserId === currentUser.role || roleOrUserId === currentUser.id) {
        if (!profilesByUser[currentUser.id]) {
          this.createProfileForNewUser(currentUser, currentUser.operational_data || {});
        }
        return profilesByUser[currentUser.id];
      }
    }

    // 3. Fallback by role to seeded accounts
    const roleMap = { farmer: 'farmer-1', consumer: 'buyer-201', driver: 'driver-301' };
    const defaultId = roleMap[roleOrUserId] || 'farmer-1';
    return profilesByUser[defaultId] || Object.values(profilesByUser)[0];
  }

  updateProfile(roleOrUserId, updates) {
    const currentUser = this.getCurrentUser();
    const profilesByUser = this.getProfilesByUser();
    let targetId = roleOrUserId;
    if (currentUser && (!roleOrUserId || roleOrUserId === currentUser.role || roleOrUserId === currentUser.id)) {
      targetId = currentUser.id;
    } else if (roleOrUserId === 'farmer') targetId = 'farmer-1';
    else if (roleOrUserId === 'consumer') targetId = 'buyer-201';
    else if (roleOrUserId === 'driver') targetId = 'driver-301';

    if (profilesByUser[targetId]) {
      profilesByUser[targetId] = { ...profilesByUser[targetId], ...updates };
      localStorage.setItem(this.STORAGE_KEYS.PROFILES_BY_USER, JSON.stringify(profilesByUser));
      this.notify('profile_updated', profilesByUser[targetId]);

      // Sync to SQLite backend asynchronously
      try {
        fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: targetId, profile: profilesByUser[targetId] })
        }).catch(() => {});
      } catch (e) {}

      return profilesByUser[targetId];
    }
    return null;
  }

  toggleDutyStatus(roleOrUserId) {
    const profile = this.getProfile(roleOrUserId);
    if (profile && profile.operationalStatus) {
      const current = profile.operationalStatus.isOnDuty;
      profile.operationalStatus.isOnDuty = !current;
      profile.operationalStatus.statusLabel = !current
        ? (profile.roleKey === 'farmer' ? 'Farm Active • Harvesting & Accepting Orders' : profile.roleKey === 'driver' ? 'On-Duty • Freight Corridors Active' : 'Procurement Active • Open for Quotations')
        : 'Paused / Off-Duty (Maintenance)';
      return this.updateProfile(profile.id, { operationalStatus: profile.operationalStatus });
    }
    return null;
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEYS.USER);
    this.setActiveRole('login');
    this.notify('user_logged_out', null);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event, payload) {
    this.listeners.forEach(l => {
      try {
        l(event, payload);
      } catch (err) {
        console.error(`Error notifying listener for ${event}:`, err);
      }
    });
  }

  getActiveRole() {
    const user = this.getCurrentUser();
    if (!user) return 'login';
    return localStorage.getItem(this.STORAGE_KEYS.ROLE) || user.role || 'farmer';
  }

  setActiveRole(role) {
    localStorage.setItem(this.STORAGE_KEYS.ROLE, role);
    this.notify('role_changed', role);
  }

  isSureshAdhikari(crop) {
    if (!crop) return false;
    const name = String(crop.farmerName || '').toLowerCase();
    const id = String(crop.farmerId || '').toLowerCase();
    if (name.includes('suresh adhikari') || name.includes('suresh') || id.includes('suresh')) return true;
    try {
      const currentUser = this.getCurrentUser();
      const currentUserName = (currentUser && currentUser.name) ? currentUser.name.toLowerCase() : '';
      const currentUserId = (currentUser && currentUser.id) ? currentUser.id.toLowerCase() : '';
      if ((currentUserName.includes('suresh') || currentUserId.includes('suresh')) && (id === currentUserId || name === currentUserName)) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  getCropCommodityKey(crop) {
    if (!crop) return '';
    const n = String(crop.name || '').toLowerCase()
      .replace(/[(),.\-\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (n.includes('wheat') || n.includes('gehun') || n.includes('gehu')) return 'commodity_wheat';
    if (n.includes('mango') || n.includes('aam') || n.includes('alphonso')) return 'commodity_mango';
    if (n.includes('basmati') || n.includes('paddy') || n.includes('rice') || n.includes('chawal')) return 'commodity_rice';
    if (n.includes('tomato') || n.includes('tamatar')) return 'commodity_tomato';
    if (n.includes('turmeric') || n.includes('haldi') || n.includes('curcumin')) return 'commodity_turmeric';
    if (n.includes('mustard') || n.includes('sarson')) return 'commodity_mustard';
    if (n.includes('onion') || n.includes('pyaz') || n.includes('kanda')) return 'commodity_onion';
    if (n.includes('orange') || n.includes('mandarin') || n.includes('santra') || n.includes('santee')) return 'commodity_orange';
    if (n.includes('chana') || n.includes('chickpea') || n.includes('gram')) return 'commodity_chana';
    if (n.includes('pepper') || n.includes('mirch') || n.includes('kali mirch')) return 'commodity_pepper';
    if (n.includes('soybean') || n.includes('soya')) return 'commodity_soybean';
    if (n.includes('cotton') || n.includes('kapas')) return 'commodity_cotton';
    if (n.includes('maize') || n.includes('maka') || n.includes('corn')) return 'commodity_maize';
    if (n.includes('potato') || n.includes('aalu') || n.includes('aloo')) return 'commodity_potato';
    if (n.includes('garlic') || n.includes('lahsun')) return 'commodity_garlic';
    if (n.includes('ginger') || n.includes('adrak')) return 'commodity_ginger';

    const cleanLetters = n.replace(/[^a-z0-9]/g, '');
    return (crop.category || '') + '::' + cleanLetters;
  }

  deduplicateCrops() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEYS.CROPS);
      let crops = [];
      if (raw) {
        try { crops = JSON.parse(raw); } catch (e) { crops = []; }
      }
      if (!Array.isArray(crops) || crops.length === 0) {
        crops = INITIAL_CROPS;
      }

      const groups = {};
      crops.forEach(crop => {
        const key = this.getCropCommodityKey(crop);
        if (!groups[key]) groups[key] = [];
        groups[key].push(crop);
      });

      const deduplicated = [];
      let modified = false;

      Object.keys(groups).forEach(key => {
        const items = groups[key];
        if (items.length === 1) {
          deduplicated.push(items[0]);
          return;
        }

        modified = true;
        const sureshItems = items.filter(c => this.isSureshAdhikari(c));
        if (sureshItems.length > 0) {
          deduplicated.push(...sureshItems);
        } else {
          deduplicated.push(items[0]);
        }
      });

      if (modified || deduplicated.length !== crops.length) {
        localStorage.setItem(this.STORAGE_KEYS.CROPS, JSON.stringify(deduplicated));
      }
      return deduplicated;
    } catch (e) {
      console.warn('deduplicateCrops error:', e);
      return INITIAL_CROPS;
    }
  }

  async syncCropsWithDatabase() {
    try {
      const res = await fetch('/api/crops', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const serverCrops = data.crops || [];
        if (Array.isArray(serverCrops) && serverCrops.length > 0) {
          const normalizedServerCrops = serverCrops.map(c => ({
            id: c.id,
            farmerId: String(c.farmer_id || c.farmerId || 'farmer-1'),
            farmerName: c.farmer_name || c.farmerName || 'Grower',
            name: c.name,
            category: c.category,
            quantity: parseFloat(c.quantity) || 10,
            unit: c.unit || 'Quintal',
            pricePerUnit: parseFloat(c.price_per_unit || c.pricePerUnit) || 2000,
            mandiPrice: parseFloat(c.mandi_price || c.mandiPrice) || 1800,
            mspPrice: parseFloat(c.msp_price || c.mspPrice) || 1700,
            isOrganic: Boolean(c.is_organic || c.isOrganic),
            organicCertNo: c.organic_cert_no || c.organicCertNo || '',
            harvestDaysAgo: parseInt(c.harvest_days_ago || c.harvestDaysAgo) || 0,
            harvestDate: c.harvest_date || c.harvestDate || new Date().toISOString().split('T')[0],
            freshnessIndex: parseFloat(c.freshness_index || c.freshnessIndex) || 95,
            grade: c.grade || 'A',
            gradeLabel: c.grade_label || c.gradeLabel || '',
            farmLocation: c.farm_location || c.farmLocation || 'Nashik Agro-Cluster, Maharashtra',
            deliveryRadiusKm: parseInt(c.delivery_radius_km || c.deliveryRadiusKm) || 150,
            imageUrl: c.image_url || c.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
            description: c.description || '',
            status: c.status || 'active',
            createdAt: c.created_at || c.createdAt || new Date().toISOString()
          }));

          const rawLocal = localStorage.getItem(this.STORAGE_KEYS.CROPS);
          let localCrops = [];
          try { localCrops = JSON.parse(rawLocal) || []; } catch (e) { localCrops = []; }
          
          const cropMap = new Map();
          normalizedServerCrops.forEach(c => cropMap.set(c.id, c));
          
          localCrops.forEach(c => {
            if (!cropMap.has(c.id)) {
              cropMap.set(c.id, c);
              fetch('/api/crops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(c)
              }).catch(() => {});
            }
          });

          const merged = Array.from(cropMap.values());
          localStorage.setItem(this.STORAGE_KEYS.CROPS, JSON.stringify(merged));
          const cleaned = this.deduplicateCrops();
          this.notify('crop_added', null);
          return cleaned;
        }
      }
    } catch (e) {
      // Offline fallback
    }
    return this.getCrops();
  }

  getCrops() {
    return this.deduplicateCrops();
  }

  addCrop(crop) {
    const raw = localStorage.getItem(this.STORAGE_KEYS.CROPS);
    let crops = [];
    try { crops = JSON.parse(raw) || []; } catch(e) { crops = []; }
    if (!Array.isArray(crops) || crops.length === 0) crops = [...INITIAL_CROPS];

    const newCrop = {
      ...crop,
      id: crop.id || ('crop-' + Date.now()),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    crops.unshift(newCrop);
    localStorage.setItem(this.STORAGE_KEYS.CROPS, JSON.stringify(crops));
    
    // Auto-deduplicate so that if Suresh Adhikari listed it, non-Suresh duplicates are removed
    this.deduplicateCrops();
    this.notify('crop_added', newCrop);

    // Sync to SQLite / Backend API with full fields
    try {
      fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCrop)
      }).then(() => {
        this.syncCropsWithDatabase();
      }).catch(() => {});
    } catch (e) {}

    return newCrop;
  }

  async deleteCrop(cropId) {
    let crops = this.getCrops();
    crops = crops.filter(c => c.id !== cropId);
    localStorage.setItem(this.STORAGE_KEYS.CROPS, JSON.stringify(crops));

    try {
      await fetch(`/api/crops?id=${cropId}`, { method: 'DELETE' });
    } catch (e) {}

    this.notify('crop_deleted', cropId);
    return true;
  }

  async syncOrdersWithDatabase() {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const serverOrders = data.orders || [];
        if (Array.isArray(serverOrders)) {
          const normalizedServerOrders = serverOrders.map(o => ({
            id: o.id,
            cropId: o.crop_id || o.cropId,
            cropName: o.crop_name || o.cropName,
            farmerId: String(o.farmer_id || o.farmerId),
            farmerName: o.farmer_name || o.farmerName,
            buyerId: String(o.buyer_id || o.buyerId),
            buyerName: o.buyer_name || o.buyerName,
            buyerPhone: o.buyer_phone || o.buyerPhone,
            buyerType: o.buyer_type || o.buyerType,
            deliveryAddress: o.delivery_address || o.deliveryAddress,
            distanceKm: parseFloat(o.distance_km || o.distanceKm) || 50,
            quantity: parseFloat(o.quantity) || 1,
            unit: o.unit || 'Quintal',
            listedPrice: parseFloat(o.listed_price || o.listedPrice) || 0,
            offeredPrice: parseFloat(o.offered_price || o.offeredPrice) || 0,
            counterPrice: o.counter_price != null ? parseFloat(o.counter_price) : (o.counterPrice || null),
            subtotal: parseFloat(o.subtotal) || 0,
            mandiCess: parseFloat(o.mandi_cess || o.mandiCess) || 0,
            platformFee: parseFloat(o.platform_fee || o.platformFee) || 0,
            freightCharge: parseFloat(o.freight_charge || o.freightCharge) || 0,
            totalAmount: parseFloat(o.total_amount || o.totalAmount) || 0,
            paymentMode: o.payment_mode || o.paymentMode || 'UPI / Mandi Escrow',
            status: o.status || 'pending',
            assignedDriverId: o.assigned_driver_id || o.assignedDriverId || null,
            notes: o.notes || '',
            createdAt: o.created_at || o.createdAt || new Date().toISOString()
          }));

          const rawLocal = localStorage.getItem(this.STORAGE_KEYS.ORDERS);
          let localOrders = [];
          try { localOrders = JSON.parse(rawLocal) || []; } catch (e) { localOrders = []; }

          const orderMap = new Map();
          normalizedServerOrders.forEach(o => orderMap.set(o.id, o));

          // Merge local orders that might not be on server yet
          localOrders.forEach(o => {
            if (!orderMap.has(o.id)) {
              orderMap.set(o.id, o);
              fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(o)
              }).catch(() => {});
            }
          });

          const mergedOrders = Array.from(orderMap.values());
          localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(mergedOrders));

          // Check driver freight loads
          mergedOrders.forEach(ord => {
            this.createDriverLoad(ord);
          });

          this.notify('order_updated', null);
          this.notify('order_added', null);
          return mergedOrders;
        }
      }
    } catch (e) {
      // Offline fallback
    }
    return this.getOrders();
  }

  getOrders(filterId = null) {
    try {
      const data = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ORDERS));
      const list = (Array.isArray(data) && data.length > 0) ? data : INITIAL_ORDERS;
      if (!filterId) return list;
      const fId = String(filterId);
      return list.filter(o => String(o.farmerId) === fId || String(o.buyerId) === fId);
    } catch (e) {
      return INITIAL_ORDERS;
    }
  }

  addOrder(order) {
    const orders = this.getOrders();
    const newOrder = {
      ...order,
      id: order.id || ('ord-' + Date.now()),
      status: order.status || 'pending',
      createdAt: order.createdAt || new Date().toISOString()
    };
    orders.unshift(newOrder);
    localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // 1. Real-time notification to the Farmer
    this.addNotification(
      'order',
      'New Purchase Order Received',
      `Buyer ${newOrder.buyerName || 'Verified Buyer'} placed an order for ${newOrder.quantity} ${newOrder.unit} of ${newOrder.cropName} (Total: ₹${(newOrder.totalAmount || newOrder.subtotal || 0).toLocaleString('en-IN')}).`,
      { role: 'farmer', farmerId: newOrder.farmerId, orderId: newOrder.id, cropName: newOrder.cropName }
    );

    // 2. Automatically generate an available freight load for the Truck Driver
    const driverLoad = this.createDriverLoad(newOrder);

    // 3. Real-time notification to Truck Driver
    this.addNotification(
      'load',
      'New Freight Consignment Available',
      `New freight load: ${newOrder.quantity} ${newOrder.unit} of ${newOrder.cropName} from ${newOrder.farmerName || 'Farmer'} to ${newOrder.deliveryAddress || 'Consumer Hub'}.`,
      { role: 'driver', orderId: newOrder.id, loadId: driverLoad ? driverLoad.id : null }
    );

    this.notify('order_added', newOrder);

    // Sync to SQLite backend and trigger DB sync
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).then(() => {
        this.syncOrdersWithDatabase();
      }).catch(() => {});
    } catch (e) {}

    return newOrder;
  }

  updateOrderStatus(orderId, status, extraData = {}) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
      orders[orderIndex].status = status;
      Object.assign(orders[orderIndex], extraData);
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      const updatedOrder = orders[orderIndex];

      if (status === 'accepted') {
        this.createDriverLoad(updatedOrder);
        this.addNotification(
          'accepted',
          'Order Accepted by Farmer',
          `Farmer ${updatedOrder.farmerName || 'Grower'} accepted order #${updatedOrder.id} (${updatedOrder.cropName}). Freight transport scheduled.`,
          { role: 'consumer', orderId: updatedOrder.id, buyerId: updatedOrder.buyerId }
        );
      } else if (status === 'declined') {
        this.declineDriverLoadByOrderId(orderId);
        this.addNotification(
          'declined',
          'Order Declined by Farmer',
          `Farmer ${updatedOrder.farmerName || 'Grower'} was unable to accept order #${updatedOrder.id}. Escrow deposit refunded.`,
          { role: 'consumer', orderId: updatedOrder.id, buyerId: updatedOrder.buyerId }
        );
      } else if (status === 'dispatched' || status === 'in_transit') {
        this.addNotification(
          'transit',
          'Freight In Transit',
          `Consignment for Order #${updatedOrder.id} (${updatedOrder.cropName}) is on the road with verified carrier. Live GPS tracking active.`,
          { role: 'all', orderId: updatedOrder.id }
        );
      } else if (status === 'delivered') {
        this.addNotification(
          'delivered',
          'Consignment Delivered Successfully',
          `Order #${updatedOrder.id} (${updatedOrder.cropName}) has been delivered and verified via OTP. Escrow payout released!`,
          { role: 'all', orderId: updatedOrder.id }
        );
      }

      this.notify('order_updated', updatedOrder);

      // Sync to SQLite backend
      try {
        fetch('/api/orders/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status, notes: extraData.notes || '' })
        }).catch(() => {
          fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status, notes: extraData.notes || '' })
          }).catch(() => {});
        });
      } catch (e) {}

      return updatedOrder;
    }
    return null;
  }

  // Multi-round Counter-Offer Negotiation Methods
  async counterOrder(orderId, proposedPrice, notes = '', role = 'farmer') {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const price = parseFloat(proposedPrice);
    const pricing = this.calculatePricing(order.quantity * price, order.distanceKm || 50);

    order.status = 'countered';
    order.counterPrice = price;
    order.subtotal = pricing.subtotal;
    order.mandiCess = pricing.mandiCess;
    order.platformFee = pricing.platformFee;
    order.freightCharge = pricing.freightCharge;
    order.totalAmount = pricing.grandTotal;
    order.counterNotes = notes;
    order.notes = notes || `Counter-offer of ₹${price}/${order.unit} proposed by ${role}.`;

    localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notify('order_updated', order);

    try {
      const user = this.getCurrentUser() || {};
      await fetch('/api/orders/counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          role,
          userId: user.id || (role === 'farmer' ? 'farmer-1' : 'buyer-201'),
          userName: user.name || (role === 'farmer' ? 'Farmer Ramesh Patel' : 'Priya Sharma'),
          proposedPrice: price,
          notes
        })
      });
    } catch (e) {}

    return { success: true, order, pricing };
  }

  async respondCounterOrder(orderId, action, newPrice = null, notes = '') {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    if (action === 'accept') {
      const finalPrice = order.counterPrice || order.offeredPrice;
      const pricing = this.calculatePricing(order.quantity * finalPrice, order.distanceKm || 50);
      order.status = 'accepted';
      order.offeredPrice = finalPrice;
      order.subtotal = pricing.subtotal;
      order.mandiCess = pricing.mandiCess;
      order.platformFee = pricing.platformFee;
      order.freightCharge = pricing.freightCharge;
      order.totalAmount = pricing.grandTotal;
      order.notes = notes || `Counter-offer accepted at agreed rate of ₹${finalPrice}/${order.unit}.`;

      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.createDriverLoad(order);
      this.notify('order_updated', order);

      try {
        const user = this.getCurrentUser() || {};
        await fetch('/api/orders/counter/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            action: 'accept',
            userId: user.id || 'buyer-201',
            userName: user.name || 'Priya Sharma',
            notes
          })
        });
      } catch (e) {}

      return { success: true, status: 'accepted', order, pricing };
    } else if (action === 'decline') {
      order.status = 'declined';
      order.notes = notes || 'Negotiation declined by buyer.';
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notify('order_updated', order);

      try {
        await fetch('/api/orders/counter/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, action: 'decline', notes })
        });
      } catch (e) {}

      return { success: true, status: 'declined', order };
    } else if (action === 'counter') {
      return this.counterOrder(orderId, newPrice, notes, 'consumer');
    }
  }

  async addOrderReview(orderId, rating, reviewText, tags = []) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.reviewRating = parseFloat(rating);
      order.reviewText = reviewText;
      order.reviewTags = tags;
      order.reviewedAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));

      try {
        await fetch('/api/orders/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, rating, reviewText, tags })
        });
      } catch (e) {}

      this.notify('order_reviewed', order);
      this.notify('order_updated', order);
      return order;
    }
    return null;
  }

  getDriverData() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.DRIVER)) || INITIAL_DRIVER_DATA;
    } catch (e) {
      return INITIAL_DRIVER_DATA;
    }
  }

  getDriverLoads() {
    const driver = this.getDriverData();
    return (driver && Array.isArray(driver.availableLoads)) ? driver.availableLoads : [];
  }

  updateDriverCapacity(capacityTons, vehicleType) {
    const driver = this.getDriverData();
    driver.maxCapacityTons = parseFloat(capacityTons);
    driver.availableCapacityTons = Math.max(0, driver.maxCapacityTons - driver.bookedCapacityTons);
    if (vehicleType) driver.vehicleType = vehicleType;
    localStorage.setItem(this.STORAGE_KEYS.DRIVER, JSON.stringify(driver));
    this.notify('driver_updated', driver);
  }

  updateDriverPricing(basePerKm, perQuintal) {
    const driver = this.getDriverData();
    driver.pricing.basePerKm = parseFloat(basePerKm);
    driver.pricing.perQuintalPer100Km = parseFloat(perQuintal);
    localStorage.setItem(this.STORAGE_KEYS.DRIVER, JSON.stringify(driver));
    this.notify('driver_updated', driver);
  }

  updateRouteStatus(status, statusLabel) {
    const driver = this.getDriverData();
    if (driver.assignedRoute) {
      driver.assignedRoute.status = status;
      driver.assignedRoute.statusLabel = statusLabel;
      if (status === 'delivered') {
        const cargoWeight = driver.assignedRoute.cargo?.weightTons || 2.5;
        const tripFee = driver.assignedRoute.routeStats?.tripFee || 3500;
        driver.bookedCapacityTons = Math.max(0, driver.bookedCapacityTons - cargoWeight);
        driver.availableCapacityTons = driver.maxCapacityTons - driver.bookedCapacityTons;
        driver.stats.todayEarnings = (driver.stats.todayEarnings || 0) + tripFee;
        driver.stats.completedTrips = (driver.stats.completedTrips || 0) + 1;

        if (!driver.tripHistory) driver.tripHistory = [];
        driver.tripHistory.unshift({
          id: driver.assignedRoute.tripId || ('TRIP-' + Date.now()),
          orderId: driver.assignedRoute.orderId,
          cropName: driver.assignedRoute.cargo?.cropName || 'Farm Consignment',
          from: driver.assignedRoute.origin?.name || 'Farm Gate',
          to: driver.assignedRoute.destination?.name || 'Consumer Drop Point',
          date: new Date().toISOString().split('T')[0],
          weightTons: cargoWeight,
          payout: tripFee,
          rating: 5.0,
          status: 'Delivered On-Time'
        });
      }
      localStorage.setItem(this.STORAGE_KEYS.DRIVER, JSON.stringify(driver));
      this.notify('route_updated', driver.assignedRoute);
      this.notify('driver_updated', driver);

      if (driver.assignedRoute.orderId) {
        this.updateOrderStatus(driver.assignedRoute.orderId, status === 'delivered' ? 'delivered' : 'in_transit');
      }
    }
  }

  createDriverLoad(order) {
    const driver = this.getDriverData();
    if (!driver.availableLoads) driver.availableLoads = [];

    // Avoid duplicate loads for same order
    const existing = driver.availableLoads.find(l => String(l.orderId) === String(order.id));
    if (existing) return existing;
    if (driver.assignedRoute && String(driver.assignedRoute.orderId) === String(order.id)) {
      return null;
    }

    const newLoad = {
      id: 'load-' + Date.now() + '-' + Math.floor(Math.random() * 100),
      orderId: order.id,
      cropName: order.cropName || 'Fresh Farm Produce',
      from: (order.farmerName || 'Farmer') + ' (Farm Gate)',
      to: order.deliveryAddress || 'Consumer Consignee Hub',
      weightTons: parseFloat((order.quantity * 0.1).toFixed(1)) || 1.5,
      distanceKm: order.distanceKm || 55,
      payout: Math.round((order.distanceKm || 55) * (driver.pricing?.basePerKm || 28) + 500),
      urgency: order.status === 'accepted' ? 'Immediate Transit Required' : 'Order Placed (Pending Pickup)'
    };
    driver.availableLoads.unshift(newLoad);
    localStorage.setItem(this.STORAGE_KEYS.DRIVER, JSON.stringify(driver));
    this.notify('driver_load_created', newLoad);
    this.notify('driver_updated', driver);
    return newLoad;
  }

  declineDriverLoadByOrderId(orderId) {
    const driver = this.getDriverData();
    if (driver && driver.availableLoads) {
      driver.availableLoads = driver.availableLoads.filter(l => String(l.orderId) !== String(orderId));
      localStorage.setItem(this.STORAGE_KEYS.DRIVER, JSON.stringify(driver));
      this.notify('driver_updated', driver);
    }
  }

  assignLoadToDriver(loadId) {
    const driver = this.getDriverData();
    const load = driver.availableLoads.find(l => l.id === loadId);
    if (load) {
      driver.availableLoads = driver.availableLoads.filter(l => l.id !== loadId);
      const weight = parseFloat(load.weightTons);
      driver.bookedCapacityTons = Math.min(driver.maxCapacityTons, driver.bookedCapacityTons + weight);
      driver.availableCapacityTons = Math.max(0, driver.maxCapacityTons - driver.bookedCapacityTons);

      driver.assignedRoute = {
        tripId: 'TRIP-' + Math.floor(1000 + Math.random() * 9000),
        orderId: load.orderId,
        status: 'assigned',
        statusLabel: 'Cargo Assigned - Awaiting Farm Pickup',
        origin: {
          name: load.from,
          address: 'Verified Farm Gate Pickup Point',
          contact: 'Farmer Dispatch Desk',
          departureTime: 'Ready for loading'
        },
        destination: {
          name: 'Consumer Consignee Warehouse',
          address: load.to,
          contact: 'Buyer Logistics Incharge',
          estimatedArrival: 'Scheduled today'
        },
        cargo: {
          cropName: load.cropName,
          quantity: `${Math.round(load.weightTons * 10)} Quintals`,
          weightTons: weight,
          isOrganic: true,
          perishableRisk: 'Standard'
        },
        routeStats: {
          totalDistanceKm: load.distanceKm,
          coveredDistanceKm: 0,
          remainingDistanceKm: load.distanceKm,
          estimatedHours: `${Math.ceil(load.distanceKm / 45)}h 15m`,
          tollBooths: 1,
          tripFee: load.payout,
          fuelUsedLiters: Math.round(load.distanceKm / 4)
        },
        waypoints: [
          { name: 'Farm Gate Loading Point A', time: 'Pickup Now', completed: false, isCurrent: true },
          { name: 'Highway Transit Corridor', time: 'En Route', completed: false },
          { name: 'Destination Delivery Point B', time: 'Final Dropoff', completed: false }
        ]
      };

      localStorage.setItem(this.STORAGE_KEYS.DRIVER, JSON.stringify(driver));
      this.notify('route_updated', driver.assignedRoute);
      this.notify('driver_updated', driver);
      if (load.orderId) {
        this.updateOrderStatus(load.orderId, 'dispatched');
      }
    }
  }

  declineDriverLoad(loadId) {
    const driver = this.getDriverData();
    if (driver && driver.availableLoads) {
      driver.availableLoads = driver.availableLoads.filter(l => l.id !== loadId);
      localStorage.setItem(this.STORAGE_KEYS.DRIVER, JSON.stringify(driver));
      this.notify('driver_load_declined', loadId);
      this.notify('route_updated', driver);
      this.notify('driver_updated', driver);
      return true;
    }
    return false;
  }

  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CART)) || [];
    } catch (e) {
      return [];
    }
  }

  addToCart(crop, quantity = 1) {
    const cart = this.getCart();
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const existing = cart.find(item => String(item.cropId) === String(crop.id));
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        cropId: String(crop.id),
        name: crop.name,
        category: crop.category,
        unit: crop.unit,
        pricePerUnit: Number(crop.pricePerUnit) || 0,
        quantity: qty,
        imageUrl: crop.imageUrl,
        farmerId: String(crop.farmerId || 'farmer-1'),
        farmerName: crop.farmerName || 'Ramesh Patel',
        farmLocation: crop.farmLocation || 'Regional Agro Cluster',
        isOrganic: Boolean(crop.isOrganic),
        grade: crop.grade || 'A'
      });
    }
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify('cart_updated', cart);
  }

  updateCartQty(cropId, quantity) {
    let cart = this.getCart();
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      cart = cart.filter(item => String(item.cropId) !== String(cropId));
    } else {
      const item = cart.find(i => String(i.cropId) === String(cropId));
      if (item) {
        item.quantity = qty;
      }
    }
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify('cart_updated', cart);
  }

  clearCart() {
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
    this.notify('cart_updated', []);
  }

  // ================= NOTIFICATIONS ENGINE =================
  getNotifications(role = null) {
    try {
      const list = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS)) || [];
      if (!role || role === 'all') return list;
      return list.filter(n => !n.role || n.role === 'all' || n.role === role);
    } catch (e) {
      return [];
    }
  }

  addNotification(type, title, message, meta = {}) {
    const list = this.getNotifications();
    const notif = {
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: type || 'info', // 'accepted' | 'declined' | 'negotiated' | 'order' | 'transit' | 'info' | 'price_alert' | 'escrow' | 'harvest' | 'load' | 'pickup' | 'payment'
      title: title || 'Status Update',
      message: message || '',
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      read: false,
      role: meta.role || 'all',
      ...meta
    };
    list.unshift(notif);
    if (list.length > 50) list.pop();
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.notify('notification_added', notif);
    this.notify('notifications_updated', list);
    return notif;
  }

  markAllNotificationsRead(role = null) {
    const list = this.getNotifications();
    list.forEach(n => {
      if (!role || role === 'all' || n.role === role) {
        n.read = true;
      }
    });
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.notify('notifications_updated', list);
  }

  clearNotifications(role = null) {
    if (!role || role === 'all') {
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
      this.notify('notifications_updated', []);
    } else {
      const all = this.getNotifications();
      const remaining = all.filter(n => n.role && n.role !== role && n.role !== 'all');
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(remaining));
      this.notify('notifications_updated', remaining);
    }
  }

  // ================= REAL-TIME GPS TELEMETRY ENGINE =================
  initGpsTelemetry() {
    this.telemetryState = {
      progress: 0.724,
      speedMs: 15.2,
      speedKmh: 55,
      totalDistanceMeters: 164000,
      totalDistanceKm: 164,
      coveredMeters: 118740,
      remainingMeters: 45260,
      remainingMetersFormatted: '45,260 m',
      coveredKm: 118.7,
      remainingKm: 45.3,
      etaHours: '50 mins',
      corridorLocation: 'Chakan APMC Delivery Hub Approach',
      lat: 19.6640,
      lng: 74.2750,
      lastUpdated: 'Just now'
    };

    if (this._gpsTimer) clearInterval(this._gpsTimer);
    this._gpsTimer = setInterval(() => {
      this.stepGpsTelemetry();
    }, 1000); // 1-second cadence for realistic slow meters/second vehicle tracking
  }

  stepGpsTelemetry() {
    if (!this.telemetryState) return;

    // Slower vehicle velocity in meters per second (realistic 14.8 to 15.6 m/s, ~54 km/h)
    const speedMs = +(14.8 + Math.random() * 0.8).toFixed(1);
    const speedKmh = Math.round(speedMs * 3.6);

    // Moves forward by speedMs meters every 1 second
    let remainingMeters = this.telemetryState.remainingMeters - Math.round(speedMs);

    // Keep smoothly in the ~45k meters region (looping between 46,200m and 43,500m)
    if (remainingMeters < 43500) {
      remainingMeters = 46200;
    }

    const totalDistanceMeters = 164000;
    const coveredMeters = totalDistanceMeters - remainingMeters;
    const p = coveredMeters / totalDistanceMeters;

    const minsLeft = Math.round(remainingMeters / (speedMs * 60));
    const etaText = minsLeft > 60 ? `${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m` : `${minsLeft} mins`;

    const corridor = p > 0.73 ? 'Chakan APMC Delivery Hub Approach' : 'Alephata Commercial Junction';

    this.telemetryState = {
      progress: p,
      speedMs: speedMs,
      speedKmh: speedKmh,
      totalDistanceMeters: totalDistanceMeters,
      totalDistanceKm: Math.round(totalDistanceMeters / 1000),
      coveredMeters: coveredMeters,
      remainingMeters: remainingMeters,
      remainingMetersFormatted: remainingMeters.toLocaleString('en-IN') + ' m',
      coveredKm: +(coveredMeters / 1000).toFixed(1),
      remainingKm: +(remainingMeters / 1000).toFixed(1),
      etaHours: etaText,
      corridorLocation: corridor,
      lat: +(19.6640 + (p - 0.72) * 0.1).toFixed(4),
      lng: +(74.2750 + (p - 0.72) * 0.1).toFixed(4),
      lastUpdated: 'Just now'
    };

    // Update driver assignedRoute stats in memory
    const driver = this.getDriverData();
    if (driver && driver.assignedRoute && driver.assignedRoute.routeStats) {
      driver.assignedRoute.routeStats.coveredDistanceKm = Math.round(coveredMeters / 1000);
      driver.assignedRoute.routeStats.remainingDistanceKm = +(remainingMeters / 1000).toFixed(1);
      driver.assignedRoute.routeStats.remainingMeters = remainingMeters;
      driver.assignedRoute.routeStats.remainingMetersFormatted = this.telemetryState.remainingMetersFormatted;
      driver.assignedRoute.routeStats.speedMs = speedMs;
      driver.assignedRoute.routeStats.estimatedHours = etaText;
    }

    this.notify('gps_telemetry_updated', this.telemetryState);
  }

  getLiveGpsTelemetry() {
    return this.telemetryState || {
      progress: 0.724,
      speedMs: 15.2,
      speedKmh: 55,
      totalDistanceMeters: 164000,
      totalDistanceKm: 164,
      coveredMeters: 118740,
      remainingMeters: 45260,
      remainingMetersFormatted: '45,260 m',
      coveredKm: 118.7,
      remainingKm: 45.3,
      etaHours: '50 mins',
      corridorLocation: 'Chakan APMC Delivery Hub Approach',
      lat: 19.6640,
      lng: 74.2750,
      lastUpdated: 'Just now'
    };
  }

  async resetDemoData() {
    localStorage.setItem(this.STORAGE_KEYS.CROPS, JSON.stringify(INITIAL_CROPS));
    localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(this.STORAGE_KEYS.DRIVER, JSON.stringify(INITIAL_DRIVER_DATA));
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
    localStorage.setItem(this.STORAGE_KEYS.PROFILES, JSON.stringify(OPERATIONAL_PROFILES));
    const seedNotifications = [
      // Farmer Notifications
      {
        id: 'notif-farmer-1',
        role: 'farmer',
        type: 'order',
        title: 'New Wholesale Order Received',
        message: 'Buyer Priya Sharma (GreenBites Collective) placed an order for 20 Quintals of Sharbati Golden Wheat at ₹2,650/Qtl (Total: ₹53,000).',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        timeAgo: '8m ago',
        read: false,
        cropName: 'Sharbati Golden Wheat',
        amount: '₹53,000'
      },
      {
        id: 'notif-farmer-2',
        role: 'farmer',
        type: 'price_alert',
        title: 'Mandi Wholesale Price Rise Alert',
        message: 'Nashik APMC Mandi rate for Wheat moved up to ₹2,420/Qtl. Your direct KisanSetu price (₹2,650) yields +₹230/Qtl higher profit.',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        timeAgo: '25m ago',
        read: false,
        cropName: 'Sharbati Golden Wheat'
      },
      {
        id: 'notif-farmer-3',
        role: 'farmer',
        type: 'transit',
        title: 'Truck Freight Pickup Scheduled',
        message: 'Driver Gurpreet Singh (Vehicle MH-15-EG-4482) accepted pickup for Order #ORD-101. Arriving at your farm gate in ~45 mins.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        timeAgo: '45m ago',
        read: true,
        driverName: 'Gurpreet Singh'
      },
      {
        id: 'notif-farmer-4',
        role: 'farmer',
        type: 'escrow',
        title: 'Buyer Payment Deposited in Escrow',
        message: '₹53,000 advance escrow confirmed for Order #ORD-101. Funds will be released to your UPI upon delivery verification.',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        timeAgo: '1.5h ago',
        read: true,
        amount: '₹53,000'
      },

      // Consumer (Buyer) Notifications
      {
        id: 'notif-consumer-1',
        role: 'consumer',
        type: 'accepted',
        title: 'Order Accepted by Farmer',
        message: 'Farmer Ramesh Patel ACCEPTED your purchase order for 20 Quintals Sharbati Golden Wheat at ₹2,650/Qtl. Produce being bagged.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        timeAgo: '15m ago',
        read: false,
        cropName: 'Sharbati Golden Wheat'
      },
      {
        id: 'notif-consumer-2',
        role: 'consumer',
        type: 'transit',
        title: 'Truck Dispatched • Live GPS Tracking Active',
        message: 'Carrier Gurpreet Singh has loaded your shipment and departed Nashik farm cluster. Current speed: 56 km/h. ETA: 2h 15m.',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        timeAgo: '35m ago',
        read: false,
        truckNumber: 'MH-15-EG-4482'
      },
      {
        id: 'notif-consumer-3',
        role: 'consumer',
        type: 'harvest',
        title: 'Fresh GI Harvest Listed Near You',
        message: 'Tree-ripened Alphonso Ratnagiri Mangoes (Export Grade A+) just listed by Ramesh Patel at ₹1,850/Crate (within 150 km).',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        timeAgo: '1h ago',
        read: true,
        cropName: 'Alphonso Mangoes'
      },
      {
        id: 'notif-consumer-4',
        role: 'consumer',
        type: 'quality',
        title: 'Agmarknet Lab Quality Verified',
        message: 'Quality test passed: 10.2% moisture, 98% grain uniformity, zero pesticide residue for Order #ORD-101.',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        timeAgo: '2h ago',
        read: true
      },

      // Truck Driver Notifications
      {
        id: 'notif-driver-1',
        role: 'driver',
        type: 'load',
        title: 'New Freight Load Opportunity',
        message: 'New load available: 20 Quintals Wheat from Nashik Agro-Cluster to Pune Central Market. Guaranteed Freight: ₹4,800.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        timeAgo: '10m ago',
        read: false,
        fare: '₹4,800'
      },
      {
        id: 'notif-driver-2',
        role: 'driver',
        type: 'pickup',
        title: 'Farmer Marked Load Ready for Pickup',
        message: 'Farmer Ramesh Patel confirmed that 50 gunny bags of Grade A+ Wheat are weighed and ready at Gate 2, Nashik Agro-Cluster.',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        timeAgo: '20m ago',
        read: false
      },
      {
        id: 'notif-driver-3',
        role: 'driver',
        type: 'route',
        title: 'Corridor Traffic & Toll Clearance',
        message: 'Fastag cleared at Ghoti Toll Plaza. NH-60 Bota Ghat bypass clear, average vehicle corridor speed is 55 km/h.',
        timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
        timeAgo: '50m ago',
        read: true
      },
      {
        id: 'notif-driver-4',
        role: 'driver',
        type: 'payment',
        title: 'Freight Payment Credited to UPI',
        message: '₹8,250 freight fare for completed Trip #TRIP-8840 has been transferred directly to your bank account (UPI: driver@okhdfcbank).',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        timeAgo: '3h ago',
        read: true,
        fare: '₹8,250'
      }
    ];
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(seedNotifications));

    try {
      await fetch('/api/demo/seed', { method: 'POST' });
    } catch (err) {}

    this.notify('data_reset', null);
    this.notify('crops_updated', INITIAL_CROPS);
    this.notify('orders_updated', INITIAL_ORDERS);
    this.notify('notifications_updated', seedNotifications);
    return { success: true, count: INITIAL_CROPS.length };
  }
}

window.appStore = new AppStore();
window.SMS_BULLETINS = SMS_BULLETINS;
window.OPERATIONAL_PROFILES = OPERATIONAL_PROFILES;

