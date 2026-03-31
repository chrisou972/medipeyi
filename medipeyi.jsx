import { useEffect, useMemo, useState } from "react";

const OFFICIAL_SOURCES = {
  ameliLabel: "Annuaire santé Ameli",
  ameliUpdatedAt: "2026-03-23",
  ameliUrl: "https://www.data.gouv.fr/datasets/annuaire-sante-ameli",
  tabularApiUrl: "https://www.data.gouv.fr/dataservices/api-tabulaire-data-gouv-fr-beta",
  tabularResourceUrl:
    "https://tabular-api.data.gouv.fr/api/resources/432983b9-2e6f-473a-b35a-20403c300a5f/data/",
  gardeUrl: "https://www.3237.fr/index_3237.php?m=1",
  urpsPharmaciesUrl: "https://www.urpspharmaciens972.fr/missions-services/",
  arsUrl: "https://www.martinique.ars.sante.fr",
  addressApiUrl: "https://api-adresse.data.gouv.fr",
  chuUrl: "https://www.chu-martinique.fr/en/urgent-admission/",
};

const PS_RESOURCE_ID = "432983b9-2e6f-473a-b35a-20403c300a5f";
const CDS_RESOURCE_ID = "767470ac-dcf9-4110-97b6-cb2be3b59ba2";
const MARTINIQUE_FILTERS = {
  coordonnees_code_postal__greater: "97199",
  coordonnees_code_postal__less: "97300",
};

const THEMES = {
  light: {
    bg: "#fff8dd",
    bgAlt: "#fffdf0",
    panel: "rgba(255,255,255,0.88)",
    panelStrong: "#ffffff",
    panelAlt: "#f3efcf",
    ink: "#173122",
    sub: "#5a6f51",
    soft: "#8ca181",
    border: "rgba(23,49,34,0.10)",
    accent: "#168a55",
    accentSoft: "rgba(22,138,85,0.10)",
    accent2: "#f0c84b",
    accent2Soft: "rgba(240,200,75,0.16)",
    accent3: "#84bf4b",
    accent3Soft: "rgba(132,191,75,0.14)",
    danger: "#d84a45",
    dangerSoft: "rgba(216,74,69,0.10)",
    nav: "rgba(255,248,221,0.92)",
    hero:
      "linear-gradient(140deg, #0b7f4b 0%, #8bbf38 46%, #f4d84d 100%)",
    heroGlow:
      "radial-gradient(circle at top right, rgba(255,247,191,0.54), transparent 42%)",
    shadow: "0 22px 60px rgba(17, 39, 63, 0.12)",
    softShadow: "0 10px 30px rgba(17, 39, 63, 0.08)",
  },
  dark: {
    bg: "#0f180f",
    bgAlt: "#172417",
    panel: "rgba(14,32,46,0.86)",
    panelStrong: "#1b2b1d",
    panelAlt: "#25392a",
    ink: "#f6f7e7",
    sub: "#c3cfb2",
    soft: "#8c9979",
    border: "rgba(255,255,255,0.10)",
    accent: "#70d782",
    accentSoft: "rgba(112,215,130,0.14)",
    accent2: "#f0cf66",
    accent2Soft: "rgba(240,207,102,0.16)",
    accent3: "#a4d36a",
    accent3Soft: "rgba(164,211,106,0.16)",
    danger: "#ff6d66",
    dangerSoft: "rgba(255,109,102,0.12)",
    nav: "rgba(15,24,15,0.94)",
    hero:
      "linear-gradient(140deg, #0b5d38 0%, #6d9f2d 42%, #c6a52f 100%)",
    heroGlow:
      "radial-gradient(circle at top right, rgba(255,240,162,0.24), transparent 46%)",
    shadow: "0 22px 60px rgba(0, 0, 0, 0.28)",
    softShadow: "0 10px 30px rgba(0, 0, 0, 0.20)",
  },
};

const ZONES = [
  { id: "all", label: "Toute la Martinique", emoji: "🏝" },
  { id: "centre", label: "Centre", emoji: "🏙" },
  { id: "aeroport", label: "Lamentin / Aéroport", emoji: "✈️" },
  { id: "nord-atlantique", label: "Nord Atlantique", emoji: "🌤" },
  { id: "nord-caraibe", label: "Nord Caraïbe", emoji: "🌊" },
  { id: "sud", label: "Sud", emoji: "🌴" },
];

const MARTINIQUE_COMMUNES = [
  { label: "Ajoupa-Bouillon", zone: "nord-caraibe", postcodes: ["97216"] },
  { label: "Les Anses-d'Arlet", zone: "sud", postcodes: ["97217"] },
  { label: "Basse-Pointe", zone: "nord-atlantique", postcodes: ["97218"] },
  { label: "Bellefontaine", zone: "nord-caraibe", postcodes: ["97222"] },
  { label: "Le Carbet", zone: "nord-caraibe", postcodes: ["97221"] },
  { label: "Case-Pilote", zone: "nord-caraibe", postcodes: ["97222"] },
  { label: "Ducos", zone: "centre", postcodes: ["97224"] },
  { label: "Fonds-Saint-Denis", zone: "nord-caraibe", postcodes: ["97250"] },
  { label: "Fort-de-France", zone: "centre", postcodes: ["97200"] },
  { label: "Le Diamant", zone: "sud", postcodes: ["97223"] },
  { label: "Le François", zone: "nord-atlantique", postcodes: ["97240"] },
  { label: "Grand'Rivière", zone: "nord-atlantique", postcodes: ["97218"] },
  { label: "Gros-Morne", zone: "nord-atlantique", postcodes: ["97213"] },
  { label: "Le Lamentin", zone: "aeroport", postcodes: ["97232"] },
  { label: "Le Lorrain", zone: "nord-atlantique", postcodes: ["97214"] },
  { label: "Le Marigot", zone: "nord-atlantique", postcodes: ["97225"] },
  { label: "Le Marin", zone: "sud", postcodes: ["97290"] },
  { label: "Le Morne-Rouge", zone: "nord-caraibe", postcodes: ["97260"] },
  { label: "Le Morne-Vert", zone: "nord-caraibe", postcodes: ["97226"] },
  { label: "Macouba", zone: "nord-atlantique", postcodes: ["97218"] },
  { label: "Le Prêcheur", zone: "nord-caraibe", postcodes: ["97250"] },
  { label: "Le Robert", zone: "nord-atlantique", postcodes: ["97231"] },
  { label: "Rivière-Pilote", zone: "sud", postcodes: ["97211"] },
  { label: "Rivière-Salée", zone: "sud", postcodes: ["97215"] },
  { label: "Saint-Esprit", zone: "sud", postcodes: ["97270"] },
  { label: "Saint-Joseph", zone: "centre", postcodes: ["97212"] },
  { label: "Saint-Pierre", zone: "nord-caraibe", postcodes: ["97250"] },
  { label: "Sainte-Anne", zone: "sud", postcodes: ["97227"] },
  { label: "Sainte-Luce", zone: "sud", postcodes: ["97228"] },
  { label: "Sainte-Marie", zone: "nord-atlantique", postcodes: ["97230"] },
  { label: "Schœlcher", zone: "centre", postcodes: ["97233"] },
  { label: "La Trinité", zone: "nord-atlantique", postcodes: ["97220"] },
  { label: "Les Trois-Îlets", zone: "sud", postcodes: ["97229"] },
  { label: "Le Vauclin", zone: "sud", postcodes: ["97280"] },
];

const CATEGORIES = [
  { id: "pharmacie", label: "Pharmacies", icon: "✚", color: "#007c78" },
  { id: "medecin", label: "Médecins", icon: "◉", color: "#1e98c7" },
  { id: "dentiste", label: "Dentistes", icon: "◌", color: "#a167f6" },
  { id: "kine", label: "Kinés", icon: "≋", color: "#f58539" },
  { id: "ophtalmo", label: "Ophtalmo", icon: "◐", color: "#d9497b" },
  { id: "infirmier", label: "Infirmiers", icon: "✤", color: "#1da7c6" },
  { id: "labo", label: "Labos", icon: "▣", color: "#5b7de3" },
  { id: "hopital", label: "Urgences / Hôpitaux", icon: "✚", color: "#d84a45" },
  { id: "sage-femme", label: "Sages-femmes", icon: "◔", color: "#f06a95" },
  { id: "psy", label: "Psys", icon: "◎", color: "#7f60d7" },
  { id: "centre-sante", label: "Centres de santé", icon: "▤", color: "#4f8f5b" },
];

const CATEGORY_CONFIG = {
  pharmacie: {
    source: "ps",
    params: { specialite_libelle__exact: "Pharmacien" },
    specialtyLabel: "Pharmacien",
  },
  medecin: {
    source: "ps",
    params: {
      type_ps_libelle__exact: "Médecins généralistes et spécialistes",
    },
    specialtyLabel: "Médecin",
  },
  dentiste: {
    source: "ps",
    params: { type_ps_libelle__exact: "Dentistes" },
    specialtyLabel: "Chirurgien-dentiste",
  },
  kine: {
    source: "ps",
    params: { specialite_libelle__contains: "kinésithérapeute" },
    specialtyLabel: "Masseur-kinésithérapeute",
  },
  ophtalmo: {
    source: "ps",
    params: { specialite_libelle__exact: "Ophtalmologiste" },
    specialtyLabel: "Ophtalmologiste",
  },
  infirmier: {
    source: "ps",
    params: { specialite_libelle__contains: "Infirmier" },
    specialtyLabel: "Infirmier",
  },
  labo: {
    source: "ps",
    params: { type_ps_libelle__exact: "Laboratoires" },
    specialtyLabel: "Analyses médicales",
  },
  "sage-femme": {
    source: "ps",
    params: { specialite_libelle__exact: "Sage-femme" },
    specialtyLabel: "Sage-femme",
  },
  psy: {
    source: "ps",
    params: { specialite_libelle__contains: "Psychiatre" },
    specialtyLabel: "Psychiatre",
  },
  "centre-sante": {
    source: "cds",
    params: {},
    specialtyLabel: "Centre de santé",
  },
};

const CITY_ZONE_MAP = {
  "FORT DE FRANCE": "centre",
  FORTDEFRANCE: "centre",
  SCHOELCHER: "centre",
  "SAINT JOSEPH": "centre",
  "ST JOSEPH": "centre",
  DUCOS: "centre",
  LELAMENTIN: "aeroport",
  LAMENTIN: "aeroport",
  "LE ROBERT": "nord-atlantique",
  ROBERT: "nord-atlantique",
  "LE FRANCOIS": "nord-atlantique",
  FRANCOIS: "nord-atlantique",
  "LA TRINITE": "nord-atlantique",
  TRINITE: "nord-atlantique",
  "STE MARIE": "nord-atlantique",
  "SAINTE MARIE": "nord-atlantique",
  "BASSE POINTE": "nord-atlantique",
  "LE LORRAIN": "nord-atlantique",
  LORRAIN: "nord-atlantique",
  MARIGOT: "nord-atlantique",
  "GROS MORNE": "nord-atlantique",
  MACOUBA: "nord-atlantique",
  "LE CARBET": "nord-caraibe",
  CARBET: "nord-caraibe",
  "SAINT PIERRE": "nord-caraibe",
  "LE PRECHEUR": "nord-caraibe",
  PRECHEUR: "nord-caraibe",
  BELLEFONTAINE: "nord-caraibe",
  "CASE PILOTE": "nord-caraibe",
  "LE MORNE ROUGE": "nord-caraibe",
  "MORNE VERT": "nord-caraibe",
  "FONDS SAINT DENIS": "nord-caraibe",
  "LE MARIN": "sud",
  MARIN: "sud",
  "SAINTE ANNE": "sud",
  "STE ANNE": "sud",
  "LE DIAMANT": "sud",
  DIAMANT: "sud",
  "LES ANSES D ARLET": "sud",
  "LES TROIS ILETS": "sud",
  "TROIS ILETS": "sud",
  "SAINTE LUCE": "sud",
  "STE LUCE": "sud",
  "RIVIERE SALEE": "sud",
  "RIVIERE PILOTE": "sud",
  "SAINT ESPRIT": "sud",
  "LE VAUCLIN": "sud",
  VAUCLIN: "sud",
};

const COMMUNE_INDEX = Object.fromEntries(
  MARTINIQUE_COMMUNES.map((commune) => [normalizeText(commune.label), commune])
);

const COMMUNES_BY_POSTCODE = MARTINIQUE_COMMUNES.reduce((acc, commune) => {
  commune.postcodes.forEach((postcode) => {
    acc[postcode] = [...(acc[postcode] || []), commune.label];
  });
  return acc;
}, {});

const CITY_ALIAS_TO_COMMUNE = {
  AJOUPABOUILLON: "Ajoupa-Bouillon",
  "AJOUPA BOUILLON": "Ajoupa-Bouillon",
  "ANSES D ARLET": "Les Anses-d'Arlet",
  "LES ANSES D ARLET": "Les Anses-d'Arlet",
  BASSEPOINTE: "Basse-Pointe",
  "BASSE POINTE": "Basse-Pointe",
  BELLEFONTAINE: "Bellefontaine",
  CARBET: "Le Carbet",
  "LE CARBET": "Le Carbet",
  CASEPILOTE: "Case-Pilote",
  "CASE PILOTE": "Case-Pilote",
  DUCOS: "Ducos",
  "FONDS SAINT DENIS": "Fonds-Saint-Denis",
  FONDSSAINTDENIS: "Fonds-Saint-Denis",
  "FORT DE FRANCE": "Fort-de-France",
  FORTDEFRANCE: "Fort-de-France",
  FRANCOIS: "Le François",
  "LE FRANCOIS": "Le François",
  "GRAND RIVIERE": "Grand'Rivière",
  GRANDRIVIERE: "Grand'Rivière",
  "GROS MORNE": "Gros-Morne",
  GROSMORNE: "Gros-Morne",
  LAMENTIN: "Le Lamentin",
  LELAMENTIN: "Le Lamentin",
  CAYENNE: "Le Lamentin",
  LORRAIN: "Le Lorrain",
  "LE LORRAIN": "Le Lorrain",
  MARIGOT: "Le Marigot",
  "LE MARIGOT": "Le Marigot",
  DIAMANT: "Le Diamant",
  "LE DIAMANT": "Le Diamant",
  MARIN: "Le Marin",
  "LE MARIN": "Le Marin",
  MORNEROUGE: "Le Morne-Rouge",
  "MORNE ROUGE": "Le Morne-Rouge",
  "LE MORNE ROUGE": "Le Morne-Rouge",
  MORNEVERT: "Le Morne-Vert",
  "LE MORNE VERT": "Le Morne-Vert",
  "MORNE VERT": "Le Morne-Vert",
  MACOUBA: "Macouba",
  PRECHEUR: "Le Prêcheur",
  "LE PRECHEUR": "Le Prêcheur",
  ROBERT: "Le Robert",
  "LE ROBERT": "Le Robert",
  "RIVIERE PILOTE": "Rivière-Pilote",
  RIVIEREPILOTE: "Rivière-Pilote",
  "RIVIERE SALEE": "Rivière-Salée",
  RIVIERESALEE: "Rivière-Salée",
  "SAINT ESPRIT": "Saint-Esprit",
  STESPRIT: "Saint-Esprit",
  "ST ESPRIT": "Saint-Esprit",
  SAINTESPRIT: "Saint-Esprit",
  "SAINT JOSEPH": "Saint-Joseph",
  "ST JOSEPH": "Saint-Joseph",
  SAINTJOSEPH: "Saint-Joseph",
  "SAINT PIERRE": "Saint-Pierre",
  SAINTPIERRE: "Saint-Pierre",
  "STE ANNE": "Sainte-Anne",
  "SAINTE ANNE": "Sainte-Anne",
  "STE LUCE": "Sainte-Luce",
  "SAINTE LUCE": "Sainte-Luce",
  "STE MARIE": "Sainte-Marie",
  "SAINTE MARIE": "Sainte-Marie",
  SCHOELCHER: "Schœlcher",
  TRINITE: "La Trinité",
  "LA TRINITE": "La Trinité",
  "TROIS ILETS": "Les Trois-Îlets",
  "LES TROIS ILETS": "Les Trois-Îlets",
  VAUCLIN: "Le Vauclin",
  "LE VAUCLIN": "Le Vauclin",
};

const VERIFIED_STE_MARIE_PHARMACIES = [
  {
    id: "stm-ocean",
    name: "Pharmacie de l'Ocean",
    specialty: "Pharmacien",
    address: "81 Rue Victor Schoelcher, 97230 Sainte-Marie",
    city: "Sainte-Marie",
    postcode: "97230",
    zone: "nord-atlantique",
    phone: "05 96 69 30 37",
    phoneRaw: "0596693037",
    lat: 14.78466,
    lng: -60.993534,
    category: "pharmacie",
    source: OFFICIAL_SOURCES.ameliLabel,
    sourceUrl: OFFICIAL_SOURCES.ameliUrl,
    sourceUpdatedAt: OFFICIAL_SOURCES.ameliUpdatedAt,
    featured: true,
    verified: true,
    badge: "Adresse + GPS vérifiés",
  },
  {
    id: "stm-tombolo",
    name: "Pharmacie du Tombolo",
    specialty: "Pharmacien",
    address: "25 Rue Victor Schoelcher, Bourg, 97230 Sainte-Marie",
    city: "Sainte-Marie",
    postcode: "97230",
    zone: "nord-atlantique",
    phone: "05 96 69 30 03",
    phoneRaw: "0596693003",
    lat: 14.784929,
    lng: -60.994307,
    category: "pharmacie",
    source: OFFICIAL_SOURCES.ameliLabel,
    sourceUrl: OFFICIAL_SOURCES.ameliUrl,
    sourceUpdatedAt: OFFICIAL_SOURCES.ameliUpdatedAt,
    featured: true,
    verified: true,
    badge: "Adresse + GPS vérifiés",
  },
  {
    id: "stm-mauclere",
    name: "Pharmacie Mauclere-Bancons",
    specialty: "Pharmacien",
    address: "63B Rue de la Liberté, Morne des Esses, 97230 Sainte-Marie",
    city: "Sainte-Marie",
    postcode: "97230",
    zone: "nord-atlantique",
    phone: "06 96 03 38 32",
    phoneRaw: "0696033832",
    category: "pharmacie",
    source: OFFICIAL_SOURCES.ameliLabel,
    sourceUrl: OFFICIAL_SOURCES.ameliUrl,
    sourceUpdatedAt: OFFICIAL_SOURCES.ameliUpdatedAt,
    featured: true,
    verified: true,
    badge: "Nom officiel trouvé",
    note:
      "La base officielle remonte “SELAS Pharmacie Mauclere-Bancons”, ce qui correspond vraisemblablement à la pharmacie citée comme “Mauger”.",
  },
  {
    id: "stm-atoumo",
    name: "Pharmacie Atoumo",
    specialty: "Pharmacien",
    address: "Centre commercial Lassalle, 97230 Sainte-Marie",
    city: "Sainte-Marie",
    postcode: "97230",
    zone: "nord-atlantique",
    phone: "05 96 69 31 49",
    phoneRaw: "0596693149",
    category: "pharmacie",
    source: OFFICIAL_SOURCES.ameliLabel,
    sourceUrl: OFFICIAL_SOURCES.ameliUrl,
    sourceUpdatedAt: OFFICIAL_SOURCES.ameliUpdatedAt,
    featured: true,
    verified: true,
    badge: "Vérifiée",
  },
  {
    id: "stm-centrale",
    name: "Pharmacie Centrale",
    specialty: "Pharmacien",
    address: "Rue de l'Abattoir, 97230 Sainte-Marie",
    city: "Sainte-Marie",
    postcode: "97230",
    zone: "nord-atlantique",
    phone: "05 96 69 30 57",
    phoneRaw: "0596693057",
    category: "pharmacie",
    source: OFFICIAL_SOURCES.ameliLabel,
    sourceUrl: OFFICIAL_SOURCES.ameliUrl,
    sourceUpdatedAt: OFFICIAL_SOURCES.ameliUpdatedAt,
    featured: true,
    verified: true,
    badge: "Vérifiée",
  },
  {
    id: "stm-union",
    name: "Pharmacie La Plaine de l'Union",
    specialty: "Pharmacien",
    address:
      "Centre commercial Rubinel, Quartier Union, 97230 Sainte-Marie",
    city: "Sainte-Marie",
    postcode: "97230",
    zone: "nord-atlantique",
    phone: "06 96 37 75 51",
    phoneRaw: "0696377551",
    category: "pharmacie",
    source: OFFICIAL_SOURCES.ameliLabel,
    sourceUrl: OFFICIAL_SOURCES.ameliUrl,
    sourceUpdatedAt: OFFICIAL_SOURCES.ameliUpdatedAt,
    featured: true,
    verified: true,
    badge: "Vérifiée",
  },
];

const FEATURED_PHARMACY_HINTS = [
  { fragments: ["ocean", "sainte marie"], seedId: "stm-ocean" },
  { fragments: ["tombolo", "sainte marie"], seedId: "stm-tombolo" },
  { fragments: ["mauclere", "sainte marie"], seedId: "stm-mauclere" },
  { fragments: ["atoumo", "sainte marie"], seedId: "stm-atoumo" },
  { fragments: ["centrale", "sainte marie"], seedId: "stm-centrale" },
  { fragments: ["union", "sainte marie"], seedId: "stm-union" },
];

const HOSPITALS = [
  {
    id: "chu-martinique",
    name: "CHU Martinique - La Meynard",
    specialty: "Urgences 24h/24",
    address: "CS 90632, 97261 Fort-de-France Cedex",
    city: "Fort-de-France",
    postcode: "97261",
    zone: "centre",
    phone: "05 96 55 20 00",
    phoneRaw: "0596552000",
    lat: 14.6182,
    lng: -61.0591,
    category: "hopital",
    source: "CHU Martinique",
    sourceUrl: OFFICIAL_SOURCES.chuUrl,
    sourceUpdatedAt: "2026-03-26",
    featured: true,
    verified: true,
    badge: "Urgences confirmées",
    note: "Source officielle CHU: standard + urgences adultes et pédiatriques.",
  },
  {
    id: "sos-medecins",
    name: "SOS Médecins Martinique",
    specialty: "Visites et soins non programmés 24h/24",
    address: "ZAC Étang Z'Abricot, Immeuble Opale, Fort-de-France",
    city: "Fort-de-France",
    postcode: "97200",
    zone: "centre",
    phone: "05 96 63 33 33",
    phoneRaw: "0596633333",
    category: "hopital",
    source: "SOS Médecins Martinique",
    sourceUrl: "https://www.sosmedecinsmartinique.fr",
    sourceUpdatedAt: "2026-03-26",
    featured: true,
    verified: true,
    badge: "24h/24",
  },
  {
    id: "ch-du-marin",
    name: "Centre Hospitalier du Marin",
    specialty: "Sud Martinique",
    address: "37 Boulevard Allègre, 97290 Le Marin",
    city: "Le Marin",
    postcode: "97290",
    zone: "sud",
    phone: "05 96 74 92 05",
    phoneRaw: "0596749205",
    category: "hopital",
    source: "Livret d'accueil du Centre Hospitalier du Marin",
    sourceUrl: "https://www.calameo.com/books/004642672020d5081b7ca",
    sourceUpdatedAt: "2026-03-26",
    featured: true,
    verified: true,
    badge: "À joindre en urgence locale",
  },
  {
    id: "ch-nord-caraibe",
    name: "Centre Hospitalier Nord Caraïbe",
    specialty: "Nord Caraïbe",
    address: "Quartier Lajus, 97221 Le Carbet",
    city: "Le Carbet",
    postcode: "97221",
    zone: "nord-caraibe",
    phone: "05 96 78 02 20",
    phoneRaw: "0596780220",
    category: "hopital",
    source: "Référence publique établissement",
    sourceUrl:
      "https://www.boamp.fr/telechargements/PDF/2021/BOAMP-J-IC-AA_2021_017002/21-6308.pdf",
    sourceUpdatedAt: "2026-03-26",
    featured: true,
    verified: true,
    badge: "Référence publique trouvée",
  },
];

const EMERGENCY_CONTACTS = [
  {
    label: "SAMU",
    phone: "15",
    description: "Urgence vitale",
    color: "#d84a45",
    action: "Appeler",
  },
  {
    label: "Pompiers",
    phone: "18",
    description: "Secours / incendie",
    color: "#ff8456",
    action: "Appeler",
  },
  {
    label: "Urgence UE",
    phone: "112",
    description: "Numéro européen",
    color: "#7b61ff",
    action: "Appeler",
  },
  {
    label: "Pharmacies de garde",
    phone: "3237",
    description: "Source officielle RésoGardes",
    color: "#007c78",
    action: "Vérifier",
    href: OFFICIAL_SOURCES.gardeUrl,
  },
];

const APPOINTMENT_LINKS = [
  {
    label: "Annuaire Ameli",
    href: "https://annuairesante.ameli.fr",
    tone: "primary",
  },
  {
    label: "ClikOdoc",
    href: "https://www.clikodoc.com/",
    tone: "secondary",
  },
  {
    label: "Doctolib",
    href: "https://www.doctolib.fr/",
    tone: "secondary",
  },
];

const ICONS = {
  search: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 16.7v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.2 19.2 0 0 1-5.9-5.9A19.7 19.7 0 0 1 1.2 4.1 2 2 0 0 1 3.2 2h3a2 2 0 0 1 2 1.7l.4 2.4a2 2 0 0 1-.5 1.8l-1.7 1.7a16 16 0 0 0 6 6l1.7-1.7a2 2 0 0 1 1.8-.5l2.4.4a2 2 0 0 1 1.7 2Z" />
    </svg>
  ),
  nav: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 11 22 2 13 21l-2-8-8-2Z" />
    </svg>
  ),
  ext: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 4h6v6" />
      <path d="M10 14 20 4" />
      <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
    </svg>
  ),
  install: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v11" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 21h14" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 15.5-6.4L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.4L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.3 17.7-1.4 1.4" />
      <path d="m19.1 4.9-1.4 1.4" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  ),
};

function MediPeyiLogo({ size = 56 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        position: "relative",
        flex: "0 0 auto",
        animation: "mp-float 4.8s ease-in-out infinite",
        filter: "drop-shadow(0 18px 28px rgba(108, 126, 22, 0.22))",
      }}
    >
      <svg
        viewBox="0 0 120 120"
        style={{ width: "100%", height: "100%", display: "block" }}
        role="img"
        aria-label="MediPeyi"
      >
        <defs>
          <linearGradient id="mpLogoBg" x1="18" y1="16" x2="102" y2="106" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff4a8" />
            <stop offset="0.55" stopColor="#f4d84d" />
            <stop offset="1" stopColor="#e2be29" />
          </linearGradient>
          <filter id="mpLogoShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="14" stdDeviation="10" floodColor="#7a8420" floodOpacity="0.20" />
          </filter>
        </defs>
        <ellipse cx="60" cy="103" rx="30" ry="10" fill="#d8d974" opacity="0.34" />
        <g filter="url(#mpLogoShadow)">
          <rect x="10" y="10" width="100" height="100" rx="28" fill="url(#mpLogoBg)" />
          <rect x="10" y="10" width="100" height="100" rx="28" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
          <path
            d="M42 28v18c0 11 8 19 18 19s18-8 18-19V28"
            fill="none"
            stroke="#13824d"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="42" cy="24" r="5" fill="#13824d" />
          <circle cx="78" cy="24" r="5" fill="#13824d" />
          <path
            d="M60 65v13c0 6 4 10 10 10h4"
            fill="none"
            stroke="#13824d"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="79" cy="88" r="9" fill="none" stroke="#13824d" strokeWidth="7" />
        </g>
      </svg>
    </div>
  );
}

function normalizeText(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function toTitleCase(value = "") {
  return value
    .toString()
    .toLowerCase()
    .replace(/(^|[\\s'/-])([a-zà-ÿ])/g, (_, prefix, letter) =>
      `${prefix}${letter.toUpperCase()}`
    );
}

function formatPhone(phone = "") {
  const digits = phone.replace(/\\D/g, "");
  if (digits.length === 10) {
    return digits.replace(/(\\d{2})(?=\\d)/g, "$1 ").trim();
  }
  return phone || "";
}

function joinParts(parts) {
  return parts
    .map((part) => (part || "").trim())
    .filter(Boolean)
    .join(", ");
}

function canonicalCommune(rawCity = "", postcode = "") {
  const compact = normalizeText(rawCity).replace(/ /g, "").toUpperCase();
  const spaced = normalizeText(rawCity).toUpperCase();
  const alias = CITY_ALIAS_TO_COMMUNE[compact] || CITY_ALIAS_TO_COMMUNE[spaced];
  if (alias) return alias;

  const postcodeMatches = COMMUNES_BY_POSTCODE[postcode] || [];
  if (postcodeMatches.length === 1) return postcodeMatches[0];

  if (postcodeMatches.length > 1 && rawCity) {
    const matched = postcodeMatches.find((label) => {
      const normalizedLabel = normalizeText(label);
      return (
        normalizedLabel === normalizeText(rawCity) ||
        normalizedLabel.includes(normalizeText(rawCity)) ||
        normalizeText(rawCity).includes(normalizedLabel)
      );
    });
    if (matched) return matched;
  }

  return toTitleCase(rawCity || postcodeMatches[0] || "");
}

function buildAddress(row) {
  const city = canonicalCommune(
    row.coordonnees_ville || "",
    row.coordonnees_code_postal || ""
  );
  return joinParts([
    row.coordonnees_voie ? toTitleCase(row.coordonnees_voie) : "",
    row.coordonnees_complement ? toTitleCase(row.coordonnees_complement) : "",
    row.coordonnees_lieu_dit ? toTitleCase(row.coordonnees_lieu_dit) : "",
    row.coordonnees_code_postal,
    city,
  ]);
}

function zoneFromCity(city = "") {
  const commune = canonicalCommune(city);
  const indexed = COMMUNE_INDEX[normalizeText(commune)];
  if (indexed?.zone) return indexed.zone;
  const key = normalizeText(city).replace(/ /g, "").toUpperCase();
  const direct = CITY_ZONE_MAP[key];
  if (direct) return direct;
  const spaced = normalizeText(city).toUpperCase();
  return CITY_ZONE_MAP[spaced] || "all";
}

function distanceKm(a, b) {
  if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return null;
  const rad = (value) => (value * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) *
      Math.cos(rad(b.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function buildTabularUrl(resourceId, params = {}) {
  const search = new URLSearchParams(params);
  return `https://tabular-api.data.gouv.fr/api/resources/${resourceId}/data/?${search.toString()}`;
}

function seedById(seedId) {
  return VERIFIED_STE_MARIE_PHARMACIES.find((seed) => seed.id === seedId);
}

function enrichFeaturedProvider(provider) {
  if (provider.category !== "pharmacie") return provider;
  const haystack = normalizeText(
    `${provider.name} ${provider.address} ${provider.city}`
  );
  const hint = FEATURED_PHARMACY_HINTS.find((item) =>
    item.fragments.every((fragment) => haystack.includes(fragment))
  );
  if (!hint) return provider;
  const seed = seedById(hint.seedId);
  return {
    ...provider,
    ...seed,
    id: provider.id,
    featured: true,
    verified: true,
    source: OFFICIAL_SOURCES.ameliLabel,
    sourceUrl: OFFICIAL_SOURCES.ameliUrl,
    sourceUpdatedAt: OFFICIAL_SOURCES.ameliUpdatedAt,
  };
}

function dedupeProviders(records) {
  const seen = new Map();
  records.forEach((record) => {
    const key = normalizeText(`${record.name}|${record.address}|${record.category}`);
    if (!seen.has(key)) {
      seen.set(key, record);
    }
  });
  return [...seen.values()];
}

function mapPsRecord(row, categoryId) {
  const city = canonicalCommune(
    row.coordonnees_ville || "",
    row.coordonnees_code_postal || ""
  );
  const businessName =
    row.ps_activite_raison_sociale ||
    joinParts([
      row.ps_activite_civilite ? `${row.ps_activite_civilite}.` : "",
      row.ps_activite_prenom,
      row.ps_activite_nom,
    ]);
  const label =
    categoryId === "medecin" && row.specialite_libelle
      ? row.specialite_libelle
      : row.specialite_libelle || CATEGORY_CONFIG[categoryId]?.specialtyLabel;

  const record = {
    id: `${categoryId}-${row.__id}`,
    name: toTitleCase(businessName || "Professionnel de santé"),
    specialty: label,
    address: buildAddress(row),
    city,
    postcode: row.coordonnees_code_postal || "",
    zone: zoneFromCity(city),
    phone: formatPhone(row.coordonnees_num_tel || ""),
    phoneRaw: row.coordonnees_num_tel || "",
    category: categoryId,
    acceptsVitale: Boolean(row.ps_activite_carte_vitale),
    apcv: Boolean(row.ps_activite_apcv),
    sector: row.secteur_conventionnel_libelle || "",
    source: OFFICIAL_SOURCES.ameliLabel,
    sourceUrl: OFFICIAL_SOURCES.ameliUrl,
    sourceUpdatedAt: OFFICIAL_SOURCES.ameliUpdatedAt,
    lat: null,
    lng: null,
    featured: false,
    verified: true,
    badge: row.ps_activite_apcv ? "Carte Vitale + apCV" : "Source officielle",
  };
  return enrichFeaturedProvider(record);
}

function mapCdsRecord(row) {
  const city = canonicalCommune(
    row.coordonnees_ville || "",
    row.coordonnees_code_postal || ""
  );
  return {
    id: `centre-sante-${row.__id}`,
    name: toTitleCase(row.etab_raison_sociale || "Centre de santé"),
    specialty: row.specialite_libelle || "Centre de santé",
    address: buildAddress(row),
    city,
    postcode: row.coordonnees_code_postal || "",
    zone: zoneFromCity(city),
    phone: formatPhone(row.coordonnees_num_tel || ""),
    phoneRaw: row.coordonnees_num_tel || "",
    category: "centre-sante",
    acceptsVitale: Boolean(row.etab_carte_vitale),
    apcv: Boolean(row.etab_apcv),
    sector: "",
    source: OFFICIAL_SOURCES.ameliLabel,
    sourceUrl: OFFICIAL_SOURCES.ameliUrl,
    sourceUpdatedAt: OFFICIAL_SOURCES.ameliUpdatedAt,
    lat: null,
    lng: null,
    featured: false,
    verified: true,
    badge: "Centre officiel",
  };
}

async function fetchCategoryRecords(categoryId, signal) {
  if (categoryId === "hopital") return HOSPITALS;
  const config = CATEGORY_CONFIG[categoryId];
  if (!config) return [];

  const resourceId = config.source === "cds" ? CDS_RESOURCE_ID : PS_RESOURCE_ID;
  const pageSize = 200;
  const rows = [];
  let page = 1;
  let total = 1;

  while (rows.length < total) {
    const url = buildTabularUrl(resourceId, {
      ...MARTINIQUE_FILTERS,
      ...config.params,
      page: String(page),
      page_size: String(pageSize),
    });
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error("Impossible de charger l'annuaire officiel.");
    const payload = await response.json();
    total = payload.meta?.total || payload.data?.length || 0;
    rows.push(...(payload.data || []));
    if (!payload.links?.next || !payload.data?.length) break;
    page += 1;
  }

  const mapper = config.source === "cds" ? mapCdsRecord : mapPsRecord;
  return dedupeProviders(rows.map((row) => mapper(row, categoryId)));
}

async function fetchTotals(signal) {
  const entries = await Promise.all(
    CATEGORIES.map(async (category) => {
      if (category.id === "hopital") {
        return [category.id, HOSPITALS.length];
      }
      const config = CATEGORY_CONFIG[category.id];
      const resourceId =
        config.source === "cds" ? CDS_RESOURCE_ID : PS_RESOURCE_ID;
      const url = buildTabularUrl(resourceId, {
        ...MARTINIQUE_FILTERS,
        ...config.params,
        page_size: "1",
      });
      const response = await fetch(url, { signal });
      if (!response.ok) return [category.id, null];
      const payload = await response.json();
      return [category.id, payload.meta?.total ?? null];
    })
  );

  const response = await fetch(
    buildTabularUrl(PS_RESOURCE_ID, {
      ...MARTINIQUE_FILTERS,
      page_size: "1",
    }),
    { signal }
  );
  const payload = response.ok ? await response.json() : { meta: { total: null } };

  return {
    all: payload.meta?.total ?? null,
    byCategory: Object.fromEntries(entries),
  };
}

function readStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function useThemeState() {
  const [darkMode, setDarkMode] = useState(() =>
    readStorage("medipeyi-theme", false)
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("medipeyi-theme", JSON.stringify(darkMode));
    }
  }, [darkMode]);
  return [darkMode, setDarkMode];
}

function useGeocodeCache() {
  const [cache, setCache] = useState(() =>
    readStorage("medipeyi-geocodes", {})
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("medipeyi-geocodes", JSON.stringify(cache));
    }
  }, [cache]);
  return [cache, setCache];
}

function getProviderGeo(provider, geocodeCache) {
  if (provider?.lat && provider?.lng) return { lat: provider.lat, lng: provider.lng };
  const key = normalizeText(`${provider?.name}|${provider?.address}`);
  return geocodeCache[key] || null;
}

function installSummary(state, hasPrompt) {
  if (state.standalone) return "L'app est déjà installée sur ce terminal.";
  if (hasPrompt) return "Android détecté: installation directe disponible.";
  if (state.ios) {
    return "iPhone / iPad détecté: utilisez Partager > Sur l'écran d'accueil.";
  }
  if (state.mobile) {
    return "Ouvrez cette page dans votre navigateur mobile pour l'ajouter à l'écran d'accueil.";
  }
  return "Depuis Chrome, Edge ou Safari mobile, l'app peut être ajoutée à l'écran d'accueil.";
}

export default function MediPeyi() {
  const [darkMode, setDarkMode] = useThemeState();
  const [tab, setTab] = useState("home");
  const [category, setCategory] = useState("pharmacie");
  const [zone, setZone] = useState("all");
  const [commune, setCommune] = useState("all");
  const [query, setQuery] = useState("");
  const [priorityMode, setPriorityMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [directoryByCategory, setDirectoryByCategory] = useState({ hopital: HOSPITALS });
  const [loadingByCategory, setLoadingByCategory] = useState({});
  const [loadedVersionByCategory, setLoadedVersionByCategory] = useState({ hopital: 0 });
  const [totals, setTotals] = useState({ all: null, byCategory: { hopital: HOSPITALS.length } });
  const [statsVersion, setStatsVersion] = useState(0);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [syncAt, setSyncAt] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [geocodeCache, setGeocodeCache] = useGeocodeCache();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installState, setInstallState] = useState({ mobile: false, ios: false, standalone: false });

  const theme = darkMode ? THEMES.dark : THEMES.light;

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    const standalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true;
    setInstallState({ mobile, ios, standalone });

    const handleInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleInstall);
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setLocation({ lat: 14.6037, lng: -61.0696 }),
      { timeout: 9000 }
    );
  }, []);

  useEffect(() => {
    if (commune === "all" || zone === "all") return;
    if (zoneFromCity(commune) !== zone) {
      setCommune("all");
    }
  }, [commune, zone]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const load = async () => {
      if (category === "hopital") return;
      const alreadyLoaded = loadedVersionByCategory[category] === refreshVersion;
      if (directoryByCategory[category] && alreadyLoaded) return;

      setLoadingByCategory((prev) => ({ ...prev, [category]: true }));
      setError("");

      try {
        const records = await fetchCategoryRecords(category, controller.signal);
        if (!active) return;
        setDirectoryByCategory((prev) => ({ ...prev, [category]: records }));
        setLoadedVersionByCategory((prev) => ({ ...prev, [category]: refreshVersion }));
        setSyncAt(new Date());
      } catch (err) {
        if (!active || err.name === "AbortError") return;
        setError(
          "Le flux officiel n'a pas pu être synchronisé. Les pharmacies vérifiées de Sainte-Marie restent visibles en secours."
        );
      } finally {
        if (active) {
          setLoadingByCategory((prev) => ({ ...prev, [category]: false }));
        }
      }
    };

    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [category, directoryByCategory, loadedVersionByCategory, refreshVersion]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadTotalsSnapshot = async () => {
      try {
        const snapshot = await fetchTotals(controller.signal);
        if (!active) return;
        setTotals(snapshot);
      } catch (err) {
        if (!active || err.name === "AbortError") return;
      }
    };

    loadTotalsSnapshot();
    return () => {
      active = false;
      controller.abort();
    };
  }, [statsVersion]);

  useEffect(() => {
    if (!selected) return undefined;
    const key = normalizeText(`${selected.name}|${selected.address}`);
    if ((selected.lat && selected.lng) || geocodeCache[key]) return undefined;

    const controller = new AbortController();
    const lookup = async () => {
      try {
        const q = encodeURIComponent(`${selected.address} ${selected.city || ""} Martinique`);
        const response = await fetch(`${OFFICIAL_SOURCES.addressApiUrl}/search/?q=${q}&limit=1`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const payload = await response.json();
        const feature = payload.features?.[0];
        if (!feature) return;
        setGeocodeCache((prev) => ({
          ...prev,
          [key]: {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            label: feature.properties.label,
            score: feature.properties.score,
          },
        }));
      } catch (err) {
        if (err.name !== "AbortError") return;
      }
    };

    lookup();
    return () => controller.abort();
  }, [geocodeCache, selected, setGeocodeCache]);

  const featuredPharmacies = VERIFIED_STE_MARIE_PHARMACIES.map((provider) => {
    const geo = getProviderGeo(provider, geocodeCache);
    return geo ? { ...provider, lat: geo.lat, lng: geo.lng } : provider;
  });

  const pharmacyRecords = useMemo(() => {
    if (directoryByCategory.pharmacie?.length) return directoryByCategory.pharmacie;
    return featuredPharmacies;
  }, [directoryByCategory.pharmacie, featuredPharmacies]);

  const activeRecords = useMemo(() => {
    if (category === "hopital") return HOSPITALS;
    if (directoryByCategory[category]?.length) return directoryByCategory[category];
    if (category === "pharmacie") return featuredPharmacies;
    return [];
  }, [category, directoryByCategory, featuredPharmacies]);

  const activeCountByCommune = useMemo(() => {
    return activeRecords.reduce((acc, record) => {
      if (!record.city) return acc;
      acc[record.city] = (acc[record.city] || 0) + 1;
      return acc;
    }, {});
  }, [activeRecords]);

  const communeCoverage = useMemo(() => {
    const countByCommune = pharmacyRecords.reduce((acc, record) => {
      if (!record.city) return acc;
      acc[record.city] = (acc[record.city] || 0) + 1;
      return acc;
    }, {});

    return MARTINIQUE_COMMUNES.map((communeItem) => ({
      ...communeItem,
      count: countByCommune[communeItem.label] || 0,
    })).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label, "fr");
    });
  }, [pharmacyRecords]);

  const coveredCommunes = communeCoverage.filter((item) => item.count > 0).length;

  const communeOptions = useMemo(() => {
    return MARTINIQUE_COMMUNES.filter(
      (item) => zone === "all" || item.zone === zone
    )
      .map((item) => ({
        ...item,
        total: activeCountByCommune[item.label] || 0,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }, [activeCountByCommune, zone]);

  const activeCoveredCommunes = communeOptions.filter((item) => item.total > 0).length;

  const applyCommune = (nextCommune) => {
    setCommune(nextCommune);
    if (nextCommune !== "all") {
      setZone(zoneFromCity(nextCommune));
    }
  };

  const filteredRecords = useMemo(() => {
    const needle = normalizeText(query);
    return [...activeRecords]
      .filter((record) => zone === "all" || record.zone === zone)
      .filter(
        (record) =>
          commune === "all" || normalizeText(record.city) === normalizeText(commune)
      )
      .filter((record) => {
        if (!needle) return true;
        return normalizeText(
          `${record.name} ${record.specialty} ${record.address} ${record.city}`
        ).includes(needle);
      })
      .sort((a, b) => {
        if (priorityMode) {
          const aScore =
            (a.featured ? 30 : 0) + (a.category === "hopital" ? 20 : 0) + (a.phoneRaw ? 5 : 0);
          const bScore =
            (b.featured ? 30 : 0) + (b.category === "hopital" ? 20 : 0) + (b.phoneRaw ? 5 : 0);
          if (aScore !== bScore) return bScore - aScore;
        }

        if (a.featured !== b.featured) return a.featured ? -1 : 1;

        const aGeo = getProviderGeo(a, geocodeCache);
        const bGeo = getProviderGeo(b, geocodeCache);
        const aDistance = distanceKm(location, aGeo);
        const bDistance = distanceKm(location, bGeo);
        if (aDistance !== null && bDistance !== null && aDistance !== bDistance) {
          return aDistance - bDistance;
        }
        return a.name.localeCompare(b.name, "fr");
      });
  }, [activeRecords, commune, geocodeCache, location, priorityMode, query, zone]);

  const spotlightRecords = useMemo(
    () => filteredRecords.filter((record) => record.featured).slice(0, category === "pharmacie" ? 6 : 4),
    [category, filteredRecords]
  );

  const visibleCount =
    category === "pharmacie" && !directoryByCategory.pharmacie?.length
      ? `${featuredPharmacies.length} officines mises en avant`
      : `${filteredRecords.length} résultat${filteredRecords.length > 1 ? "s" : ""}`;

  const sourceDate = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
    new Date(OFFICIAL_SOURCES.ameliUpdatedAt)
  );
  const syncDate = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(syncAt);

  const openExternal = (href) => {
    if (typeof window !== "undefined") {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const callNumber = (phoneRaw, fallbackHref) => {
    if (!phoneRaw && fallbackHref) {
      openExternal(fallbackHref);
      return;
    }
    if (typeof window !== "undefined" && phoneRaw) {
      window.location.href = `tel:${phoneRaw.replace(/\s/g, "")}`;
    }
  };

  const openMaps = (provider) => {
    const geo = getProviderGeo(provider, geocodeCache);
    if (geo) {
      openExternal(`https://www.google.com/maps/dir/?api=1&destination=${geo.lat},${geo.lng}`);
      return;
    }
    const queryText = encodeURIComponent(
      `${provider.name}, ${provider.address}, ${provider.city}, Martinique`
    );
    openExternal(`https://www.google.com/maps/search/?api=1&query=${queryText}`);
  };

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    }
  };

  const forceRefresh = () => {
    setRefreshing(true);
    setRefreshVersion((prev) => prev + 1);
    setStatsVersion((prev) => prev + 1);
    window.setTimeout(() => setRefreshing(false), 1200);
  };

  const categoryCards = CATEGORIES.map((item) => ({
    ...item,
    total:
      item.id === "hopital" ? HOSPITALS.length : totals.byCategory?.[item.id] ?? "…",
  }));

  const topStats = [
    {
      label: "Références officielles",
      value: totals.all ?? "…",
      accent: "var(--accent)",
      sub: "professionnels et structures",
    },
    {
      label: "Pharmacies en Martinique",
      value: totals.byCategory?.pharmacie ?? "…",
      accent: "var(--accent-2)",
      sub: "officines issues d'Ameli",
    },
    {
      label: "Communes couvertes",
      value: `${coveredCommunes}/${MARTINIQUE_COMMUNES.length}`,
      accent: "var(--accent-3)",
      sub: "pharmacies regroupées par commune",
    },
  ];

  const sourcesBlock = [
    {
      title: "Annuaire santé Ameli",
      detail: `Mise à jour officielle constatée le ${sourceDate}`,
      href: OFFICIAL_SOURCES.ameliUrl,
    },
    {
      title: "API tabulaire data.gouv.fr",
      detail: "Filtrage direct de la Martinique sans liste figée en dur",
      href: OFFICIAL_SOURCES.tabularApiUrl,
    },
    {
      title: "API Adresse",
      detail: "Enrichissement GPS à la demande pour l'itinéraire",
      href: OFFICIAL_SOURCES.addressApiUrl,
    },
    {
      title: "URPS Pharmaciens Martinique",
      detail: "Annuaire officinal complémentaire pour recouper les officines",
      href: OFFICIAL_SOURCES.urpsPharmaciesUrl,
    },
    {
      title: "3237 / RésoGardes",
      detail: "Référence officielle pour les pharmacies de garde",
      href: OFFICIAL_SOURCES.gardeUrl,
    },
    {
      title: "ARS Martinique",
      detail: "Source institutionnelle et organisation des soins sur le territoire",
      href: OFFICIAL_SOURCES.arsUrl,
    },
  ];

  const selectedGeo = selected ? getProviderGeo(selected, geocodeCache) : null;
  const selectedDistance = selectedGeo ? distanceKm(location, selectedGeo) : null;
  const activeCategoryLabel =
    CATEGORIES.find((item) => item.id === category)?.label || "Annuaire";
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box}html,body,#root{margin:0;background:var(--bg)}body{font-family:'Outfit',sans-serif;color:var(--ink)}
    a{color:inherit}button,input,select{font:inherit}
    .mp-root{min-height:100vh;background:
      radial-gradient(circle at top left, rgba(240,200,75,.26), transparent 32%),
      radial-gradient(circle at top right, rgba(132,191,75,.22), transparent 28%),
      radial-gradient(circle at bottom center, rgba(255,234,145,.22), transparent 24%),
      linear-gradient(180deg,var(--bg-alt) 0%,var(--bg) 100%);
      color:var(--ink)}
    .mp-shell{width:min(1240px,calc(100vw - 24px));margin:0 auto;padding:18px 0 32px}
    .mp-hero{position:relative;overflow:hidden;border-radius:34px;background:var(--hero);box-shadow:var(--shadow);color:#fff;padding:22px}
    .mp-hero::before{content:'';position:absolute;inset:0;background:var(--hero-glow);pointer-events:none}
    .mp-hero::after{content:'';position:absolute;right:-60px;top:-90px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle, rgba(255,247,191,.30) 0%, rgba(255,247,191,0) 68%);pointer-events:none}
    .mp-hero-grid{position:relative;z-index:1;display:grid;gap:18px}
    .mp-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px}
    .mp-toolbar-actions,.mp-actions,.mp-pill-row,.mp-record-actions,.mp-footer-links,.mp-source-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .mp-hero-pill{display:inline-flex;align-items:center;padding:9px 14px;border-radius:999px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.18);font-size:.9rem;font-weight:700;backdrop-filter:blur(14px)}
    .mp-brand{display:flex;align-items:center;gap:16px}
    .mp-brand-copy h1{margin:0;font-size:clamp(2.3rem,6vw,4.6rem);line-height:.93;letter-spacing:-.05em;font-family:'Fraunces',serif}
    .mp-brand-copy p{margin:10px 0 0;max-width:620px;color:rgba(255,255,255,.84);font-size:1.02rem;line-height:1.55}
    .mp-kicker{display:inline-flex;align-items:center;gap:8px;color:var(--accent);font-size:.82rem;font-weight:800;text-transform:uppercase;letter-spacing:.11em;margin-bottom:10px}
    .mp-kicker-light{color:rgba(255,255,255,.78)}
    .mp-glass-btn,.mp-ghost-btn,.mp-solid-btn,.mp-icon-btn,.mp-pill,.mp-category-card,.mp-quick-card,.mp-commune-pill,.mp-emergency-item{transition:transform .14s ease,opacity .14s ease,border-color .14s ease,background .14s ease,box-shadow .14s ease}
    .mp-glass-btn:hover,.mp-ghost-btn:hover,.mp-solid-btn:hover,.mp-icon-btn:hover,.mp-pill:hover,.mp-category-card:hover,.mp-quick-card:hover,.mp-commune-pill:hover,.mp-emergency-item:hover{transform:translateY(-1px)}
    .mp-icon-btn{width:46px;height:46px;border-radius:16px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.18);color:#fff;display:inline-flex;align-items:center;justify-content:center}
    .mp-glass-btn{padding:11px 16px;border-radius:18px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.18);color:#fff;display:inline-flex;align-items:center;gap:10px;font-weight:700}
    .mp-solid-btn{padding:12px 16px;border-radius:18px;background:var(--accent);color:#fff;border:none;display:inline-flex;align-items:center;gap:10px;font-weight:800;cursor:pointer}
    .mp-ghost-btn{padding:12px 16px;border-radius:18px;background:transparent;border:1px solid var(--border);color:var(--ink);display:inline-flex;align-items:center;gap:10px;font-weight:800;cursor:pointer}
    .mp-icon-btn svg,.mp-solid-btn svg,.mp-glass-btn svg,.mp-ghost-btn svg,.mp-record-actions svg,.mp-meta svg,.mp-link svg,.mp-quick-card svg,.mp-emergency-item svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .mp-search{position:relative;margin-top:18px}
    .mp-search input{width:100%;border-radius:24px;border:1px solid rgba(255,255,255,.22);padding:18px 18px 18px 54px;background:rgba(255,255,255,.14);color:#fff;outline:none;backdrop-filter:blur(16px);font-size:1rem}
    .mp-search input::placeholder{color:rgba(255,255,255,.74)}
    .mp-search span{position:absolute;left:18px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.74);display:inline-flex}
    .mp-quick-grid{display:grid;gap:12px;margin-top:18px}
    .mp-quick-card{padding:16px 18px;border-radius:24px;border:1px solid rgba(255,255,255,.18);background:linear-gradient(150deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.08) 100%);color:#fff;text-align:left;display:grid;gap:8px;cursor:pointer;backdrop-filter:blur(18px);box-shadow:0 12px 30px rgba(10,36,56,.10)}
    .mp-quick-card strong{display:flex;align-items:center;gap:10px;font-size:1rem}
    .mp-quick-card span{color:rgba(255,255,255,.78);font-size:.94rem;line-height:1.45}
    .mp-hero-side{display:grid;gap:14px}
    .mp-hero-card{border-radius:28px;background:linear-gradient(160deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.08) 100%);border:1px solid rgba(255,255,255,.16);padding:18px;backdrop-filter:blur(18px)}
    .mp-hero-card h2{margin:0 0 8px;font-family:'Fraunces',serif;font-size:clamp(1.4rem,3vw,2rem);line-height:1.02}
    .mp-hero-card p{margin:0;color:rgba(255,255,255,.84);line-height:1.55}
    .mp-soft-note{margin-top:12px;color:rgba(255,255,255,.74);font-size:.92rem}
    .mp-main-grid{display:grid;gap:18px;margin-top:18px}
    .mp-main-col,.mp-side-col{display:grid;gap:18px;align-content:start}
    .mp-panel{border-radius:28px;background:var(--panel);border:1px solid var(--border);box-shadow:var(--soft-shadow);backdrop-filter:blur(22px);padding:20px}
    .mp-panel-strong{background:var(--panel-strong)}
    .mp-panel h2,.mp-panel h3{margin:0;letter-spacing:-.03em}
    .mp-panel p{margin:0;color:var(--sub);line-height:1.55}
    .mp-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
    .mp-toolbar-note{display:flex;align-items:center;gap:10px;flex-wrap:wrap;color:var(--sub);font-size:.95rem}
    .mp-status-dot{width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 6px rgba(0,124,120,.10)}
    .mp-status-dot.is-refreshing{background:var(--accent-2);animation:mp-pulse 1.2s infinite ease}
    .mp-sub{color:var(--sub);font-size:.95rem}
    .mp-category-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .mp-category-card{padding:16px;border-radius:22px;border:1px solid var(--border);background:var(--panel-strong);cursor:pointer;box-shadow:var(--soft-shadow);display:grid;gap:10px}
    .mp-category-card.is-active{outline:2px solid var(--accent);outline-offset:0}
    .mp-category-top{display:flex;justify-content:space-between;align-items:center;gap:12px}
    .mp-category-icon{width:44px;height:44px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-size:1.05rem;font-weight:800;color:#fff}
    .mp-pill-row{margin-top:14px}
    .mp-pill{padding:10px 14px;border-radius:999px;border:1px solid var(--border);background:transparent;color:var(--soft);font-weight:700;cursor:pointer}
    .mp-pill.is-active{background:var(--accent-soft);border-color:transparent;color:var(--accent)}
    .mp-pill.is-danger{background:var(--danger-soft);color:var(--danger)}
    .mp-filter-grid{display:grid;gap:12px;margin-top:16px}
    .mp-select-wrap{display:grid;gap:8px}
    .mp-select{width:100%;appearance:none;border-radius:18px;border:1px solid var(--border);background:var(--panel-strong);color:var(--ink);padding:14px 16px;box-shadow:var(--soft-shadow);outline:none}
    .mp-card-grid{display:grid;gap:14px}
    .mp-record-card{padding:18px;border-radius:24px;border:1px solid var(--border);background:var(--panel-strong);box-shadow:var(--soft-shadow);cursor:pointer}
    .mp-record-card.is-featured{background:linear-gradient(135deg, rgba(240,200,75,.16) 0%, rgba(132,191,75,.12) 38%, transparent 58%),var(--panel-strong)}
    .mp-record-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .mp-record-top h3{margin:0;font-size:1.08rem}
    .mp-meta{display:flex;align-items:flex-start;gap:10px;color:var(--sub);font-size:.95rem;margin-top:10px}
    .mp-record-badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
    .mp-record-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 11px;border-radius:999px;font-size:.82rem;font-weight:800;background:var(--accent-soft);color:var(--accent)}
    .mp-record-badge.is-danger{background:var(--danger-soft);color:var(--danger)}
    .mp-record-badge.is-neutral{background:rgba(19,34,53,.06);color:var(--sub)}
    .mp-record-actions{margin-top:16px}
    .mp-record-actions button{flex:1 1 150px}
    .mp-hospital-grid{display:grid;gap:14px}
    .mp-hospital-card{padding:18px;border-radius:24px;border:1px solid var(--border);background:linear-gradient(180deg,var(--panel-strong) 0%,rgba(255,255,255,.72) 100%);box-shadow:var(--soft-shadow);display:grid;gap:14px}
    .mp-hospital-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .mp-hospital-top h3{margin:0;font-size:1.2rem;line-height:1.1}
    .mp-hospital-note{padding:12px 14px;border-radius:18px;background:var(--accent-soft);color:var(--accent);font-weight:700;line-height:1.45}
    .mp-hospital-actions{display:grid;gap:10px}
    .mp-hospital-actions button{width:100%;justify-content:center}
    .mp-emergency-stack{display:grid;gap:12px}
    .mp-emergency-item{padding:16px;border-radius:22px;border:1px solid var(--border);background:var(--panel-strong);box-shadow:var(--soft-shadow);display:grid;gap:10px}
    .mp-emergency-item strong{display:flex;align-items:center;gap:10px}
    .mp-commune-list{display:flex;flex-wrap:wrap;gap:10px}
    .mp-commune-pill{padding:10px 12px;border-radius:16px;border:1px solid var(--border);background:var(--panel-strong);color:var(--ink);cursor:pointer;display:inline-flex;align-items:center;gap:8px;font-weight:700}
    .mp-commune-pill.is-active{background:var(--accent-soft);border-color:transparent;color:var(--accent)}
    .mp-link,.mp-inline-link{text-decoration:none;color:inherit}
    .mp-link{display:inline-flex;align-items:center;gap:8px;font-weight:700}
    .mp-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:18px;padding:0 4px;color:var(--sub);font-size:.95rem}
    .mp-footer a{text-decoration:none;font-weight:700}
    .mp-empty{padding:28px;text-align:center;border:1px dashed var(--border);border-radius:24px;color:var(--sub)}
    .mp-error{margin-top:14px;padding:14px 16px;border-radius:18px;background:var(--danger-soft);color:var(--danger);border:1px solid rgba(216,74,69,.16);font-weight:700}
    .mp-modal-backdrop{position:fixed;inset:0;z-index:40;background:rgba(0,0,0,.46);backdrop-filter:blur(10px);display:flex;align-items:flex-end;justify-content:center;padding:16px}
    .mp-modal{width:min(760px,100%);max-height:min(88vh,960px);overflow:auto;background:var(--bg);border-radius:28px;border:1px solid var(--border);box-shadow:var(--shadow);padding:22px}
    .mp-modal-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
    .mp-modal-head h2{font-family:'Fraunces',serif;font-size:clamp(1.6rem,3vw,2.2rem);line-height:1.05;margin:0 0 8px}
    .mp-modal-grid{display:grid;gap:14px;margin-top:18px}
    .mp-sheet{border:1px solid var(--border);background:var(--panel-strong);border-radius:22px;padding:18px}
    .mp-sheet h3{margin:0 0 10px}
    .mp-close{width:42px;height:42px;border-radius:16px;background:var(--panel-alt);color:var(--ink);border:none}
    @keyframes mp-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.82);opacity:.46}}
    @keyframes mp-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    @media (min-width:720px){.mp-quick-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.mp-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media (min-width:980px){.mp-hero-grid{grid-template-columns:minmax(0,1.35fr) minmax(320px,.78fr);align-items:stretch}.mp-main-grid{grid-template-columns:minmax(0,1.18fr) 360px}.mp-category-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.mp-filter-grid{grid-template-columns:minmax(0,1fr) minmax(300px,.9fr)}.mp-modal-grid{grid-template-columns:1.15fr .85fr}}
  `;

  const themeVars = {
    "--bg": theme.bg,
    "--bg-alt": theme.bgAlt,
    "--panel": theme.panel,
    "--panel-strong": theme.panelStrong,
    "--panel-alt": theme.panelAlt,
    "--ink": theme.ink,
    "--sub": theme.sub,
    "--soft": theme.soft,
    "--border": theme.border,
    "--accent": theme.accent,
    "--accent-soft": theme.accentSoft,
    "--accent-2": theme.accent2,
    "--accent-2-soft": theme.accent2Soft,
    "--accent-3": theme.accent3,
    "--accent-3-soft": theme.accent3Soft,
    "--danger": theme.danger,
    "--danger-soft": theme.dangerSoft,
    "--nav": theme.nav,
    "--hero": theme.hero,
    "--hero-glow": theme.heroGlow,
    "--shadow": theme.shadow,
    "--soft-shadow": theme.softShadow,
  };

  const renderRecord = (provider, featured = false) => {
    const geo = getProviderGeo(provider, geocodeCache);
    const km = geo ? distanceKm(location, geo) : null;
    return (
      <article
        key={provider.id}
        className={`mp-record-card ${featured || provider.featured ? "is-featured" : ""}`}
        onClick={() => setSelected(provider)}
      >
        <div className="mp-record-top">
          <div>
            <h3>{provider.name}</h3>
            <div className="mp-sub">{provider.specialty}</div>
          </div>
          <span className={`mp-record-badge ${provider.category === "hopital" ? "is-danger" : ""}`}>
            {provider.badge}
          </span>
        </div>
        <div className="mp-meta">{ICONS.pin}{provider.address}</div>
        {provider.phone && <div className="mp-meta">{ICONS.phone}{provider.phone}</div>}
        {provider.note && <div className="mp-meta">{provider.note}</div>}
        <div className="mp-record-badges">
          {provider.featured && <span className="mp-record-badge">Vérifiée</span>}
          {provider.acceptsVitale && <span className="mp-record-badge is-neutral">Carte Vitale</span>}
          {provider.apcv && <span className="mp-record-badge is-neutral">apCV</span>}
          {provider.sector && <span className="mp-record-badge is-neutral">{provider.sector}</span>}
          {km !== null && <span className="mp-record-badge is-neutral">{km.toFixed(1)} km</span>}
        </div>
        <div className="mp-record-actions">
          <button
            type="button"
            className="mp-solid-btn"
            onClick={(event) => {
              event.stopPropagation();
              callNumber(provider.phoneRaw, provider.sourceUrl);
            }}
          >
            {provider.phoneRaw ? ICONS.phone : ICONS.ext}
            {provider.phoneRaw ? "Appeler" : "Source"}
          </button>
          <button
            type="button"
            className="mp-ghost-btn"
            onClick={(event) => {
              event.stopPropagation();
              openMaps(provider);
            }}
          >
            {ICONS.nav}
            Itinéraire
          </button>
        </div>
      </article>
    );
  };

  const renderHospitalCard = (provider) => {
    const geo = getProviderGeo(provider, geocodeCache);
    const km = geo ? distanceKm(location, geo) : null;

    return (
      <article key={provider.id} className="mp-hospital-card" onClick={() => setSelected(provider)}>
        <div className="mp-hospital-top">
          <div>
            <h3>{provider.name}</h3>
            <div className="mp-sub" style={{ marginTop: 6 }}>{provider.specialty}</div>
          </div>
          <span className="mp-record-badge is-danger">{provider.badge}</span>
        </div>

        {provider.note && <div className="mp-hospital-note">{provider.note}</div>}

        <div className="mp-meta">{ICONS.pin}{provider.address}</div>
        {provider.phone && <div className="mp-meta">{ICONS.phone}{provider.phone}</div>}

        <div className="mp-record-badges">
          <span className="mp-record-badge">Vérifiée</span>
          <span className="mp-record-badge is-neutral">{provider.city}</span>
          {km !== null && <span className="mp-record-badge is-neutral">{km.toFixed(1)} km</span>}
        </div>

        <div className="mp-hospital-actions">
          <button
            type="button"
            className="mp-solid-btn"
            onClick={(event) => {
              event.stopPropagation();
              callNumber(provider.phoneRaw, provider.sourceUrl);
            }}
          >
            {ICONS.phone}
            Appeler
          </button>
          <button
            type="button"
            className="mp-ghost-btn"
            onClick={(event) => {
              event.stopPropagation();
              openMaps(provider);
            }}
          >
            {ICONS.nav}
            Itinéraire
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="mp-root" style={themeVars}>
      <style>{styles}</style>
      <div className="mp-shell">
        <header className="mp-hero">
          <div className="mp-toolbar">
            <span className="mp-hero-pill">Martinique • santé • accès rapide</span>
            <div className="mp-toolbar-actions">
              <button
                type="button"
                className="mp-icon-btn"
                onClick={() => setDarkMode((value) => !value)}
                aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
              >
                {darkMode ? ICONS.sun : ICONS.moon}
              </button>
              <button type="button" className="mp-glass-btn" onClick={forceRefresh}>
                {ICONS.refresh}
                {refreshing ? "Mise à jour..." : "Rafraîchir"}
              </button>
            </div>
          </div>

          <div className="mp-hero-grid">
            <div>
              <div className="mp-brand">
                <MediPeyiLogo size={82} />
                <div className="mp-brand-copy">
                  <div className="mp-kicker mp-kicker-light">Trouver vite le bon contact santé</div>
                  <h1>MediPeyi</h1>
                  <p>
                    Pharmacies, médecins, urgences et itinéraires en Martinique, avec la pharmacie de garde
                    toujours mise en avant avant le reste.
                  </p>
                </div>
              </div>

              <div className="mp-search">
                <span>{ICONS.search}</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une pharmacie, un médecin, une commune, une spécialité..."
                />
              </div>

              <div className="mp-quick-grid">
                <button
                  type="button"
                  className="mp-quick-card"
                  onClick={() => openExternal(OFFICIAL_SOURCES.gardeUrl)}
                >
                  <strong>
                    {ICONS.ext}
                    Pharmacie de garde
                  </strong>
                  <span>Accès direct à la garde officielle avant de vous déplacer.</span>
                </button>
                <button type="button" className="mp-quick-card" onClick={() => callNumber("15")}>
                  <strong>
                    {ICONS.phone}
                    Urgence vitale
                  </strong>
                  <span>Le 15 reste le premier réflexe en cas d'urgence médicale.</span>
                </button>
                <button
                  type="button"
                  className="mp-quick-card"
                  onClick={() => {
                    setCategory("pharmacie");
                    setZone("all");
                    applyCommune("all");
                  }}
                >
                  <strong>
                    {ICONS.search}
                    Rechercher une pharmacie
                  </strong>
                  <span>Toutes les communes de Martinique dans le même moteur de recherche.</span>
                </button>
                <button type="button" className="mp-quick-card" onClick={handleInstall}>
                  <strong>
                    {ICONS.install}
                    Installer l'app
                  </strong>
                  <span>Ajout à l'écran d'accueil sur Android ou iPhone quand le terminal le permet.</span>
                </button>
              </div>
            </div>

            <aside className="mp-hero-side">
              <div className="mp-hero-card">
                <div className="mp-kicker mp-kicker-light">À faire en premier</div>
                <h2>Vérifier la garde avant de partir.</h2>
                <p>
                  Pour une pharmacie de garde, on évite les listes figées et on renvoie d'abord vers la source
                  opérationnelle.
                </p>
                <div className="mp-actions">
                  <button
                    type="button"
                    className="mp-glass-btn"
                    onClick={() => openExternal(OFFICIAL_SOURCES.gardeUrl)}
                  >
                    {ICONS.ext}
                    Voir la garde en ligne
                  </button>
                  <button type="button" className="mp-glass-btn" onClick={() => callNumber("15")}>
                    {ICONS.phone}
                    Appeler le 15
                  </button>
                </div>
              </div>

              <div className="mp-hero-card">
                <div className="mp-kicker mp-kicker-light">Installation</div>
                <h2>Mobile d'abord, sans friction.</h2>
                <p>{installSummary(installState, Boolean(installPrompt))}</p>
                <div className="mp-actions">
                  <button
                    type="button"
                    className="mp-glass-btn"
                    onClick={handleInstall}
                    disabled={!installPrompt}
                    style={{ opacity: installPrompt ? 1 : 0.7 }}
                  >
                    {ICONS.install}
                    Installer l'app
                  </button>
                </div>
                <div className="mp-soft-note">Dernière synchro locale: {syncDate}</div>
              </div>
            </aside>
          </div>
        </header>

        <div className="mp-main-grid">
          <main className="mp-main-col">
            <section className="mp-panel mp-panel-strong">
              <div className="mp-section-head">
                <div>
                  <div className="mp-kicker">Annuaire principal</div>
                  <h2>{activeCategoryLabel}</h2>
                  <p>Choisissez une catégorie, une zone ou une commune puis ouvrez directement le bon contact.</p>
                </div>
                <div className="mp-toolbar-note">
                  <span className={`mp-status-dot ${refreshing || loadingByCategory[category] ? "is-refreshing" : ""}`}></span>
                  <span>{loadingByCategory[category] ? "Chargement..." : visibleCount}</span>
                </div>
              </div>

              <div className="mp-category-grid">
                {categoryCards.map((item) => (
                  <article
                    key={item.id}
                    className={`mp-category-card ${category === item.id ? "is-active" : ""}`}
                    onClick={() => setCategory(item.id)}
                  >
                    <div className="mp-category-top">
                      <span className="mp-category-icon" style={{ background: item.color }}>
                        {item.icon}
                      </span>
                      <strong>{item.total}</strong>
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 4px" }}>{item.label}</h3>
                      <p className="mp-sub">
                        {item.id === "hopital" ? "Urgences et hôpitaux" : "Accès rapide par catégorie"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mp-pill-row">
                {ZONES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`mp-pill ${zone === item.id ? "is-active" : ""}`}
                    onClick={() => setZone(item.id)}
                  >
                    {item.emoji} {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  className={`mp-pill ${priorityMode ? "is-danger" : ""}`}
                  onClick={() => setPriorityMode((value) => !value)}
                >
                  Priorité urgence
                </button>
              </div>

              <div className="mp-filter-grid">
                <label className="mp-select-wrap">
                  <span className="mp-sub">Commune</span>
                  <select
                    className="mp-select"
                    value={commune}
                    onChange={(event) => applyCommune(event.target.value)}
                  >
                    <option value="all">Toutes les communes</option>
                    {communeOptions.map((item) => (
                      <option key={item.label} value={item.label}>
                        {item.label} ({item.total})
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mp-category-card" style={{ cursor: "default" }}>
                  <div className="mp-kicker">Repère utile</div>
                  <p>
                    {activeCoveredCommunes} communes visibles dans cette vue. Pour une garde, on ouvre d'abord 3237.
                  </p>
                </div>
              </div>

              {error && <div className="mp-error">{error}</div>}
            </section>

            <section className="mp-panel">
              <div className="mp-section-head">
                <div>
                  <div className="mp-kicker">Résultats</div>
                  <h2>{loadingByCategory[category] ? "Chargement en cours" : visibleCount}</h2>
                </div>
                {category === "pharmacie" ? (
                  <button
                    type="button"
                    className="mp-solid-btn"
                    onClick={() => openExternal(OFFICIAL_SOURCES.gardeUrl)}
                  >
                    {ICONS.ext}
                    Voir la garde
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mp-ghost-btn"
                    onClick={() => openExternal(OFFICIAL_SOURCES.ameliUrl)}
                  >
                    {ICONS.ext}
                    Source officielle
                  </button>
                )}
              </div>

              <div className={category === "hopital" ? "mp-hospital-grid" : "mp-card-grid"}>
                {filteredRecords.map((provider) =>
                  category === "hopital" ? renderHospitalCard(provider) : renderRecord(provider)
                )}
              </div>
              {!loadingByCategory[category] && filteredRecords.length === 0 && (
                <div className="mp-empty">
                  Aucun résultat pour cette sélection. Essayez une autre commune ou repassez sur toute la Martinique.
                </div>
              )}
            </section>
          </main>

          <aside className="mp-side-col">
            <section className="mp-panel mp-panel-strong">
              <div className="mp-kicker">Urgences</div>
              <h2>Accès rapide</h2>
              <div className="mp-emergency-stack" style={{ marginTop: 14 }}>
                {EMERGENCY_CONTACTS.slice(0, 4).map((item) => (
                  <article key={item.label} className="mp-emergency-item">
                    <strong style={{ color: item.color }}>
                      {item.href ? ICONS.ext : ICONS.phone}
                      {item.label}
                    </strong>
                    <p>{item.description}</p>
                    <button
                      type="button"
                      className="mp-solid-btn"
                      onClick={() => (item.href ? openExternal(item.href) : callNumber(item.phone))}
                    >
                      {item.href ? ICONS.ext : ICONS.phone}
                      {item.action}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="mp-panel">
              <div className="mp-kicker">Communes</div>
              <h2>Choisir une commune</h2>
              <div className="mp-commune-list" style={{ marginTop: 14 }}>
                {[...communeCoverage]
                  .sort((a, b) => a.label.localeCompare(b.label, "fr"))
                  .map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`mp-commune-pill ${commune === item.label ? "is-active" : ""}`}
                      onClick={() => {
                        setCategory("pharmacie");
                        applyCommune(item.label);
                      }}
                    >
                      <span>{item.label}</span>
                      <span>{item.count}</span>
                    </button>
                  ))}
              </div>
            </section>

            <section className="mp-panel">
              <div className="mp-kicker">Hôpitaux</div>
              <h2>Structures critiques</h2>
              <div className="mp-hospital-grid" style={{ marginTop: 14 }}>
                {HOSPITALS.slice(0, 2).map((provider) => renderHospitalCard(provider))}
              </div>
            </section>
          </aside>
        </div>

        <footer className="mp-footer">
          <span>{coveredCommunes} communes couvertes dans l'annuaire pharmacie officiel.</span>
          <div className="mp-footer-links">
            <a href={OFFICIAL_SOURCES.ameliUrl} target="_blank" rel="noopener noreferrer">
              Annuaire santé Ameli
            </a>
            <a href={OFFICIAL_SOURCES.urpsPharmaciesUrl} target="_blank" rel="noopener noreferrer">
              URPS Pharmaciens 972
            </a>
            <a href={OFFICIAL_SOURCES.arsUrl} target="_blank" rel="noopener noreferrer">
              ARS Martinique
            </a>
          </div>
        </footer>
      </div>

      {selected && (
        <div className="mp-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="mp-modal" onClick={(event) => event.stopPropagation()}>
            <div className="mp-modal-head">
              <div>
                <div className="mp-kicker">{selected.source}</div>
                <h2>{selected.name}</h2>
                <p>{selected.specialty}</p>
              </div>
              <button
                type="button"
                className="mp-icon-btn mp-close"
                onClick={() => setSelected(null)}
                aria-label="Fermer"
              >
                {ICONS.close}
              </button>
            </div>

            <div className="mp-modal-grid">
              <section className="mp-sheet">
                <h3>Coordonnées</h3>
                <div className="mp-meta">{ICONS.pin}{selected.address}</div>
                {selected.phone && <div className="mp-meta">{ICONS.phone}{selected.phone}</div>}
                <div className="mp-meta">
                  {ICONS.ext}
                  <a
                    href={selected.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mp-inline-link"
                    style={{ marginLeft: 6 }}
                  >
                    {selected.source}
                  </a>
                </div>
                <div className="mp-record-badges" style={{ marginTop: 14 }}>
                  {selected.badge && <span className="mp-record-badge">{selected.badge}</span>}
                  {selected.acceptsVitale && <span className="mp-record-badge is-neutral">Carte Vitale</span>}
                  {selected.apcv && <span className="mp-record-badge is-neutral">apCV</span>}
                  {selectedDistance !== null && (
                    <span className="mp-record-badge is-neutral">{selectedDistance.toFixed(1)} km de vous</span>
                  )}
                </div>
                {selected.note && <p style={{ marginTop: 14 }}>{selected.note}</p>}
                <div className="mp-record-actions" style={{ marginTop: 18 }}>
                  <button
                    type="button"
                    className="mp-solid-btn"
                    onClick={() => callNumber(selected.phoneRaw, selected.sourceUrl)}
                  >
                    {selected.phoneRaw ? ICONS.phone : ICONS.ext}
                    {selected.phoneRaw ? "Appeler" : "Source"}
                  </button>
                  <button type="button" className="mp-ghost-btn" onClick={() => openMaps(selected)}>
                    {ICONS.nav}
                    Itinéraire
                  </button>
                </div>
              </section>

              <section className="mp-sheet">
                <h3>Confiance & parcours</h3>
                <p>
                  Dernière mise à jour constatée sur la source principale:{" "}
                  {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                    new Date(selected.sourceUpdatedAt || OFFICIAL_SOURCES.ameliUpdatedAt)
                  )}
                  .
                </p>
                {selectedGeo ? (
                  <p style={{ marginTop: 12 }}>
                    GPS disponible: {selectedGeo.lat.toFixed(6)}, {selectedGeo.lng.toFixed(6)}
                  </p>
                ) : (
                  <p style={{ marginTop: 12 }}>
                    Le GPS n'était pas encore en cache: l'itinéraire s'ouvrira à partir de l'adresse et sera enrichi automatiquement.
                  </p>
                )}
                <div className="mp-source-row" style={{ marginTop: 18 }}>
                  {APPOINTMENT_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={link.tone === "primary" ? "mp-solid-btn" : "mp-ghost-btn"}
                    >
                      {ICONS.ext}
                      {link.label}
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
