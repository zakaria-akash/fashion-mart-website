export const productCategories = [
  "all",
  "women",
  "men",
  "casual",
  "winter",
  "streetwear",
];

export const mockProducts = [
  {
    id: "p1",
    title: "Hoodies & Sweetshirt",
    tagline: "Soft layers for off-duty city days.",
    category: "casual",
    price: 89,
    rating: 4.7,
    image: "/images/New-Arrival-Section/new-arrival-section-image1.png",
    description:
      "A plush brushed-fleece hoodie designed for all-day comfort, relaxed layering, and an effortless street-ready finish.",
    accent: "Best seller",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Graphite", "Sand"],
    highlights: ["Premium fleece", "Relaxed silhouette", "Warm yet breathable"],
    details: [
      "Dropped shoulders for a roomy and modern fit.",
      "Ribbed cuffs and hem to keep structure through everyday wear.",
      "Double-layer hood with clean finishing details.",
    ],
  },
  {
    id: "p2",
    title: "Coats & Parkas",
    tagline: "Cold-weather structure with elevated comfort.",
    category: "winter",
    price: 129,
    rating: 4.8,
    image: "/images/New-Arrival-Section/new-arrival-section-image2.png",
    description:
      "A clean-lined parka with lightweight insulation, storm-ready coverage, and refined tailoring that works from commute to weekend.",
    accent: "Winter edit",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive", "Stone", "Black"],
    highlights: ["Light insulation", "Weather-ready shell", "Tailored finish"],
    details: [
      "Extended cut offers extra protection without heavy bulk.",
      "High collar and hood add warmth when temperatures drop.",
      "Streamlined pockets keep essentials close and secure.",
    ],
  },
  {
    id: "p3",
    title: "Tees & T-Shirt",
    tagline: "Clean essentials with a bold everyday attitude.",
    category: "streetwear",
    price: 59,
    rating: 4.5,
    image: "/images/New-Arrival-Section/new-arrival-section-image3.png",
    description:
      "A premium cotton tee with a crisp drape, easy movement, and the kind of fit that anchors every casual wardrobe.",
    accent: "Everyday staple",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Charcoal", "Clay"],
    highlights: ["Midweight cotton", "Relaxed fit", "Soft touch finish"],
    details: [
      "Smooth neckline that keeps its shape after repeated wear.",
      "Slightly oversized body for a modern streetwear profile.",
      "Easy to pair under jackets, overshirts, or knit layers.",
    ],
  },
  {
    id: "p4",
    title: "Trendy Crop Blazer",
    tagline: "Sharp tailoring with a fashion-forward cut.",
    category: "women",
    price: 99,
    rating: 4.6,
    image: "/images/Youngs-Favourite-Section/young-favourite-image1.png",
    description:
      "A cropped blazer that balances polished tailoring with a youthful silhouette, perfect for dressing denim up in seconds.",
    accent: "Editor pick",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Buttercream", "Black", "Soft Taupe"],
    highlights: ["Structured shoulders", "Cropped length", "Day-to-night styling"],
    details: [
      "Defined lapels sharpen the overall silhouette.",
      "Shorter length sits perfectly with high-rise bottoms.",
      "Lightweight fabrication keeps the fit comfortable through long days.",
    ],
  },
  {
    id: "p5",
    title: "Urban Knit Set",
    tagline: "Effortless polish for modern off-hours.",
    category: "women",
    price: 109,
    rating: 4.8,
    image: "/images/Youngs-Favourite-Section/young-favourite-image2.png",
    description:
      "A coordinated knit set with fluid comfort, elevated texture, and a softly tailored look that moves easily from lounge to city.",
    accent: "New arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Mocha", "Slate"],
    highlights: ["Textured knit", "Matching set", "Soft tailored feel"],
    details: [
      "Stretch-rich knit supports a flattering silhouette without feeling tight.",
      "Balanced proportions create a sleek and elongated shape.",
      "Easy separate pieces make styling beyond the full set simple.",
    ],
  },
  {
    id: "p6",
    title: "Weekend Utility Jacket",
    tagline: "Functional layering refined for daily wear.",
    category: "men",
    price: 119,
    rating: 4.4,
    image: "/images/New-Arrival-Section/new-arrival-section-image2.png",
    description:
      "A utility-inspired jacket with practical pockets, clean hardware, and a versatile weight that works across seasons.",
    accent: "Utility style",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Khaki", "Ink", "Pebble"],
    highlights: ["Multi-pocket design", "Seasonless weight", "Clean construction"],
    details: [
      "Structured collar brings polish to a rugged silhouette.",
      "Functional front pockets make it ideal for busy daily routines.",
      "Easy layering fit leaves room for tees or lightweight knits.",
    ],
  },
  {
    id: "p7",
    title: "Relaxed Fit Street Tee",
    tagline: "Minimal form, maximum styling flexibility.",
    category: "men",
    price: 49,
    rating: 4.3,
    image: "/images/New-Arrival-Section/new-arrival-section-image3.png",
    description:
      "A relaxed street tee cut from smooth cotton jersey, built to deliver comfort, shape, and confident simplicity.",
    accent: "Streetwear core",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Forest", "Black"],
    highlights: ["Relaxed drape", "Easy layering", "Soft jersey"],
    details: [
      "Roomier sleeves give the silhouette a laid-back feel.",
      "Designed to work solo or beneath overshirts and jackets.",
      "Clean hem and neckline keep the look sharp and intentional.",
    ],
  },
  {
    id: "p8",
    title: "Soft Oversized Hoodie",
    tagline: "Cozy volume with a clean premium finish.",
    category: "women",
    price: 79,
    rating: 4.9,
    image: "/images/New-Arrival-Section/new-arrival-section-image1.png",
    description:
      "An oversized hoodie with a plush handfeel, generous silhouette, and easy styling that feels luxurious without trying too hard.",
    accent: "Top rated",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Oat", "Rose Smoke", "Black"],
    highlights: ["Oversized fit", "Ultra-soft fleece", "Premium basics"],
    details: [
      "Voluminous shape creates a relaxed and contemporary profile.",
      "Brushed interior adds comfort from the first wear.",
      "Pairs seamlessly with leggings, denim, or tailored outerwear.",
    ],
  },
];

export function getProductById(productId) {
  return mockProducts.find((product) => product.id === productId);
}

export function getRelatedProducts(productId, category, limit = 3) {
  const sameCategory = mockProducts.filter(
    (product) => product.id !== productId && product.category === category
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const fallback = mockProducts.filter(
    (product) => product.id !== productId && product.category !== category
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}
