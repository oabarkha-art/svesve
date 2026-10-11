export interface Artwork {
  id: string;
  category: "malerei" | "illustration";
  title: string;
  description: string;
  image: string;
  year?: string;
  technique: string;
}

export type PaintingArtwork = Artwork & { category: "malerei"; status: "sold" | "available" };

export const paintings: PaintingArtwork[] = [
  {
    id: "painting-seerose",
    category: "malerei",
    title: "Seerose",
    description:
      "Ein Kind beugt sich über eine Seerose in einer grünen, traumhaften Landschaft.",
    image: "/images/painting-seerose.webp",
    technique: "Öl auf Leinwand",
    status: "available",
  },
  {
    id: "painting-der-spiegel",
    category: "malerei",
    title: "Der Spiegel",
    description:
      "Eine Figur zwischen Spiegel, Baum und einem stillen Innenraum.",
    image: "/images/painting-der-spiegel.webp",
    technique: "Öl auf Leinwand",
    status: "available",
  },
  {
    id: "painting-am-meer",
    category: "malerei",
    title: "Am Meer",
    description: "Ein Blick zum Meer, gerahmt von dunklen Ästen und einer Tür.",
    image: "/images/painting-am-meer.webp",
    technique: "Öl auf Leinwand",
    status: "available",
  },
  {
    id: "painting-verschmelzung",
    category: "malerei",
    title: "Verschmelzung",
    description:
      "Ein dunkles Porträt, in dem Mensch und fantastische Formen ineinanderfließen.",
    image: "/images/painting-verschmelzung.webp",
    technique: "Öl auf Leinwand",
    status: "available",
  },
  {
    id: "painting-zwischen-den-voegeln",
    category: "malerei",
    title: "Zwischen den Vögeln",
    description:
      "Vögel, Figuren und architektonische Formen begegnen sich in einer surrealen Welt.",
    image: "/images/painting-zwischen-den-voegeln.webp",
    technique: "Öl auf Leinwand",
    status: "available",
  },
  {
    id: "painting-am-strand",
    category: "malerei",
    title: "Am Strand",
    description:
      "Eine sitzende Figur in einer weiten, fantastischen Landschaft in Grautönen.",
    image: "/images/painting-am-strand.webp",
    technique: "Öl auf Leinwand",
    status: "available",
  },
  {
    id: "painting-pferd-im-fenster",
    category: "malerei",
    title: "Pferd im Fenster",
    description:
      "Zwei Figuren unter einem Fenster, über dem ein Pferd auf die Szene blickt.",
    image: "/images/painting-pferd-im-fenster.webp",
    technique: "Öl auf Leinwand",
    status: "available",
  },
  {
    id: "painting-sami",
    category: "malerei",
    title: "Sami",
    description: "Ein ausdrucksstarkes Porträt in warmen Farben.",
    image: "/images/painting-sami.webp",
    technique: "Öl auf Leinwand",
    status: "available",
    year: "2026",
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

export const artworks: Artwork[] = [...paintings, ...illustrations];
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
