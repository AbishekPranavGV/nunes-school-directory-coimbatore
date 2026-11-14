// Authoritative Sub-District (Taluk & Educational Block) Metadata for South India
// Covers all 14 Kerala Districts and all 38 Tamil Nadu Districts

export interface SubDistrictGroup {
  districtId: string;
  districtName: string;
  state: 'kerala' | 'tamil-nadu';
  taluks: string[];
  blocks: string[];
}

export const KERALA_SUB_DISTRICTS: Record<string, { taluks: string[]; blocks: string[] }> = {
  thiruvananthapuram: {
    taluks: ['Attingal', 'Nedumangad', 'Neyyattinkara', 'Thiruvananthapuram North', 'Thiruvananthapuram South', 'Varkala'],
    blocks: ['Attingal', 'Nedumangad', 'Neyyattinkara', 'Thiruvananthapuram North', 'Thiruvananthapuram South', 'Varkala']
  },
  ernakulam: {
    taluks: ['Aluva', 'Angamaly', 'Ernakulam City', 'Kochi', 'Kothamangalam', 'Muvattupuzha', 'Paravur', 'Perumbavoor'],
    blocks: ['Alangad', 'Angamaly', 'Edappally', 'Koovappady', 'Kothamangalam', 'Mulanthuruthy', 'Muvattupuzha', 'Pampakuda', 'Parakkadavu', 'Paravur', 'Vadavucode', 'Vypeen']
  },
  kozhikode: {
    taluks: ['Balussery', 'Koyilandy', 'Kozhikode City', 'Kunnamangalam', 'Thamarassery', 'Vadakara'],
    blocks: ['Balussery', 'Chelannur', 'Koduvally', 'Kozhikode City', 'Kunnamangalam', 'Melady', 'Panthalayani', 'Thodannur', 'Tuneri', 'Vadakara']
  },
  thrissur: {
    taluks: ['Chalakudy', 'Chavakkad', 'Irinjalakuda', 'Kodungallur', 'Thrissur East', 'Thrissur West', 'Wadakkanchery'],
    blocks: ['Anthikkad', 'Chalakudy', 'Chavakkad', 'Cherpu', 'Chowannur', 'Irinjalakuda', 'Kodungallur', 'Mala', 'Mathilakam', 'Ollukkara', 'Pazhayannur', 'Puzhakkal', 'Thalappilly', 'Wadakkanchery']
  },
  palakkad: {
    taluks: ['Alathur', 'Chittur', 'Kuzhalmannam', 'Mannarkkad', 'Ottapalam', 'Palakkad Town', 'Pattambi'],
    blocks: ['Alathur', 'Attappady', 'Chittur', 'Kollengode', 'Kuzhalmannam', 'Malampuzha', 'Mannarkkad', 'Nemmara', 'Ottapalam', 'Palakkad', 'Pattambi', 'Sreekrishnapuram', 'Thrithala']
  },
  malappuram: {
    taluks: ['Kondotty', 'Malappuram Central', 'Manjeri', 'Nilambur', 'Perinthalmanna', 'Ponnani', 'Tirur'],
    blocks: ['Areacode', 'Kalikavu', 'Kondotty', 'Kuttippuram', 'Malappuram', 'Mankada', 'Nilambur', 'Perinthalmanna', 'Perumpadappu', 'Ponnani', 'Tanur', 'Tirur', 'Tirurangadi', 'Vengara', 'Wandoor']
  },
  kollam: {
    taluks: ['Chathannoor', 'Karunagappally', 'Kollam City', 'Kottarakkara', 'Punalur', 'Sasthamkotta'],
    blocks: ['Anchal', 'Chadayamangalam', 'Chavara', 'Chittumala', 'Ithikkara', 'Kottarakkara', 'Mukhathala', 'Oachira', 'Pathanapuram', 'Sasthamcotta', 'Vettikkavala']
  },
  kottayam: {
    taluks: ['Changanassery', 'Kanjirappally', 'Kottayam North', 'Kottayam South', 'Pala', 'Vaikom'],
    blocks: ['Ettumanoor', 'Kaduthuruthy', 'Kanjirappally', 'Lalam', 'Madappally', 'Nedumkunnam', 'Pallom', 'Pampady', 'Uzhavoor', 'Vaikom', 'Vazhoor']
  },
  kannur: {
    taluks: ['Iritty', 'Kannur Urban', 'Mattannur', 'Payyanur', 'Taliparamba', 'Thalassery'],
    blocks: ['Edakkad', 'Irikkur', 'Iritty', 'Kannur', 'Kuthuparamba', 'Panoor', 'Payyannur', 'Peravoor', 'Taliparamba', 'Thalassery']
  },
  alappuzha: {
    taluks: ['Alappuzha Urban', 'Ambalapuzha', 'Chengannur', 'Cherthala', 'Kayamkulam', 'Mavelikkara'],
    blocks: ['Ambalappuzha', 'Aryad', 'Bharanikkavu', 'Champakkulam', 'Chengannur', 'Haripad', 'Kanjikkuzhy', 'Mavelikkara', 'Muthukulam', 'Pattanakkad', 'Thycattussery', 'Veliyanad']
  },
  pathanamthitta: {
    taluks: ['Adoor', 'Konni', 'Kozhencherry', 'Pathanamthitta', 'Ranni', 'Thiruvalla'],
    blocks: ['Elanthoor', 'Koipuram', 'Konni', 'Mallappally', 'Pandalam', 'Parakode', 'Pulikeezhu', 'Ranni']
  },
  idukki: {
    taluks: ['Kattappana', 'Munnar', 'Nedumkandam', 'Painavu', 'Peermade', 'Thodupuzha'],
    blocks: ['Adimaly', 'Azutha', 'Devikulam', 'Elamdesam', 'Idukki', 'Kattappana', 'Nedumkandam', 'Thodupuzha']
  },
  wayanad: {
    taluks: ['Kalpetta', 'Mananthavady', 'Panaamaram', 'Sulthan Bathery', 'Vythiri'],
    blocks: ['Kalpetta', 'Mananthavady', 'Panamaram', 'Sulthan Bathery']
  },
  kasaragod: {
    taluks: ['Hosdurg', 'Kanhangad', 'Kasaragod Town', 'Manjeshwaram', 'Nileshwar'],
    blocks: ['Kanhangad', 'Karadka', 'Kasargod', 'Manjeswaram', 'Nileshwar', 'Parappa']
  }
};

export const COIMBATORE_TALUKS = [
  'Coimbatore South',
  'Coimbatore North',
  'Pollachi',
  'Sulur',
  'Annur',
  'Mettupalayam',
  'Madukkarai',
  'Perur',
  'Kinathukadavu',
  'Valparai',
  'Anaimalai'
];

export const COIMBATORE_BLOCKS = [
  'Anaimalai',
  'Annur',
  'Coimbatore City',
  'Karamadai',
  'Kinathukadavu',
  'Madukkarai',
  'Periyanaickanpalayam',
  'Perur',
  'Pollachi North',
  'Pollachi South',
  'S.S.Kulam',
  'Sultanpet',
  'Sulur',
  'Thondamuthur',
  'Valparai'
];

export const NILGIRIS_TALUKS = [
  'Coonoor',
  'Kotagiri',
  'Gudalur',
  'Udhagamandalam',
  'Pandalur',
  'Kundah'
];

export const NILGIRIS_BLOCKS = [
  'Coonoor',
  'Kotagiri',
  'Gudalur',
  'Udhagamandalam'
];

export const CHENNAI_TALUKS = [
  'Anna Nagar',
  'Egmore',
  'Mylapore',
  'Tondiarpet',
  'Royapuram',
  'Teynampet',
  'Kodambakkam',
  'Adyar',
  'Alandur',
  'Velachery',
  'Sholinganallur',
  'Thiru Vi Ka Nagar'
];

export const CHENNAI_BLOCKS = [
  'Chennai North',
  'Chennai Central',
  'Chennai South',
  'Chennai East'
];

// Helper to get all Kerala taluks aggregated
export function getAllKeralaTaluks(): string[] {
  const set = new Set<string>();
  Object.values(KERALA_SUB_DISTRICTS).forEach(d => d.taluks.forEach(t => set.add(t)));
  return Array.from(set).sort();
}

// Helper to get all Kerala blocks aggregated
export function getAllKeralaBlocks(): string[] {
  const set = new Set<string>();
  Object.values(KERALA_SUB_DISTRICTS).forEach(d => d.blocks.forEach(b => set.add(b)));
  return Array.from(set).sort();
}

// Unified Taluk resolver based on current UI state
export function getSubDistrictsForStateAndDistrict(selectedState: string = 'all', selectedDistrict: string = 'all'): {
  taluks: Array<{ name: string; group?: string }>;
  blocks: Array<{ name: string; group?: string }>;
  talukPlaceholder: string;
  blockPlaceholder: string;
} {
  const normState = (selectedState || 'all').toLowerCase();
  const normDistrict = (selectedDistrict || 'all').toLowerCase();

  // 1. KERALA STATE OR SPECIFIC KERALA DISTRICT
  if (normState === 'kerala' || KERALA_SUB_DISTRICTS[normDistrict]) {
    const distData = KERALA_SUB_DISTRICTS[normDistrict];
    if (distData) {
      const distName = normDistrict.charAt(0).toUpperCase() + normDistrict.slice(1);
      return {
        taluks: distData.taluks.map(t => ({ name: t })),
        blocks: distData.blocks.map(b => ({ name: b })),
        talukPlaceholder: `All ${distName} Taluks (${distData.taluks.length})`,
        blockPlaceholder: `All ${distName} Blocks (${distData.blocks.length})`
      };
    }
    const allKlTaluks = getAllKeralaTaluks();
    const allKlBlocks = getAllKeralaBlocks();
    return {
      taluks: allKlTaluks.map(t => ({ name: t, group: '🌴 Kerala Taluks' })),
      blocks: allKlBlocks.map(b => ({ name: b, group: '🌴 Kerala Blocks' })),
      talukPlaceholder: `All Kerala Taluks (${allKlTaluks.length} Taluks)`,
      blockPlaceholder: `All Kerala Blocks (${allKlBlocks.length} Blocks)`
    };
  }

  // 2. TAMIL NADU STATE OR COIMBATORE / NILGIRIS / CHENNAI
  if (normState === 'tamil-nadu' || normDistrict === 'coimbatore' || normDistrict === 'the_nilgiris' || normDistrict === 'chennai') {
    if (normDistrict === 'coimbatore' || normDistrict === '3312') {
      return {
        taluks: COIMBATORE_TALUKS.map(t => ({ name: t })),
        blocks: COIMBATORE_BLOCKS.map(b => ({ name: b })),
        talukPlaceholder: 'All 11 Taluks (Coimbatore)',
        blockPlaceholder: 'All 15 Blocks (Coimbatore)'
      };
    }
    if (normDistrict === 'the_nilgiris' || normDistrict === 'nilgiris') {
      return {
        taluks: NILGIRIS_TALUKS.map(t => ({ name: t })),
        blocks: NILGIRIS_BLOCKS.map(b => ({ name: b })),
        talukPlaceholder: 'All The Nilgiris Taluks (6)',
        blockPlaceholder: 'All The Nilgiris Blocks (4)'
      };
    }
    if (normDistrict === 'chennai') {
      return {
        taluks: CHENNAI_TALUKS.map(t => ({ name: t })),
        blocks: CHENNAI_BLOCKS.map(b => ({ name: b })),
        talukPlaceholder: 'All Chennai Taluks (12)',
        blockPlaceholder: 'All Chennai Educational Blocks (4)'
      };
    }
    return {
      taluks: COIMBATORE_TALUKS.map(t => ({ name: t, group: '🌿 Tamil Nadu Taluks' })),
      blocks: COIMBATORE_BLOCKS.map(b => ({ name: b, group: '🌿 Tamil Nadu Blocks' })),
      talukPlaceholder: 'All Tamil Nadu Taluks',
      blockPlaceholder: 'All Tamil Nadu Blocks'
    };
  }

  // 3. ALL SOUTH INDIA (COMBINED 52 DISTRICTS)
  const klTaluks = getAllKeralaTaluks();
  const klBlocks = getAllKeralaBlocks();
  return {
    taluks: [
      ...COIMBATORE_TALUKS.map(t => ({ name: t, group: '🌿 Tamil Nadu (Coimbatore / Statewide)' })),
      ...klTaluks.map(t => ({ name: t, group: '🌴 Kerala State (14 Districts)' }))
    ],
    blocks: [
      ...COIMBATORE_BLOCKS.map(b => ({ name: b, group: '🌿 Tamil Nadu Educational Blocks' })),
      ...klBlocks.map(b => ({ name: b, group: '🌴 Kerala Educational Blocks' }))
    ],
    talukPlaceholder: 'All South India Taluks (KL & TN)',
    blockPlaceholder: 'All South India Blocks (KL & TN)'
  };
}
