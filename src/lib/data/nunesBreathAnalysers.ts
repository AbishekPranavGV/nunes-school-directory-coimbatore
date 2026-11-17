export interface BreathAnalyserProduct {
  id: number;
  title: string;
  category: string;
  group: string;
  description: string;
  features: [string, string][];
  specs: [string, string][];
  sourceKey: string;
  sourceUrl?: string;
  sourceNote?: string;
  matched?: boolean;
  image?: string;
  badge?: string;
  idealFor?: string;
  recommendedRole?: string;
  cataloguePage?: number | string;
  [key: string]: any;
}

export interface CoimbatoreBranchLocation {
  id: string;
  branchName: string;
  addressLines: string[];
  fullAddress: string;
  pincode: string;
  landmark: string;
  phone: string;
  mobile: string;
  email: string;
  googleMapsUrl: string;
  operatingHours: string;
  servicesAvailable: string[];
}

export const NUNES_COIMBATORE_LOCATIONS: CoimbatoreBranchLocation[] = [
  {
    id: 'rathinapuri',
    branchName: 'RATHINAPURI',
    addressLines: [
      '11-A, 2nd Cross, Sundarar St,',
      'Opp. to LaLa Mahall,',
      'Nalvar Layout, Rathinapuri,',
      'Coimbatore, Tamil Nadu 641027'
    ],
    fullAddress: '11-A, 2nd Cross, Sundarar St, Opp. to LaLa Mahall, Nalvar Layout, Rathinapuri, Coimbatore, Tamil Nadu 641027',
    pincode: '641027',
    landmark: 'Opp. to LaLa Mahall, Nalvar Layout',
    phone: '+91 89409 44000',
    mobile: '+91 89409 44000',
    email: 'info@nunesinstruments.com',
    googleMapsUrl: 'https://maps.google.com/?q=11-A,+2nd+Cross,+Sundarar+St,+Rathinapuri,+Coimbatore,+Tamil+Nadu+641027',
    operatingHours: 'Mon - Sat: 9:00 AM - 7:30 PM',
    servicesAvailable: ['Device Calibration Lab', 'Institutional Sales Demo Desk', 'On-Site Service & Spares', 'School Fleet Safety Audits']
  },
  {
    id: 'gopalapuram',
    branchName: 'GOPALAPURAM',
    addressLines: [
      '6, GJ Chandran Complex,',
      'Head Quarters Rd,',
      'Opp. to CSI Church,',
      'Gopalapuram,',
      'Coimbatore, Tamil Nadu 641018'
    ],
    fullAddress: '6, GJ Chandran Complex, Head Quarters Rd, Opp. to CSI Church, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    pincode: '641018',
    landmark: 'Opp. to CSI Church, Head Quarters Rd',
    phone: '+91 89409 33000',
    mobile: '+91 89409 33000',
    email: 'sales@nunesinstruments.com',
    googleMapsUrl: 'https://maps.google.com/?q=6,+GJ+Chandran+Complex,+Head+Quarters+Rd,+Gopalapuram,+Coimbatore,+Tamil+Nadu+641018',
    operatingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    servicesAvailable: ['Customer Experience Lounge', 'Corporate & Institutional Contracts', 'Express Delivery & Dispatch', 'Direct Cash & Carry']
  },
  {
    id: 'gandhipuram',
    branchName: 'GANDHIPURAM',
    addressLines: [
      '218-628, 1st St,',
      'Cross Cut, Gandhipuram,',
      'Coimbatore,',
      'Tamil Nadu 641012'
    ],
    fullAddress: '218-628, 1st St, Cross Cut, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    pincode: '641012',
    landmark: '1st St, Cross Cut Road',
    phone: '+91 0422 2499444',
    mobile: '+91 89409 44000',
    email: 'support@nunesinstruments.com',
    googleMapsUrl: 'https://maps.google.com/?q=218-628,+1st+St,+Cross+Cut,+Gandhipuram,+Coimbatore,+Tamil+Nadu+641012',
    operatingHours: 'Mon - Sat: 9:30 AM - 8:00 PM',
    servicesAvailable: ['Central Showroom', 'Testing & Verification Bench', 'Mouthpiece & Thermal Roll Refills', 'Emergency Technician Support']
  }
];

export const NUNES_BREATH_ANALYSER_PRODUCTS: BreathAnalyserProduct[] = [
  {
    "title": "Rapid screening baton",
    "category": "FIELD SCREENING",
    "description": "An extended handheld breath analyzer intended for fast field screening. The published specification identifies an alcohol-specific electrochemical sensor and screening and evidential modes. Optional printer pairing supports portable reporting workflows.",
    "features": [
      [
        "Alcohol-specific sensor",
        "Electrochemical sensing principle listed for breath alcohol measurement."
      ],
      [
        "Two operating modes",
        "Screening and evidential modes are listed in the product record."
      ],
      [
        "Wireless workflow",
        "Bluetooth is built in; connection to a thermal printer is optional."
      ],
      [
        "Field visibility",
        "OLED result screen and two 3 W flashing lights."
      ]
    ],
    "specs": [
      [
        "Measurement range",
        "0.000 to 2.500 mg/L BrAC"
      ],
      [
        "Sensor",
        "Alcohol-specific electrochemical"
      ],
      [
        "Display and alerts",
        "OLED screen; two 3 W flashing lights"
      ],
      [
        "Modes and connectivity",
        "Screening and evidential modes; Bluetooth built in; printer optional"
      ],
      [
        "Continuous use",
        "Up to 8 hours"
      ],
      [
        "Calibration",
        "Every 6 months, as listed"
      ],
      [
        "Size and weight",
        "330 x 45 mm; about 270 g including battery"
      ],
      [
        "Operating temperature",
        "-5 to 45 C"
      ],
      [
        "Accuracy",
        "Not stated in the matched source"
      ]
    ],
    "id": 1,
    "image": "assets/product-01.webp",
    "group": "Roadside & enforcement",
    "matched": true,
    "sourceKey": "Catalogue p.2",
    "sourceUrl": "catalog.pdf#page=2",
    "sourceNote": "The matched source lists the measurement range, sensor, modes and operating details, but does not publish measurement accuracy.",
    "cataloguePage": 2,
    "partial": true
  },
  {
    "title": "Dual-color signal screening baton",
    "category": "NON-CONTACT SCREENING",
    "description": "A baton-format screening unit designed to collect a breath sample at short range without mouthpiece contact. The supplier lists a result in under five seconds, with light and sound alerts for quick on-scene feedback.",
    "features": [
      [
        "Short-range sampling",
        "Supplier lists a 3 to 5 cm sampling distance."
      ],
      [
        "Fast feedback",
        "Result indication is listed in under 5 seconds."
      ],
      [
        "Visible and audible alerts",
        "Flashing light and whistle alert; voice prompt is optional."
      ],
      [
        "Record storage",
        "Stores up to 3,000 test records, per listing."
      ]
    ],
    "specs": [
      [
        "Measurement range",
        "0 to 400 mg/100 mL"
      ],
      [
        "Sensor",
        "Semiconductor"
      ],
      [
        "Sampling distance",
        "3 to 5 cm"
      ],
      [
        "Result / zero return",
        "Under 5 seconds / under 10 seconds"
      ],
      [
        "Memory",
        "Up to 3,000 test records"
      ],
      [
        "Power",
        "3.7 V, 3,000 mAh rechargeable battery; over 10 hours"
      ],
      [
        "Size and weight",
        "377 x 46 mm; about 240 g including battery"
      ],
      [
        "Operating temperature",
        "-5 to 45 C"
      ],
      [
        "Accuracy",
        "Not stated in the matched source"
      ]
    ],
    "id": 2,
    "image": "assets/product-02.webp",
    "group": "Roadside & enforcement",
    "matched": true,
    "sourceKey": "Catalogue p.3",
    "sourceUrl": "catalog.pdf#page=3",
    "sourceNote": "The matched source lists the range, sensor, sampling distance and operating details, but does not publish measurement accuracy.",
    "cataloguePage": 3,
    "partial": true
  },
  {
    "title": "Handheld multi-unit LCD tester",
    "category": "PORTABLE LCD",
    "description": "A portable tester for personal or workplace spot checks. The backlit LCD guides the user through warm-up, blowing and result stages, while the manual lists several display units and replaceable AAA batteries.",
    "features": [
      [
        "Multi-unit display",
        "Results can be shown in mg/L, mg/100 mL and BAC units."
      ],
      [
        "Step-by-step screen",
        "Wait, blow, test and result prompts guide each test."
      ],
      [
        "Audible alert",
        "Sound and screen indications are listed at the preset alarm point."
      ],
      [
        "Battery powered",
        "Uses 3 AAA batteries; manual lists 200 or more tests."
      ]
    ],
    "specs": [
      [
        "Measurement range",
        "0 to 1.00 mg/L; 0 to 200 mg/100 mL; 0 to 0.20% BAC"
      ],
      [
        "Sensor",
        "Flat-surface alcohol sensor"
      ],
      [
        "Alert point",
        "0.25 mg/L / 50 mg/100 mL / 0.05% BAC"
      ],
      [
        "Accuracy",
        "Plus/minus 10% full scale, per manual"
      ],
      [
        "Display and power",
        "3-digit backlit LCD; 3 x AAA batteries"
      ],
      [
        "Battery life",
        "At least 200 tests"
      ],
      [
        "Size and weight",
        "103 x 65 x 27 mm; up to 64 g without batteries"
      ],
      [
        "Operating range",
        "-10 to 50 C; manual advises a 15-minute wait after drinking"
      ]
    ],
    "id": 3,
    "image": "assets/product-03.webp",
    "group": "Personal & workplace",
    "matched": true,
    "sourceKey": "Catalogue p.4",
    "sourceUrl": "catalog.pdf#page=4",
    "sourceNote": "Manual describes the unit as an indicative screening aid, not a sole basis for deciding whether it is safe to drive.",
    "cataloguePage": 4,
    "partial": false
  },
  {
    "title": "Keyring LCD breath tester",
    "category": "PERSONAL CARRY",
    "description": "An ultra-portable keyring-style breath tester with an integrated LCD and side sampling tube. Its compact handheld form includes a metal ring and chain for convenient personal carry. The supplied catalogue does not identify an exact model or publish numeric measurement performance.",
    "features": [
      [
        "Keyring carry",
        "Metal ring and chain support convenient personal carry."
      ],
      [
        "Integrated LCD",
        "Front display presents a test result."
      ],
      [
        "Side sample port",
        "A detachable side sampling tube is shown."
      ],
      [
        "Compact personal format",
        "Rounded handheld body with an integrated front display and side control."
      ]
    ],
    "specs": [
      [
        "Product format",
        "Compact keyring breath tester"
      ],
      [
        "Display",
        "Integrated LCD screen"
      ],
      [
        "Sampling interface",
        "Side sampling tube"
      ],
      [
        "Carry accessory",
        "Metal ring and chain attachment"
      ],
      [
        "Housing",
        "Rounded handheld body; appearance-based description"
      ],
      [
        "Control layout",
        "Integrated front display and side control"
      ],
      [
        "Exact model",
        "Not identified in the supplied catalogue"
      ],
      [
        "Measurement range and accuracy",
        "Not published in the supplied catalogue"
      ],
      [
        "Sensor, power and calibration",
        "Not published in the supplied catalogue"
      ]
    ],
    "id": 4,
    "image": "assets/product-04.webp",
    "group": "Personal & workplace",
    "matched": true,
    "sourceKey": "Catalogue p.5",
    "sourceUrl": "catalog.pdf#page=5",
    "sourceNote": "The supplied catalogue describes visible product details, but does not identify the exact model or publish numeric performance data.",
    "cataloguePage": 5,
    "partial": true
  },
  {
    "title": "Pocket mg/L display tester",
    "category": "POCKET TESTER",
    "description": "A compact single-button handheld breath tester with a backlit numeric LCD, mg/L readout, on-screen warning icon and side-mounted mouthpiece. The 0.250 mg/L shown in the product image is an example display value; it is not a published measurement range or performance claim.",
    "features": [
      [
        "Clear numeric screen",
        "Backlit LCD presents an mg/L result."
      ],
      [
        "Status icon",
        "Warning symbol is shown beside the reading."
      ],
      [
        "One-button control",
        "A single front control is visible."
      ],
      [
        "Mouthpiece sampling",
        "Side-mounted sample port is shown."
      ]
    ],
    "specs": [
      [
        "Product format",
        "Compact handheld breath tester"
      ],
      [
        "Display",
        "Backlit numeric LCD with mg/L readout"
      ],
      [
        "Sampling interface",
        "Side-mounted mouthpiece"
      ],
      [
        "User controls",
        "One visible front button"
      ],
      [
        "On-screen alert",
        "Warning icon beside the reading"
      ],
      [
        "Illustrated reading",
        "0.250 mg/L is an example shown in the product image"
      ],
      [
        "Exact model",
        "Not identified in the supplied catalogue"
      ],
      [
        "Measurement range and accuracy",
        "Not published in the supplied catalogue"
      ],
      [
        "Sensor type, power and calibration",
        "Not published in the supplied catalogue"
      ]
    ],
    "id": 5,
    "image": "assets/product-05.webp",
    "group": "Personal & workplace",
    "matched": true,
    "sourceKey": "Catalogue p.6",
    "sourceUrl": "catalog.pdf#page=6",
    "sourceNote": "The 0.250 mg/L value shown in the image is illustrative. The supplied catalogue does not publish a numeric measurement range, accuracy, sensor principle, power specification or calibration interval.",
    "cataloguePage": 6,
    "partial": true
  },
  {
    "title": "Three-digit handheld LED detector",
    "category": "HANDHELD DETECTOR",
    "description": "A compact handheld detector with a three-digit LED and ready, battery and warning indicators. The published record lists a semiconductor-oxide sensor, replaceable mouthpiece and a short warm-up and sample routine.",
    "features": [
      [
        "Simple status panel",
        "Three-digit LED with ready, warning and battery indicators."
      ],
      [
        "Replaceable mouthpiece",
        "Supports replacement between users."
      ],
      [
        "Quick start",
        "Published warm-up is 20 seconds; sample is at least 5 seconds."
      ],
      [
        "Portable power",
        "9 V battery with optional vehicle adapter; about 300 tests listed."
      ]
    ],
    "specs": [
      [
        "Measurement range",
        "0.00 to 0.40% BAC"
      ],
      [
        "Sensor",
        "Semiconductor oxide"
      ],
      [
        "Display",
        "3-digit LED"
      ],
      [
        "Accuracy record",
        "Accuracy established at 0.008 and 0.032% BAC; above 0.032% was not evaluated"
      ],
      [
        "Warm-up and sample",
        "20 seconds; steady blow for at least 5 seconds"
      ],
      [
        "Power and battery life",
        "9 V alkaline; optional vehicle adapter; about 300 tests"
      ],
      [
        "Size and weight",
        "About 127 x 83 mm; 200 g"
      ],
      [
        "Mouthpiece",
        "Replaceable"
      ]
    ],
    "id": 6,
    "image": "assets/product-06.webp",
    "group": "Roadside & enforcement",
    "matched": true,
    "sourceKey": "Catalogue p.7",
    "sourceUrl": "catalog.pdf#page=7",
    "sourceNote": "The source record does not evaluate accuracy above 0.032% BAC.",
    "cataloguePage": 7,
    "partial": false
  },
  {
    "title": "Dual-unit LCD pocket tester",
    "category": "COMPACT DISPLAY",
    "description": "A slim handheld breath tester with a red-backlit screen showing g/L and %BAC alongside a battery indicator. The supplied catalogue describes a long, narrow housing and a numeric result with warning symbols. It does not identify an exact model or publish numeric performance figures.",
    "features": [
      [
        "Dual-unit screen",
        "The display shows g/L and %BAC."
      ],
      [
        "Battery indicator",
        "A battery icon is visible on the screen."
      ],
      [
        "Red backlight",
        "The high-contrast result screen is shown in red."
      ],
      [
        "Slim handheld form",
        "Long, narrow body fits a compact pocket-style format."
      ]
    ],
    "specs": [
      [
        "Product format",
        "Slim pocket-style handheld tester"
      ],
      [
        "Display",
        "Red-backlit digital LCD"
      ],
      [
        "Displayed units",
        "g/L and %BAC"
      ],
      [
        "Battery indication",
        "Battery icon visible on screen"
      ],
      [
        "Housing",
        "Long, narrow handheld body"
      ],
      [
        "Screen information",
        "Numeric result and warning symbols"
      ],
      [
        "Exact model",
        "Not identified in the supplied catalogue"
      ],
      [
        "Measurement range and accuracy",
        "Not published in the supplied catalogue"
      ],
      [
        "Sensor, battery capacity and calibration",
        "Not published in the supplied catalogue"
      ]
    ],
    "id": 7,
    "image": "assets/product-07.webp",
    "group": "Personal & workplace",
    "matched": true,
    "sourceKey": "Catalogue p.8",
    "sourceUrl": "catalog.pdf#page=8",
    "sourceNote": "The supplied catalogue lists display and visible product details only; it does not identify a model code or publish range, accuracy, sensor, battery capacity or calibration data.",
    "cataloguePage": 8,
    "partial": true
  },
  {
    "title": "Compact green-screen breath tester",
    "category": "PERSONAL / WORKPLACE",
    "description": "A compact one-button tester with a green backlit warning display and integrated mouthpiece. The matching supplier listing gives a 3 to 5 second blow and a result about 10 seconds later, but does not state range or accuracy.",
    "features": [
      [
        "Green warning display",
        "Backlit screen with warning state."
      ],
      [
        "One-button operation",
        "Single front control shown."
      ],
      [
        "Reusable tips",
        "Five reusable mouthpieces are listed."
      ],
      [
        "Quick test routine",
        "3 to 5 second blow; result about 10 seconds later, per listing."
      ]
    ],
    "specs": [
      [
        "Sample time",
        "3 to 5 seconds"
      ],
      [
        "Result timing",
        "About 10 seconds after sample, per listing"
      ],
      [
        "Mouthpieces",
        "Five reusable mouthpieces listed"
      ],
      [
        "Size",
        "About 135 x 48 x 16 mm"
      ],
      [
        "Measurement range",
        "Not specified in the matched listing"
      ],
      [
        "Sensor and accuracy",
        "Not specified in the matched listing"
      ],
      [
        "Power and calibration",
        "Not specified; confirm before quoting"
      ]
    ],
    "id": 8,
    "image": "assets/product-08.webp",
    "group": "Personal & workplace",
    "matched": true,
    "sourceKey": "Catalogue p.9",
    "sourceUrl": "catalog.pdf#page=9",
    "sourceNote": "The matched listing gives sampling time, result timing, mouthpieces and size, but does not publish measurement range, sensor principle, accuracy or calibration interval.",
    "cataloguePage": 9,
    "partial": true
  },
  {
    "title": "A50 rugged handheld tester",
    "category": "RUGGED HANDHELD",
    "description": "A rugged handheld breath analyser with a large color display, three-button controls, textured housing and a bottom carry attachment. This configuration includes a built-in thermal printer, active and passive measurement modes, onboard memory and USB data transfer.",
    "features": [
      [
        "Large color TFT display",
        "A full-color front screen provides a clear view of test results in field use."
      ],
      [
        "Three-button operation",
        "Two selection buttons and a central power button support straightforward operation."
      ],
      [
        "Built-in thermal printer",
        "Integrated printing supports quick documentation of test results."
      ],
      [
        "Memory and USB connectivity",
        "Stores up to 20,000 records and supports data transfer to a PC."
      ]
    ],
    "specs": [
      [
        "Model",
        "A50"
      ],
      [
        "Product type",
        "Portable breath alcohol analyser with in-built printer"
      ],
      [
        "Sensor type",
        "High-precision electrochemical fuel cell"
      ],
      [
        "Measurement modes",
        "Active mode and passive mode"
      ],
      [
        "Detection range",
        "0.00\u20130.40% BAC / 0.00\u20134.00\u2030 BAC / 0.00\u20132.00 mg/L"
      ],
      [
        "Display",
        "Color TFT display"
      ],
      [
        "Memory",
        "Up to 20,000 records"
      ],
      [
        "Warm-up / zeroing",
        "Less than 5 seconds"
      ],
      [
        "Measurement time",
        "Less than 10 seconds"
      ],
      [
        "Power",
        "Rechargeable Li-ion battery"
      ],
      [
        "Interface",
        "USB data transfer to PC"
      ],
      [
        "Operating temperature",
        "-5\u00b0C to +50\u00b0C"
      ],
      [
        "Dimensions",
        "180 \u00d7 70 \u00d7 30 mm"
      ],
      [
        "Weight",
        "Approx. 250 g"
      ],
      [
        "Accuracy",
        "Not stated in the matched source"
      ]
    ],
    "id": 9,
    "image": "assets/product-09.webp",
    "group": "Rugged handheld",
    "matched": true,
    "sourceKey": "Catalogue p.10",
    "sourceUrl": "catalog.pdf#page=10",
    "sourceNote": "The catalogue reference identifies the model and published configuration; measurement accuracy is not listed. Verify the final supplier datasheet.",
    "cataloguePage": 10,
    "partial": true
  },
  {
    "title": "AT-9000 alcohol tester",
    "category": "CAMERA + PRINTER",
    "description": "A professional handheld alcohol tester with an electrochemical fuel-cell sensor, a large colour touchscreen, and integrated camera and printing functions. The supplied reference describes quick start-up, rechargeable power, and photo and video recording.",
    "features": [
      [
        "Fuel-cell sensing",
        "Electrochemical sensor specified for alcohol measurement."
      ],
      [
        "Camera and reports",
        "Photo and video recording with a printer-equipped configuration."
      ],
      [
        "Touchscreen and keypad",
        "4-inch capacitive colour touchscreen with compact keys."
      ],
      [
        "Extended operation",
        "Rechargeable battery with at least 10 hours of continuous use listed."
      ]
    ],
    "specs": [
      [
        "Model",
        "AT-9000"
      ],
      [
        "Product format",
        "Alcohol tester with printer and camera"
      ],
      [
        "Sensor",
        "Electrochemical fuel cell"
      ],
      [
        "Measurement range",
        "0\u2013440 mg/100 mL; 0\u20132.000 mg/L"
      ],
      [
        "Warm-up",
        "Less than 20 seconds"
      ],
      [
        "Threshold settings",
        "0.090 mg/L (20 mg/100 mL); 0.363 mg/L (80 mg/100 mL), as supplied"
      ],
      [
        "Battery",
        "7.4 V lithium, 2,500 mAh"
      ],
      [
        "Charging time",
        "Approx. 6 hours"
      ],
      [
        "Continuous operation",
        "At least 10 hours under normal conditions"
      ],
      [
        "Dimensions and weight",
        "206 \u00d7 78 \u00d7 36 mm; about 380 g"
      ]
    ],
    "sourceNote": "Values are reproduced from the supplied catalogue reference. Verify model options and measurement units against the supplier datasheet before quotation.",
    "id": 10,
    "image": "assets/product-10.webp",
    "group": "Evidential & reporting",
    "matched": true,
    "sourceKey": "Catalogue p.11",
    "sourceUrl": "catalog.pdf#page=11",
    "cataloguePage": 11,
    "partial": false
  },
  {
    "title": "333-T touchscreen tester with built-in printer",
    "category": "BUILT-IN PRINTER",
    "description": "A portable alcohol tester with colour touchscreen operation, side-mounted mouthpiece, and an integrated thermal printer. The supplied reference describes an electrochemical fuel-cell sensing principle and an all-in-one format for field reporting.",
    "features": [
      [
        "Fuel-cell principle",
        "Alcohol oxidation produces electrons in proportion to alcohol content."
      ],
      [
        "Touchscreen interface",
        "Colour icon-based display supports field operation."
      ],
      [
        "Built-in printer",
        "Integrated thermal printer supports on-the-spot print records."
      ],
      [
        "Compact handheld body",
        "Slim housing with side mouthpiece and front control keys."
      ]
    ],
    "specs": [
      [
        "Model",
        "333-T"
      ],
      [
        "Product format",
        "Alcohol tester with built-in printer"
      ],
      [
        "Sensor principle",
        "Electrochemical fuel cell"
      ],
      [
        "Display",
        "Colour touchscreen interface"
      ],
      [
        "Mouthpiece",
        "Side-mounted sampling mouthpiece"
      ],
      [
        "Printer",
        "Integrated thermal printer"
      ],
      [
        "Working principle",
        "Fuel-cell oxidation generates electrons in proportion to alcohol amount"
      ],
      [
        "Operation style",
        "Portable handheld tester"
      ],
      [
        "Measurement range",
        "Not stated in the supplied reference"
      ],
      [
        "Accuracy",
        "Not stated in the supplied reference"
      ],
      [
        "Battery and charging",
        "Not stated in the supplied reference"
      ],
      [
        "Calibration interval",
        "Not stated in the supplied reference"
      ],
      [
        "Dimensions and weight",
        "Not stated in the supplied reference"
      ]
    ],
    "sourceNote": "The supplied catalogue does not provide numeric performance or battery data for this model. Confirm range, battery and calibration details with the supplier.",
    "id": 11,
    "image": "assets/product-11.webp",
    "group": "Evidential & reporting",
    "matched": true,
    "sourceKey": "Catalogue p.12",
    "sourceUrl": "catalog.pdf#page=12",
    "cataloguePage": 12,
    "partial": true
  },
  {
    "title": "AT-8900 modular printer and GPS tester",
    "category": "DETACHABLE PRINTER + GPS",
    "description": "An advanced alcohol tester with electrochemical fuel-cell sensing, colour display, and built-in or detachable printer options. The supplied reference highlights GPS and USB support, detailed memory records, password management, and optional multi-unit display.",
    "features": [
      [
        "Modular sensor design",
        "Changeable fuel-cell sensor module supports recalibration and replacement."
      ],
      [
        "Printer flexibility",
        "Built-in or detachable printer options; stand-alone printer availability is noted."
      ],
      [
        "Data and GPS",
        "Stores detailed test records and supports GPS plus PC upload by USB."
      ],
      [
        "Multi-unit display",
        "Optional units include mg/L, mg/100 mL, g/L and %BAC formats."
      ]
    ],
    "specs": [
      [
        "Model",
        "AT-8900"
      ],
      [
        "Sensor",
        "Electrochemical fuel cell; changeable module design"
      ],
      [
        "Input",
        "Simplified keyboard with touch panel"
      ],
      [
        "Display",
        "2.83-inch OLED screen"
      ],
      [
        "Memory",
        "Up to 20,000 records with detailed record information"
      ],
      [
        "Printer",
        "Built-in or detachable printer; stand-alone thermal and dot-matrix options noted"
      ],
      [
        "GPS",
        "Geographic information provided by GPS"
      ],
      [
        "Data upload",
        "PC upload by USB"
      ],
      [
        "Password management",
        "User-changeable password"
      ],
      [
        "Units",
        "mg/L, mg/100 mL, g/L, %BAC and related unit options"
      ],
      [
        "Mouthpiece",
        "Disposable anti-return mouthpiece"
      ],
      [
        "Power supply",
        "Rechargeable Li battery, 7.4 V / 2,500 mAh"
      ],
      [
        "Measurement range",
        "Not stated in the supplied reference"
      ],
      [
        "Accuracy",
        "Not stated in the supplied reference"
      ],
      [
        "Warm-up and response time",
        "Not stated in the supplied reference"
      ],
      [
        "Dimensions and weight",
        "Not stated in the supplied reference"
      ],
      [
        "Calibration interval",
        "Not stated in the supplied reference"
      ]
    ],
    "sourceNote": "The supplied reference lists configuration and workflow details but omits measurement range, accuracy, response time, dimensions and calibration interval. Confirm the exact variant with the supplier.",
    "id": 12,
    "image": "assets/product-12.webp",
    "group": "Evidential & reporting",
    "matched": true,
    "sourceKey": "Catalogue p.13",
    "sourceUrl": "catalog.pdf#page=13",
    "cataloguePage": 13,
    "partial": true
  },
  {
    "title": "AA2010P breath analyser",
    "category": "QUICK SCREENING + PRINTER",
    "description": "A compact quick-screening breathalyser with an LED digital display, breath-sampling mouthpiece, and optional wired or Bluetooth printer. The supplied reference lists automatic timing, unit-conversion factors, and continuous breath-flow monitoring.",
    "features": [
      [
        "LED digital display",
        "Direct result display with real-time clock and memory-record support."
      ],
      [
        "Printer options",
        "Supports wired or Bluetooth printer configurations."
      ],
      [
        "Fast breath sampling",
        "About 6 seconds of continuous sampling with automatic flow monitoring."
      ],
      [
        "Multi-range reading",
        "Supports BAC, mg/L and mg/100 mL display ranges as supplied."
      ]
    ],
    "specs": [
      [
        "Model",
        "AA2010P"
      ],
      [
        "Display",
        "LED digital display"
      ],
      [
        "RTC and memory",
        "12/24-hour real-time clock; 100 memory records"
      ],
      [
        "Printer",
        "Wired or Bluetooth (optional)"
      ],
      [
        "Flow monitoring",
        "Pressure-sensor active detection at 100 ms intervals"
      ],
      [
        "Auto shutoff",
        "About 2 minutes"
      ],
      [
        "Breath sampling",
        "About 6 seconds of continuous sampling"
      ],
      [
        "Display range",
        "0.00 to 5.50% BAC; 0.00 to 0.55% BAC; 0.000 to 0.275 mg/L; or 550 mg/100 mL, as printed"
      ],
      [
        "Accuracy",
        "\u00b10.008% BAC at alert point"
      ],
      [
        "Unit conversion",
        "2.0, 2.1, 2.2 or 2.3 for different countries"
      ],
      [
        "Reference note",
        "Breath-alcohol-to-BAC ratio reference supplied as 2300:1"
      ],
      [
        "Battery and charging",
        "Not stated in the supplied reference"
      ],
      [
        "Calibration interval",
        "Not stated in the supplied reference"
      ],
      [
        "Dimensions and weight",
        "Not stated in the supplied reference"
      ]
    ],
    "sourceNote": "Display-range values are transcribed as printed in the supplied reference, including values that may represent different configurations. Confirm exact unit presentation and printer options with the supplier.",
    "id": 13,
    "image": "assets/product-13.webp",
    "group": "Evidential & reporting",
    "matched": true,
    "sourceKey": "Catalogue p.14",
    "sourceUrl": "catalog.pdf#page=14",
    "cataloguePage": 14,
    "partial": true
  },
  {
    "title": "333 touchscreen tester with external printer",
    "category": "EXTERNAL PRINTER",
    "description": "A touchscreen alcohol tester with side-mounted mouthpiece and a separate compact external printer. The supplied reference describes the same fuel-cell sensing principle as the built-in-printer version, with portable printing through a separate unit.",
    "features": [
      [
        "Fuel-cell sensing",
        "Electrochemical fuel-cell principle described in the supplied reference."
      ],
      [
        "External printer",
        "Separate compact printer supports portable reporting."
      ],
      [
        "Touchscreen interface",
        "Colour icon-based display with front control keys."
      ],
      [
        "Field-ready format",
        "Portable handheld design with a detachable reporting accessory."
      ]
    ],
    "specs": [
      [
        "Model",
        "333 external-printer variant"
      ],
      [
        "Product format",
        "Alcohol tester with separate printer"
      ],
      [
        "Sensor principle",
        "Electrochemical fuel cell"
      ],
      [
        "Display",
        "Colour touchscreen interface"
      ],
      [
        "Mouthpiece",
        "Side-mounted sampling mouthpiece"
      ],
      [
        "Printer",
        "Separate compact external printer"
      ],
      [
        "Working principle",
        "Fuel-cell oxidation generates electrons in proportion to alcohol amount"
      ],
      [
        "Operation style",
        "Portable handheld tester with print support"
      ],
      [
        "Measurement range",
        "Not stated in the supplied reference"
      ],
      [
        "Accuracy",
        "Not stated in the supplied reference"
      ],
      [
        "Battery and charging",
        "Not stated in the supplied reference"
      ],
      [
        "Calibration interval",
        "Not stated in the supplied reference"
      ],
      [
        "Dimensions and weight",
        "Not stated in the supplied reference"
      ]
    ],
    "sourceNote": "The supplied catalogue does not provide numeric performance data for this variant. Confirm range, battery, calibration and accessory options with the supplier.",
    "id": 14,
    "image": "assets/product-14.webp",
    "group": "Evidential & reporting",
    "matched": true,
    "sourceKey": "Catalogue p.15",
    "sourceUrl": "catalog.pdf#page=15",
    "cataloguePage": 15,
    "partial": true
  }
];

export const NUNES_CATALOGUE_NETLIFY_URL = 'https://darling-torrone-c0aaf9.netlify.app/';
export const NUNES_OFFICIAL_WEBSITE = 'https://nunesinstruments.com';
export const NUNES_PRIMARY_PHONE = '+91 89409 44000';
export const NUNES_SECONDARY_PHONE = '+91 89409 33000';
export const NUNES_LANDLINE = '+91 0422 2499444';
export const NUNES_OFFICIAL_EMAIL = 'info@nunesinstruments.com';
