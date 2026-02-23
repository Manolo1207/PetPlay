import { tips, Tip } from './tipsData';

function getDogAgeInMonths(ageCategory?: string): number | undefined {
    // Puedes adaptar esto según cómo guardes la edad
    if (!ageCategory) return undefined;
    if (ageCategory === 'cachorro') return 6; // ejemplo: 6 meses
    if (ageCategory === 'adulto') return 36; // ejemplo: 3 años
    if (ageCategory === 'senior') return 96; // ejemplo: 8 años
    return undefined;
}

export function getTipOfTheDay(ageCategory?: string, breed?: string): Tip {
    let filtered = tips;
    const ageMonths = getDogAgeInMonths(ageCategory);
    if (ageMonths !== undefined) {
        filtered = filtered.filter(tip =>
            (tip.minAgeMonths === undefined || ageMonths >= tip.minAgeMonths) &&
            (tip.maxAgeMonths === undefined || ageMonths <= tip.maxAgeMonths)
        );
    }
    if (breed) {
        const breedLower = breed.toLowerCase();
        filtered = filtered.filter(tip =>
            !tip.breeds || tip.breeds.map(b => b.toLowerCase()).includes(breedLower)
            || !tip.breeds?.length
        );
    }
    // Selecciona un tip diferente cada día
    const day = new Date().getDate();
    const idx = filtered.length > 0 ? day % filtered.length : 0;
    return filtered[idx] || tips[0];
}
