// tipsData.ts
export interface Tip {
    id: string;
    text: string;
    extendedText?: string;
    tags?: string[];
    breeds?: string[];
    minAgeMonths?: number;
    maxAgeMonths?: number;
}

export const tips: Tip[] = [
    {
        id: '1',
        text: 'Socializa a tu cachorro con otros perros y personas desde pequeño.',
        extendedText: 'La socialización temprana previene miedos y problemas de conducta en la adultez. Lleva a tu cachorro a parques, clases de obediencia y permite que conozca diferentes ambientes.',
        tags: ['cachorro', 'socialización'],
        minAgeMonths: 2,
        maxAgeMonths: 12,
    },
    {
        id: '2',
        text: 'Vacuna a tu cachorro según el calendario veterinario.',
        extendedText: 'Las vacunas protegen a tu perro de enfermedades graves. Consulta con tu veterinario el esquema adecuado para su edad y zona.',
        tags: ['cachorro', 'vacunas'],
        minAgeMonths: 2,
        maxAgeMonths: 12,
    },
    {
        id: '3',
        text: 'Cuida las articulaciones de tu perro senior con paseos suaves.',
        extendedText: 'Los perros mayores pueden sufrir de artritis. Prefiere paseos cortos y superficies blandas, y consulta al veterinario sobre suplementos articulares.',
        tags: ['senior', 'articulaciones'],
        minAgeMonths: 84,
    },
    {
        id: '4',
        text: 'Evita pasear a razas braquicéfalas en horas de calor.',
        extendedText: 'Pugs, Bulldogs y razas similares son propensas a golpes de calor. Prefiere paseos cortos y en horarios frescos.',
        tags: ['braquicéfalo', 'golpe de calor'],
        breeds: ['pug', 'bulldog', 'boston terrier'],
    },
    {
        id: '5',
        text: 'Estimula mentalmente a razas activas con juegos de olfato.',
        extendedText: 'Border Collie, Husky y otras razas activas necesitan retos mentales. Esconde premios en casa o usa juguetes interactivos.',
        tags: ['activo', 'estimulación mental'],
        breeds: ['border collie', 'husky', 'pastor alemán'],
    },
    {
        id: '6',
        text: 'Premia el buen comportamiento con caricias o snacks saludables.',
        extendedText: 'El refuerzo positivo fortalece el vínculo y motiva a tu perro a aprender.',
    },
    {
        id: '7',
        text: 'El agua fresca siempre debe estar disponible para tu perro.',
        extendedText: 'Cambia el agua varias veces al día, especialmente en verano o después de paseos largos.',
    },
    {
        id: '8',
        text: 'Cepilla a tu perro regularmente para mantener su pelaje sano.',
        extendedText: 'El cepillado previene nudos, elimina pelo muerto y permite revisar la piel de tu perro.',
    },
];
