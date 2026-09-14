/* ---------------- datos base (idénticos al prototipo aprobado) ---------------- */

export const PRODUCTS = [
  { id: 'p1', name: 'Espresso Volcánico', region: 'Tarrazú, San José', price: 1800, icon: 'cup', accent: 'var(--coral)', bg: 'rgba(255,90,60,.1)', available: true,
    cats: ['caliente', 'intenso'], intensity: 5, milk: false, sweet: false, notes: ['Cacao tostado', 'Final terroso'], size: 'Taza única · 6 oz',
    desc: 'Un espresso intenso y de cuerpo firme, cultivado en las tierras altas de Tarrazú. Notas a cacao tostado y un final ligeramente terroso, herencia del suelo volcánico.' },
  { id: 'p2', name: 'Latte Neblina', region: 'Poás, Alajuela', price: 2100, icon: 'drip', accent: 'var(--emerald)', bg: 'rgba(34,178,94,.1)', available: true,
    cats: ['caliente', 'leche'], intensity: 2, milk: true, sweet: true, notes: ['Dulce', 'Cremoso'], size: 'Taza única · 10 oz',
    desc: 'Espresso suave de Poás con leche vaporizada. Dulce y envolvente, como la neblina que cubre el volcán en las mañanas frías.' },
  { id: 'p3', name: 'Ristretto de Altura', region: 'Naranjo, Alajuela', price: 1900, icon: 'beans', accent: 'var(--amber)', bg: 'rgba(239,170,52,.14)', available: false,
    cats: ['caliente', 'intenso'], intensity: 5, milk: false, sweet: false, notes: ['Denso', 'Dulzor natural'], size: 'Taza única · 4 oz',
    desc: 'Extracción corta y concentrada de granos cultivados a más de 1,400 msnm. Cuerpo denso, dulzor natural y muy poca acidez.' },
  { id: 'p4', name: 'Cold Brew Bosque Nuboso', region: 'Turrialba, Cartago', price: 2400, icon: 'glass', accent: 'var(--tech)', bg: 'rgba(85,168,108,.14)', available: true,
    cats: ['fria'], intensity: 3, milk: false, sweet: true, notes: ['Suave', 'Refrescante'], size: 'Vaso único · 14 oz',
    desc: 'Infusión fría de 16 horas. Suave, ligeramente dulce y refrescante — ideal para las tardes cálidas del campus.' },
];

export const CATEGORY_LABELS = { todas: 'Todas', caliente: 'Calientes', fria: 'Frías', leche: 'Con leche', intenso: 'Intensos' };

export const PAY_METHODS = [
  { id: 'tarjeta', label: 'Tarjeta de crédito o débito' },
  { id: 'sinpe', label: 'SINPE Móvil' },
  { id: 'transferencia', label: 'Transferencia bancaria' },
];

export const SERVICE_TAX_RATE = 0.10;

export const PREF_GROUPS = [
  { key: 'temp', label: '¿Frío o caliente?', options: [{ v: 'caliente', t: 'Caliente' }, { v: 'fria', t: 'Frío' }] },
  { key: 'milk', label: '¿Con leche o sin leche?', options: [{ v: 'leche', t: 'Con leche' }, { v: 'sin-leche', t: 'Sin leche' }] },
  { key: 'intensity', label: '¿Suave o intenso?', options: [{ v: 'suave', t: 'Suave' }, { v: 'intenso', t: 'Intenso' }] },
  { key: 'sweet', label: '¿Dulce o sin azúcar?', options: [{ v: 'dulce', t: 'Dulce' }, { v: 'sin-azucar', t: 'Sin azúcar' }] },
];

export const CHALLENGES = [
  { eyebrow: 'Origen del café',
    question: '¿En qué región de Costa Rica se cultiva tradicionalmente el café Tarrazú?',
    options: [{ t: 'Guanacaste', c: false }, { t: 'Los Santos, San José', c: true }, { t: 'Limón', c: false }],
    hint: 'Piense en la subregión que le da nombre al café más premiado del país.',
    explain: 'El café de Los Santos se cultiva sobre los 1,200 msnm, lo que le da mayor acidez y dulzura — una de las razones por las que Costa Rica es reconocida mundialmente por su taza.' },
  { eyebrow: 'Altura y sabor',
    question: 'En general, ¿qué efecto tiene cultivar café a mayor altura?',
    options: [{ t: 'Le da más acidez y notas más complejas', c: true }, { t: 'Lo hace crecer más rápido', c: false }, { t: 'Elimina la necesidad de tueste', c: false }],
    hint: 'Piense en cómo cambia el clima —y el ritmo de maduración del grano— cuanto más alto se cultiva.',
    explain: 'A mayor altura, el grano madura más lento por el clima más frío, lo que concentra azúcares y ácidos — por eso los cafés de altura, como los de Tarrazú o Naranjo, suelen tener más cuerpo y complejidad.' },
  { eyebrow: 'Métodos de preparación',
    question: '¿Qué diferencia principal hay entre un espresso y un cold brew?',
    options: [{ t: 'El espresso usa agua caliente a presión; el cold brew se infusiona en frío durante horas', c: true }, { t: 'Son el mismo método, solo cambia la temperatura al servir', c: false }, { t: 'El cold brew siempre lleva más cafeína que cualquier espresso', c: false }],
    hint: 'Piense en el tiempo y la temperatura que usa cada método para extraer el café.',
    explain: 'El espresso extrae rápido con agua caliente a presión, dando un sabor intenso y concentrado. El cold brew se infusiona en frío durante muchas horas, lo que produce una bebida más suave y menos ácida.' },
  { eyebrow: 'Sostenibilidad',
    question: '¿Por qué muchas fincas de altura en Costa Rica cultivan el café bajo sombra de otros árboles?',
    options: [{ t: 'Solo por estética del paisaje', c: false }, { t: 'Porque protege el suelo, la biodiversidad y regula la temperatura del cultivo', c: true }, { t: 'Porque así el café crece más rápido', c: false }],
    hint: 'Piense en lo que necesita un ecosistema para mantenerse saludable a largo plazo, no solo la planta de café.',
    explain: 'El cultivo bajo sombra ayuda a conservar el suelo, da hogar a polinizadores y aves, y modera la temperatura — una práctica asociada a una caficultura más sostenible.' },
  { eyebrow: 'Inteligencia artificial responsable',
    question: '¿Por qué es importante que SofIA le diga con claridad que es una inteligencia artificial y no una persona?',
    options: [{ t: 'Para que usted sepa con quién —o con qué— está interactuando, y pueda confiar en la información que recibe', c: true }, { t: 'No es importante, da igual si lo sabe o no', c: false }, { t: 'Solo por cumplir un trámite legal', c: false }],
    hint: 'Piense en la confianza: ¿qué necesita saber una persona para sentirse tratada con honestidad?',
    explain: 'La transparencia sobre el uso de inteligencia artificial permite que usted decida cuánto confiar en una recomendación, y entienda que, detrás de SofIA, las decisiones importantes las sigue tomando el equipo humano del café.' },
];

export const STORE_KEY = 'cafesofia_demo_v2';

export const money = (c) => '₡' + c.toLocaleString('es-CR');
