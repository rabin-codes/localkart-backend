import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { categories as mockCategories } from '../../src/utils/mockData.js';
import { mockProductsExtended } from '../../src/utils/mockDataExtended.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let storeCache = null;

const clone = (value) => JSON.parse(JSON.stringify(value));

export const hashPassword = (password) =>
  createHash('sha256').update(String(password)).digest('hex');

const buildSeedUsers = (timestamp) => [
  {
    id: 1,
    role: 'user',
    name: 'Demo Customer',
    email: 'demo@user.com',
    phone: '9876543210',
    address: '221 Lake View Road',
    city: 'Kolkata',
    zipCode: '700001',
    passwordHash: hashPassword('demo123'),
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 2,
    role: 'vendor',
    name: 'Fresh Valley',
    shopName: 'Fresh Valley',
    email: 'demo@vendor.com',
    phone: '9876543211',
    address: '12 Market Street',
    city: 'Kolkata',
    zipCode: '700017',
    passwordHash: hashPassword('demo123'),
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 3,
    role: 'delivery',
    name: 'Arjun Das',
    email: 'demo@delivery.com',
    phone: '9876543212',
    vehicleType: 'Bike',
    licenseNumber: 'WB-DL-2026-1001',
    address: '5 Riverside Lane',
    city: 'Kolkata',
    zipCode: '700019',
    passwordHash: hashPassword('demo123'),
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

const buildSeedProducts = (timestamp) =>
  mockProductsExtended.map((product) => ({
    id: product.id,
    vendorId: 2,
    categoryId: product.category,
    category: product.category,
    vendor: product.vendor,
    vendorVerified: product.vendorVerified ?? true,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    image: product.image,
    images: product.images ?? [product.image],
    rating: product.rating ?? 4.5,
    reviews: product.reviews ?? 0,
    stock: product.stock ?? 50,
    isActive: true,
    soldCount: Math.max(12, Math.round((product.reviews ?? 10) * 0.8)),
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

const buildSeedCategories = (products) => {
  const categoryNameMap = new Map(
    mockCategories
      .filter((category) => category.id !== 'all')
      .map((category) => [category.id, category.name]),
  );

  const categoryIds = Array.from(
    new Set(products.map((product) => product.category)),
  );

  return categoryIds.map((categoryId) => ({
    id: categoryId,
    name:
      categoryNameMap.get(categoryId) ||
      categoryId
        .split('-')
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' '),
    description: `${categoryId
      .split('-')
      .join(' ')} delivered fast from trusted local vendors.`,
    image:
      products.find((product) => product.category === categoryId)?.image ??
      'https://via.placeholder.com/400x300?text=Category',
  }));
};

const buildOrderItem = (product, quantity) => ({
  productId: product.id,
  vendorId: product.vendorId,
  vendor: product.vendor,
  name: product.name,
  image: product.image,
  price: product.price,
  quantity,
  total: Number((product.price * quantity).toFixed(2)),
});

const buildSeedOrders = (products, timestamp) => {
  const buildDate = (daysAgo) => {
    const date = new Date(timestamp);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  };

  const sampleOrders = [
    {
      id: 1,
      orderNumber: 'ORD1001',
      createdAt: buildDate(4),
      updatedAt: buildDate(4),
      status: 'Delivered',
      payment: {
        method: 'UPI',
        transactionId: 'TXN1001',
        status: 'PAID',
      },
      distanceKm: 2.3,
      deliveryPartnerId: 3,
      rating: 5,
      items: [
        buildOrderItem(products.find((product) => product.id === 1), 2),
        buildOrderItem(products.find((product) => product.id === 11), 1),
      ],
    },
    {
      id: 2,
      orderNumber: 'ORD1002',
      createdAt: buildDate(2),
      updatedAt: buildDate(1),
      status: 'Accepted',
      payment: {
        method: 'Card',
        transactionId: 'TXN1002',
        status: 'PAID',
      },
      distanceKm: 4.1,
      deliveryPartnerId: 3,
      rating: 0,
      items: [
        buildOrderItem(products.find((product) => product.id === 5), 1),
        buildOrderItem(products.find((product) => product.id === 23), 2),
      ],
    },
    {
      id: 3,
      orderNumber: 'ORD1003',
      createdAt: buildDate(0),
      updatedAt: buildDate(0),
      status: 'Pending',
      payment: {
        method: 'Cash on Delivery',
        transactionId: null,
        status: 'PENDING',
      },
      distanceKm: 3.4,
      deliveryPartnerId: null,
      rating: 0,
      items: [
        buildOrderItem(products.find((product) => product.id === 8), 1),
        buildOrderItem(products.find((product) => product.id === 17), 1),
      ],
    },
  ];

  return sampleOrders.map((order) => {
    const subtotal = Number(
      order.items.reduce((sum, item) => sum + item.total, 0).toFixed(2),
    );
    const deliveryCharge = subtotal > 200 ? 0 : 40;

    return {
      ...order,
      userId: 1,
      customerName: 'Demo Customer',
      deliveryAddress: {
        fullName: 'Demo Customer',
        email: 'demo@user.com',
        phone: '9876543210',
        address: '221 Lake View Road',
        city: 'Kolkata',
        zipCode: '700001',
      },
      subtotal,
      deliveryCharge,
      total: Number((subtotal + deliveryCharge).toFixed(2)),
    };
  });
};

const buildSeedStore = () => {
  const timestamp = new Date().toISOString();
  const users = buildSeedUsers(timestamp);
  const products = buildSeedProducts(timestamp);
  const categories = buildSeedCategories(products);
  const orders = buildSeedOrders(products, timestamp);

  return {
    meta: {
      version: 1,
      lastUserId: users[users.length - 1].id,
      lastProductId: Math.max(...products.map((product) => product.id)),
      lastOrderId: orders[orders.length - 1].id,
    },
    users,
    categories,
    products,
    carts: {},
    orders,
  };
};

const ensureStore = async () => {
  if (storeCache) {
    return storeCache;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    const fileContents = await fs.readFile(DB_FILE, 'utf8');
    storeCache = JSON.parse(fileContents);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    storeCache = buildSeedStore();
    await fs.writeFile(DB_FILE, JSON.stringify(storeCache, null, 2), 'utf8');
  }

  return storeCache;
};

export const readStore = async () => clone(await ensureStore());

export const writeStore = async (nextStore) => {
  storeCache = clone(nextStore);
  await fs.writeFile(DB_FILE, JSON.stringify(storeCache, null, 2), 'utf8');
  return clone(storeCache);
};

export const mutateStore = async (mutator) => {
  const currentStore = await ensureStore();
  const draft = clone(currentStore);
  const nextStore = (await mutator(draft)) ?? draft;
  return writeStore(nextStore);
};

export const getNextId = (store, key) => {
  const currentValue = store.meta?.[key] ?? 0;
  const nextValue = currentValue + 1;
  store.meta = store.meta ?? {};
  store.meta[key] = nextValue;
  return nextValue;
};
