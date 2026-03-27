import { Product, Testimonial } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Ethereal Whispers",
    description: "A delicate dance of light and shadow, capturing the essence of a fleeting dream. Hand-painted with premium oils on canvas.",
    price: 450,
    image: "https://picsum.photos/seed/art1/800/1000",
    category: "Abstract",
    size: "24x36 inches",
    isFeatured: true
  },
  {
    id: "2",
    title: "Golden Hour Serenity",
    description: "The warmth of the setting sun reflected in a calm landscape. Textured acrylics with real gold leaf accents.",
    price: 580,
    image: "https://picsum.photos/seed/art2/800/1000",
    category: "Landscape",
    size: "30x40 inches",
    isFeatured: true
  },
  {
    id: "3",
    title: "Midnight Bloom",
    description: "A vibrant floral composition emerging from the darkness. Deep blues and rich purples create a moody, elegant atmosphere.",
    price: 320,
    image: "https://picsum.photos/seed/art3/800/1000",
    category: "Floral",
    size: "20x20 inches",
    isFeatured: true
  },
  {
    id: "4",
    title: "Oceanic Rhythm",
    description: "The powerful movement of the sea captured in bold, sweeping strokes. A statement piece for any modern space.",
    price: 750,
    image: "https://picsum.photos/seed/art4/800/1000",
    category: "Abstract",
    size: "48x60 inches"
  },
  {
    id: "5",
    title: "Urban Echo",
    description: "Abstract cityscapes that hum with the energy of life. Mixed media on canvas.",
    price: 390,
    image: "https://picsum.photos/seed/art5/800/1000",
    category: "Urban",
    size: "24x24 inches"
  },
  {
    id: "6",
    title: "Celestial Path",
    description: "A cosmic journey through stars and nebulae. Hand-crafted with iridescent pigments.",
    price: 620,
    image: "https://picsum.photos/seed/art6/800/1000",
    category: "Cosmic",
    size: "36x36 inches"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Elena Rossi",
    text: "The painting I received is even more beautiful in person. It has completely transformed my living room.",
    rating: 5
  },
  {
    id: "2",
    name: "Marcus Thorne",
    text: "Artyy..Hearttt captures emotions in a way I've never seen before. Truly premium quality.",
    rating: 5
  },
  {
    id: "3",
    name: "Sophia Chen",
    text: "Excellent service and the packaging was so secure. A wonderful addition to my collection.",
    rating: 5
  }
];
