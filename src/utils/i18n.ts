// src/utils/i18n.ts
// Utilidad de internacionalización para la app PetPlay

export type Language = 'es' | 'en';

export const translations = {
    es: {
        home: {
            title: 'Descubre',
            loading: 'Cargando perritos de tu zona...',
            noDogs: 'Aún no hay perritos cerca, agrega el tuyo 🐾',
            beFirst: '¡Sé el primero en tu zona y conecta con otros dueños!',
            createDog: 'Crear mi perfil de perrito',
            tipTitle: 'Tip del Día',
            dogsNearby: 'perritos cerca',
            counter: (current: number, total: number) => `${current} de ${total}`,
            reminder: '¡No olvides registrar el paseo de hoy para mantener tu racha!'
        },
        // ...otros módulos
    },
    en: {
        home: {
            title: 'Discover',
            loading: 'Loading dogs in your area...',
            noDogs: 'No dogs nearby yet, add yours 🐾',
            beFirst: 'Be the first in your area and connect with other owners!',
            createDog: 'Create my dog profile',
            tipTitle: 'Tip of the Day',
            dogsNearby: 'dogs nearby',
            counter: (current: number, total: number) => `${current} of ${total}`,
            reminder: `Don't forget to log today's walk to keep your streak!`
        },
        // ...other modules
    }
};

let currentLanguage: Language = 'es';

export function setLanguage(lang: Language) {
    currentLanguage = lang;
}

export function getLanguage(): Language {
    return currentLanguage;
}

export function t(path: string, ...args: any[]): string {
    const [section, key] = path.split('.');
    // TypeScript no permite indexar con string, así que forzamos el tipo
    const dict = (translations[currentLanguage] as any)[section];
    const value = dict?.[key];
    if (typeof value === 'function') return value(...args);
    return value || path;
}
