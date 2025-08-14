export const getAgeFromBirthYear = (birthYear?: number | null): number | null => {
    if (!birthYear || Number.isNaN(birthYear)) return null;
    const age = new Date().getFullYear() - birthYear;
    return age >= 0 ? age : null;
  };
  
  export const getAgeBucket = (age: number | null): string | null => {
    if (age == null) return null;
    if (age < 20) return "10대";
    if (age <= 25) return "20대초반";   // 20–25
    if (age <= 29) return "20대후반";   // 26–29
    if (age <= 39) return "30대";       // 30–39
    if (age <= 49) return "40대";       // 40–49
    return "50대+";
  };