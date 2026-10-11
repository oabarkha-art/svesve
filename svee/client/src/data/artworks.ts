export interface Artwork {
  id: string;
  category: "malerei" | "illustration";
  title: string;
  description: string;
  image: string;
  year?: string;
  technique: string;
  dimensions?: string;
  sold?: boolean;
}

export const paintings: Artwork[] = [
  {
    id: "painting-seerose",
    category: "malerei",
    title: "Grüner Schnee",
    description:
      "Ein Kind beugt sich über eine Seerose in einer grünen, traumhaften Landschaft.",
    image: "/images/painting-seerose.webp",
    technique: "Öl auf Leinwand",
  },
  {
    id: "painting-der-spiegel",
    sold: true,
    category: "malerei",
    title: "Klosterjunge",
    description:
      "Eine Figur zwischen Spiegel, Baum und einem stillen Innenraum.",
    image: "/images/painting-der-spiegel.webp",
    technique: "Öl auf Leinwand",
  },
  {
    id: "painting-am-meer",
    category: "malerei",
    title: "Sternentür",
    description: "Ein Blick zum Meer, gerahmt von dunklen Ästen und einer Tür.",
    image: "/images/painting-am-meer.webp",
    technique: "Öl auf Leinwand",
  },
  {
    id: "painting-verschmelzung",
    sold: true,
    category: "malerei",
    title: "Wassermann",
    description:
      "Ein dunkles Porträt, in dem Mensch und fantastische Formen ineinanderfließen.",
    image: "/images/painting-verschmelzung.webp",
    technique: "Öl auf Leinwand",
  },
  {
    id: "painting-zwischen-den-voegeln",
    category: "malerei",
    title: "Paradies",
    description:
      "Vögel, Figuren und architektonische Formen begegnen sich in einer surrealen Welt.",
    image: "/images/painting-zwischen-den-voegeln.webp",
    technique: "Öl auf Leinwand",
  },
  {
    id: "painting-am-strand",
    sold: true,
    category: "malerei",
    title: "Gezeiten",
    description:
      "Eine sitzende Figur in einer weiten, fantastischen Landschaft in Grautönen.",
    image: "/images/painting-am-strand.webp",
    technique: "Öl auf Leinwand",
  },
  {
    id: "painting-pferd-im-fenster",
    category: "malerei",
    title: "Schwestern",
    description:
      "Zwei Figuren unter einem Fenster, über dem ein Pferd auf die Szene blickt.",
    image: "/images/painting-pferd-im-fenster.webp",
    technique: "Öl auf Leinwand",
  },
  {
    id: "painting-sami",
    sold: true,
    category: "malerei",
    title: "Sami",
    description: "Ein ausdrucksstarkes Porträt in warmen Farben.",
    image: "/images/painting-sami.webp",
    technique: "Öl auf Leinwand",
    year: "2026",
  },
  {
    id: "painting-spaghetti",
    category: "malerei",
    title: "Spaghetti",
    description: "",
    image: "/images/painting-spaghetti.webp",
    technique: "Öl auf Leinwand",
  },
];

export const illustrations: Artwork[] = [
  {
    id: "illustration-3",
    category: "illustration",
    title: "Kirschen",
    description:
      "Ein Kind greift nach Kirschen, in kühlen Blautönen gemalt. Eine ruhige, verträumte Momentaufnahme.",
    image: "/images/illustration-kirschen.jpg",
    year: "2024",
    technique: "Aquarell & Digital",
  },
  {
    id: "illustration-4",
    category: "illustration",
    title: "Skizze in Bewegung",
    description:
      "Zwei skizzierte Figuren vor einem lebhaften, farbenfrohen Hintergrund. Spontane Linien treffen auf warme Farbflächen.",
    image: "/images/illustration-skizze-figuren.jpg",
    year: "2024",
    technique: "Mischtechnik",
  },
  {
    id: "illustration-5",
    category: "illustration",
    title: "Mit Hund",
    description:
      "Ein Mädchen liest, während ein gefleckter Hund neugierig danebensteht. Zarte Tusche- und Aquarelltöne in Grau.",
    image: "/images/illustration-hund-maedchen.jpg",
    year: "2024",
    technique: "Tusche & Aquarell",
  },
  {
    id: "illustration-6",
    category: "illustration",
    title: "Unter Hasen",
    description:
      "Zwei Kinder inmitten einer Schar von Hasen, in dunklem Grün getaucht. Eine stille, geheimnisvolle Szene.",
    image: "/images/illustration-hasen.jpg",
    year: "2024",
    technique: "Aquarell & Digital",
  },
  {
    id: "illustration-7",
    category: "illustration",
    title: "Verbunden",
    description:
      "Vier Figuren, verbunden durch ein rotes Band – eine verspielte Studie über Nähe und Bewegung.",
    image: "/images/illustration-tanz.png",
    year: "2024",
    technique: "Federzeichnung",
  },
  {
    id: "illustration-8",
    category: "illustration",
    title: "Mädchen mit Leopard",
    description:
      "Ein Mädchen wandert an der Seite eines großen, gepunkteten Leoparden. Sanftes Rosa trägt die Szene.",
    image: "/images/illustration-leopard.png",
    year: "2024",
    technique: "Aquarell & Digital",
  },
  {
    id: "illustration-9",
    category: "illustration",
    title: "Giraffenausflug",
    description:
      "Eine Giraffe auf einer Spazierfahrt im Cabrio, umgeben von zarten Pflanzenmotiven in warmem Gelb.",
    image: "/images/illustration-giraffe.png",
    year: "2024",
    technique: "Aquarell & Digital",
  },
];

export const additionalPrints: Artwork[] = [
  {
    "id": "print-cats",
    "category": "malerei",
    "title": "Cats",
    "description": "",
    "image": "/images/print-cats.webp",
    "technique": "Kunstdruck"
  },
  {
    "id": "print-img-6495",
    "category": "malerei",
    "title": "IMG_6495",
    "description": "",
    "image": "/images/print-img-6495.webp",
    "technique": "Kunstdruck"
  },
  {
    "id": "print-inga",
    "category": "malerei",
    "title": "Inga",
    "description": "",
    "image": "/images/print-inga.webp",
    "technique": "Kunstdruck"
  },
  {
    "id": "print-schwimmer",
    "category": "malerei",
    "title": "Schwimmer",
    "description": "",
    "image": "/images/print-schwimmer.webp",
    "technique": "Kunstdruck"
  },
  {
    "id": "print-postkarte-a5-2",
    "category": "illustration",
    "title": "prints a52",
    "description": "",
    "image": "/images/print-postkarte-a5-2.webp",
    "technique": "Kunstdruck"
  },
  {
    "id": "print-postkarte-a5-6",
    "category": "illustration",
    "title": "prints a56",
    "description": "",
    "image": "/images/print-postkarte-a5-6.webp",
    "technique": "Kunstdruck"
  },
  {
    "id": "print-postkarte-a5-7",
    "category": "illustration",
    "title": "prints a57",
    "description": "",
    "image": "/images/print-postkarte-a5-7.webp",
    "technique": "Kunstdruck"
  },
  {
    "id": "print-postkarte-a5-8",
    "category": "illustration",
    "title": "prints a58",
    "description": "",
    "image": "/images/print-postkarte-a5-8.webp",
    "technique": "Kunstdruck"
  },
  {
    "id": "print-postkarte-a5-9",
    "category": "illustration",
    "title": "prints a59",
    "description": "",
    "image": "/images/print-postkarte-a5-9.webp",
    "technique": "Kunstdruck"
  }
];

export const artworks: Artwork[] = [...paintings, ...illustrations, ...additionalPrints];
export const formats = ["A5", "A4", "A3"] as const;
export type PrintFormat = (typeof formats)[number];
// Prices in cents, shared by the browser and order endpoint.
export const printPrices: Record<PrintFormat, number> = {
  A5: 1200,
  A4: 2400,
  A3: 5200,
};
export const formatDimensions: Record<PrintFormat, string> = {
  A5: "14,8 × 21 cm",
  A4: "21 × 29,7 cm",
  A3: "29,7 × 42 cm",
};
export const money = (cents: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
