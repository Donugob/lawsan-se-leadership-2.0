export function normalizeUniversity(input: string | null | undefined): { canonical: string, state: string } {
  if (!input) return { canonical: "Not Specified", state: "Not Specified" };
  
  const lower = input.toLowerCase().trim();

  const universityMap = [
    // Anambra
    { canonical: "Nnamdi Azikiwe University (UNIZIK)", state: "Anambra", keywords: ["unizik", "nnamdi azikiwe", "nau"] },
    { canonical: "Chukwuemeka Odumegwu Ojukwu University (COOU)", state: "Anambra", keywords: ["coou", "chukwuemeka odumegwu", "ansuu", "anambra state university"] },
    { canonical: "Madonna University", state: "Anambra", keywords: ["madonna"] },
    { canonical: "Tansian University", state: "Anambra", keywords: ["tansian"] },
    { canonical: "Paul University", state: "Anambra", keywords: ["paul university"] },
    { canonical: "Legacy University", state: "Anambra", keywords: ["legacy university"] },
    
    // Imo
    { canonical: "Imo State University (IMSU)", state: "Imo", keywords: ["imsu", "imo state"] },
    { canonical: "Federal University of Technology Owerri (FUTO)", state: "Imo", keywords: ["futo", "technology owerri", "technology, owerri"] },
    { canonical: "Alvan Ikoku Federal University of Education", state: "Imo", keywords: ["alvan", "ikoku"] },
    { canonical: "Kingsley Ozumba Mbadiwe University", state: "Imo", keywords: ["ozumba", "mbadiwe"] },
    
    // Enugu
    { canonical: "University of Nigeria, Nsukka (UNN)", state: "Enugu", keywords: ["unn", "nsukka", "university of nigeria"] },
    { canonical: "Enugu State University of Science and Technology (ESUT)", state: "Enugu", keywords: ["esut", "enugu state university"] },
    { canonical: "Godfrey Okoye University (GOUNI)", state: "Enugu", keywords: ["godfrey", "gouni"] },
    
    // Ebonyi
    { canonical: "Ebonyi State University (EBSU)", state: "Ebonyi", keywords: ["ebsu", "ebonyi state"] },
    { canonical: "Federal University Ndufu-Alike Ikwo (FUNAI)", state: "Ebonyi", keywords: ["funai", "ndufu-alike", "alex ekwueme", "ndufu alike"] },
    
    // Abia
    { canonical: "Abia State University (ABSU)", state: "Abia", keywords: ["absu", "abia state"] },
    { canonical: "Michael Okpara University of Agriculture (MOUAU)", state: "Abia", keywords: ["mouau", "michael okpara", "umudike"] },
    { canonical: "Gregory University", state: "Abia", keywords: ["gregory university", "gregory"] },
    { canonical: "Spiritan University Nneochi (SUN)", state: "Abia", keywords: ["spiritan", "nneochi"] },
  ];

  for (const uni of universityMap) {
    if (uni.keywords.some(kw => lower.includes(kw))) {
      return { canonical: uni.canonical, state: uni.state };
    }
  }

  // Fallback state mapping if state name is in the string but not matched above
  let guessedState = "Other";
  if (lower.includes("owerri") || lower.includes("imo")) guessedState = "Imo";
  else if (lower.includes("enugu") || lower.includes("nsukka")) guessedState = "Enugu";
  else if (lower.includes("anambra") || lower.includes("awka") || lower.includes("onitsha")) guessedState = "Anambra";
  else if (lower.includes("abia") || lower.includes("umuahia") || lower.includes("aba")) guessedState = "Abia";
  else if (lower.includes("ebonyi") || lower.includes("abakaliki")) guessedState = "Ebonyi";
  
  // Capitalize properly: "imo state university owerri" -> "Imo State University Owerri"
  const titleCased = input.trim().replace(/\b\w/g, (c) => c.toUpperCase());
  return { canonical: titleCased, state: guessedState };
}
