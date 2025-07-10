// Nigerian Universities data for UniHuslte
export const NIGERIAN_UNIVERSITIES = [
  // Federal Universities
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'Ahmadu Bello University (ABU)',
  'University of Nigeria, Nsukka (UNN)',
  'Obafemi Awolowo University (OAU)',
  'University of Benin (UNIBEN)',
  'Federal University of Technology, Akure (FUTA)',
  'University of Ilorin (UNILORIN)',
  'Federal University of Technology, Owerri (FUTO)',
  'University of Jos (UNIJOS)',
  'University of Calabar (UNICAL)',
  'University of Port Harcourt (UNIPORT)',
  'Bayero University, Kano (BUK)',
  'Federal University, Dutse (FUD)',
  'University of Abuja (UNIABUJA)',
  
  // State Universities
  'Lagos State University (LASU)',
  'Ekiti State University (EKSU)',
  'Delta State University (DELSU)',
  'Kano State University of Science and Technology',
  'Rivers State University (RSU)',
  'Imo State University (IMSU)',
  'Enugu State University of Science and Technology (ESUT)',
  'Kaduna State University (KASU)',
  'Kwara State University (KWASU)',
  'Osun State University (UNIOSUN)',
  
  // Private Universities
  'Covenant University',
  'Babcock University',
  'Afe Babalola University',
  'Landmark University',
  'Redeemer\'s University',
  'Pan-Atlantic University',
  'Bowen University',
  'Crawford University',
  'Lead City University',
  'Igbinedion University',
  'American University of Nigeria (AUN)',
  'Nile University of Nigeria',
  
  // Specialized Institutions
  'Nigerian Defence Academy (NDA)',
  'Nigerian Turkish Nile University',
  'University of Medical Sciences, Ondo',
  'Federal University of Health Sciences, Otukpo',
  'Federal University of Agriculture, Abeokuta (FUNAAB)',
  'Federal University of Petroleum Resources, Effurun',
  'Federal University of Technology, Minna (FUTMINNA)',
  'Other'
] as const

export type NigerianUniversity = typeof NIGERIAN_UNIVERSITIES[number]

// Function to seed universities in database
export async function seedUniversities(db: any) {
  for (const universityName of NIGERIAN_UNIVERSITIES) {
    await db.university.upsert({
      where: { name: universityName },
      update: {},
      create: {
        name: universityName,
        location: 'Nigeria'
      }
    })
  }
}