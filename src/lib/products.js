import { Readable } from "stream";
import mongoose from "mongoose";
import { Product } from "@/models/Product";
import { WishlistEntry } from "@/models/WishlistEntry";
import { connectToDatabase, getGridFSBucket } from "@/lib/db";
import { serverEnv } from "@/lib/env";

const FASHION_CATEGORY_MAP = {
  tops: "casual",
  "womens-dresses": "women",
  "womens-shoes": "women",
  "womens-bags": "women",
  "womens-jewellery": "women",
  "mens-shirts": "men",
  "mens-shoes": "men",
  "mens-watches": "men",
  sunglasses: "streetwear",
  "womens-watches": "women",
};

const FASHION_SOURCE_CATEGORIES = Object.keys(FASHION_CATEGORY_MAP);
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];
const DEFAULT_HIGHLIGHTS = ["Premium styling", "Comfort-focused fit", "Easy everyday wear"];
const DEFAULT_DETAILS = [
  "Designed for versatile day-to-night styling.",
  "Built to align with the Fashion Mart aesthetic.",
  "Easy to pair across casual and elevated looks.",
];
const COLOR_PRESETS = {
  women: ["Buttercream", "Soft Taupe", "Black"],
  men: ["Ink", "Stone", "Khaki"],
  casual: ["Sand", "Graphite", "Ivory"],
  winter: ["Olive", "Black", "Pebble"],
  streetwear: ["Charcoal", "Clay", "White"],
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategoryFromSource(sourceCategory) {
  return FASHION_CATEGORY_MAP[sourceCategory] ?? "casual";
}

function createTagline(product) {
  return `${product.brand || "Fashion Mart"} style with an elevated ${product.category} edge.`;
}

function createAccent(product) {
  if (product.rating >= 4.8) {
    return "Top rated";
  }

  if (product.stock <= 20) {
    return "Limited drop";
  }

  return product.discountPercentage >= 10 ? "Editor pick" : "New arrival";
}

function createHighlights(product, category) {
  const categoryHighlight =
    category === "women"
      ? "Refined feminine silhouette"
      : category === "men"
        ? "Clean structured finish"
        : category === "streetwear"
          ? "Street-ready profile"
          : category === "winter"
            ? "Layer-friendly comfort"
            : "Easy everyday styling";

  return [
    `${Math.round(product.rating * 20)}% style approval`,
    categoryHighlight,
    `${Math.max(1, Math.round(product.stock))} units currently in stock`,
  ];
}

function createDetails(product) {
  return [
    product.description,
    `Built by ${product.brand || "Fashion Mart"} for polished daily wear.`,
    `Ships with a ${product.warrantyInformation || "carefully packed standard"} presentation.`,
  ];
}

function createColors(category) {
  return COLOR_PRESETS[category] ?? ["Black", "White", "Stone"];
}

function buildProductPayload(sourceProduct, indexOffset = 0) {
  const category = getCategoryFromSource(sourceProduct.category);
  const slug = slugify(sourceProduct.title);

  return {
    source: "dummyjson",
    sourceId: String(sourceProduct.id),
    slug,
    title: sourceProduct.title,
    tagline: createTagline({ ...sourceProduct, category }),
    category,
    brand: sourceProduct.brand || "Fashion Mart",
    description: sourceProduct.description,
    price: Number(sourceProduct.price || 0),
    rating: Number(sourceProduct.rating || 4.5),
    accent: createAccent(sourceProduct),
    sizes: DEFAULT_SIZES,
    colors: createColors(category),
    highlights: createHighlights(sourceProduct, category),
    details: createDetails(sourceProduct),
    imageAlt: sourceProduct.title,
    imageUrlFallback: sourceProduct.thumbnail || sourceProduct.images?.[0] || "",
    featuredHome: indexOffset < 3,
    featuredFavourite: indexOffset >= 3 && indexOffset < 5,
    sortOrder: indexOffset,
  };
}

async function fetchDummyJsonFashionProducts() {
  const requests = FASHION_SOURCE_CATEGORIES.map((category) =>
    fetch(`${serverEnv.dummyJsonBaseUrl}/products/category/${category}?limit=6`)
  );

  const responses = await Promise.all(requests);

  for (const response of responses) {
    if (!response.ok) {
      throw new Error(`DummyJSON request failed with status ${response.status}`);
    }
  }

  const payloads = await Promise.all(responses.map((response) => response.json()));
  return payloads.flatMap((payload) => payload.products ?? []);
}

async function deleteExistingGridFile(fileId) {
  if (!fileId) {
    return;
  }

  try {
    const bucket = await getGridFSBucket();
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
  } catch {
    // Best-effort cleanup only. Missing files should not fail sync.
  }
}

async function uploadImageToGridFS(imageUrl, filename) {
  if (!imageUrl) {
    return null;
  }

  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch remote image: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const bucket = await getGridFSBucket();

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: response.headers.get("content-type") ?? "image/jpeg",
      metadata: {
        originalUrl: imageUrl,
      },
    });

    Readable.from(Buffer.from(arrayBuffer))
      .pipe(uploadStream)
      .on("error", reject)
      .on("finish", () => resolve(uploadStream.id));
  });
}

export async function storeProductImageFromUrl(imageUrl, slug, existingFileId = null) {
  if (!imageUrl) {
    return {
      imageFileId: existingFileId,
      imageUrlFallback: "",
    };
  }

  const uploadedFileId = await uploadImageToGridFS(imageUrl, `${slug}.jpg`);

  if (uploadedFileId) {
    await deleteExistingGridFile(existingFileId);
  }

  return {
    imageFileId: uploadedFileId || existingFileId,
    imageUrlFallback: imageUrl,
  };
}

export function serializeProduct(product) {
  const category = product.category || "casual";
  const fallbackDescription = product.description || "A polished Fashion Mart piece for modern everyday wear.";

  return {
    id: String(product._id),
    slug: product.slug,
    title: product.title,
    tagline: product.tagline || `${product.brand || "Fashion Mart"} style with an elevated ${category} edge.`,
    category,
    brand: product.brand || "Fashion Mart",
    description: fallbackDescription,
    price: Number(product.price ?? 0),
    rating: Number(product.rating ?? 4.5),
    accent: product.accent || "Featured",
    sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES,
    colors: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : createColors(category),
    highlights:
      Array.isArray(product.highlights) && product.highlights.length > 0
        ? product.highlights
        : DEFAULT_HIGHLIGHTS,
    details:
      Array.isArray(product.details) && product.details.length > 0
        ? product.details
        : [fallbackDescription, ...DEFAULT_DETAILS.slice(1)],
    image: product.imageFileId
      ? `/api/files/${String(product.imageFileId)}`
      : product.imageUrlFallback || "/images/New-Arrival-Section/new-arrival-section-image1.png",
    imageUrl: product.imageFileId
      ? `/api/files/${String(product.imageFileId)}`
      : product.imageUrlFallback || "/images/New-Arrival-Section/new-arrival-section-image1.png",
    imageAlt: product.imageAlt || product.title,
    featuredHome: Boolean(product.featuredHome),
    featuredFavourite: Boolean(product.featuredFavourite),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function ensureProductsSeeded() {
  await connectToDatabase();
  const count = await Product.countDocuments();

  if (count > 0) {
    return;
  }

  if (!globalThis.__fashionMartSeedPromise) {
    globalThis.__fashionMartSeedPromise = syncDummyJsonProducts({
      initiatedBy: "auto-seed",
      storeImages: true,
    }).finally(() => {
      globalThis.__fashionMartSeedPromise = null;
    });
  }

  await globalThis.__fashionMartSeedPromise;
}

export async function listProducts({
  category = "all",
  search = "",
  limit,
  featured,
  sort = "featured",
  ids,
} = {}) {
  await connectToDatabase();
  await ensureProductsSeeded();

  const query = {};

  if (category && category !== "all") {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  if (featured === "home") {
    query.featuredHome = true;
  }

  if (featured === "favourite") {
    query.featuredFavourite = true;
  }

  if (ids?.length) {
    query._id = {
      $in: ids.map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  let sortQuery = { sortOrder: 1, createdAt: -1 };

  if (sort === "price-asc") {
    sortQuery = { price: 1, sortOrder: 1 };
  } else if (sort === "price-desc") {
    sortQuery = { price: -1, sortOrder: 1 };
  } else if (sort === "rating") {
    sortQuery = { rating: -1, sortOrder: 1 };
  } else if (sort === "newest") {
    sortQuery = { createdAt: -1 };
  }

  const parsedLimit = limit ? Math.min(Math.max(Number(limit), 1), 50) : undefined;
  const items = await Product.find(query).sort(sortQuery).limit(parsedLimit ?? 0).lean();

  return items.map(serializeProduct);
}

export async function getProductById(productId) {
  await connectToDatabase();
  await ensureProductsSeeded();

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return null;
  }

  const product = await Product.findById(productId).lean();
  return product ? serializeProduct(product) : null;
}

export async function getRelatedProducts(productId, category, limit = 3) {
  await connectToDatabase();
  await ensureProductsSeeded();

  const related = await Product.find({
    _id: { $ne: new mongoose.Types.ObjectId(productId) },
    category,
  })
    .sort({ rating: -1, sortOrder: 1 })
    .limit(limit)
    .lean();

  if (related.length >= limit) {
    return related.map(serializeProduct);
  }

  const fallback = await Product.find({
    _id: { $ne: new mongoose.Types.ObjectId(productId) },
    category: { $ne: category },
  })
    .sort({ rating: -1, sortOrder: 1 })
    .limit(limit - related.length)
    .lean();

  return [...related, ...fallback].map(serializeProduct);
}

export async function mergeWishlistToUser(sessionId, userId) {
  if (!sessionId || !userId) {
    return;
  }

  await connectToDatabase();

  const guestEntries = await WishlistEntry.find({ sessionId }).lean();

  if (guestEntries.length === 0) {
    return;
  }

  for (const entry of guestEntries) {
    await WishlistEntry.updateOne(
      { productId: entry.productId, userId },
      {
        $setOnInsert: {
          productId: entry.productId,
          userId,
        },
      },
      { upsert: true }
    );
  }

  await WishlistEntry.deleteMany({ sessionId });
}

export async function syncDummyJsonProducts({
  dryRun = false,
  storeImages = true,
  initiatedBy = "manual",
} = {}) {
  await connectToDatabase();

  const remoteProducts = await fetchDummyJsonFashionProducts();

  let inserted = 0;
  let updated = 0;
  let imagesStored = 0;

  for (const [index, sourceProduct] of remoteProducts.entries()) {
    const payload = buildProductPayload(sourceProduct, index);
    const existing = await Product.findOne({
      source: payload.source,
      sourceId: payload.sourceId,
    });

    if (dryRun) {
      if (existing) {
        updated += 1;
      } else {
        inserted += 1;
      }
      continue;
    }

    let nextImageFileId = existing?.imageFileId ?? null;
    const nextImageUrlFallback = payload.imageUrlFallback;

    if (storeImages && nextImageUrlFallback) {
      const shouldRefreshImage =
        !existing?.imageFileId || existing.imageUrlFallback !== nextImageUrlFallback;

      if (shouldRefreshImage) {
        const uploadedFileId = await uploadImageToGridFS(nextImageUrlFallback, `${payload.slug}.jpg`);

        if (uploadedFileId) {
          await deleteExistingGridFile(existing?.imageFileId);
          nextImageFileId = uploadedFileId;
          imagesStored += 1;
        }
      }
    }

    const updateDoc = {
      ...payload,
      imageFileId: nextImageFileId,
      imageUrlFallback: nextImageUrlFallback,
    };

    const result = await Product.updateOne(
      {
        source: payload.source,
        sourceId: payload.sourceId,
      },
      {
        $set: updateDoc,
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      inserted += 1;
    } else {
      updated += 1;
    }
  }

  return {
    success: true,
    source: "dummyjson",
    initiatedBy,
    fetched: remoteProducts.length,
    inserted,
    updated,
    imagesStored,
  };
}
