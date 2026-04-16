import fs from 'node:fs/promises';
import path from 'node:path';
import { createHmac, randomUUID } from 'node:crypto';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

import { getNextId, hashPassword, mutateStore, readStore } from './lib/data-store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 8080);
const AUTH_SECRET = process.env.AUTH_SECRET || 'localkart-local-secret';
const DIST_DIR = path.resolve(__dirname, '../dist');

const jsonClone = (value) => JSON.parse(JSON.stringify(value));

const createSignature = (payload) =>
  createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');

const createToken = (user) => {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      role: user.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }),
  ).toString('base64url');

  return `${payload}.${createSignature(payload)}`;
};

const verifyToken = (token) => {
  if (!token || !token.includes('.')) {
    return null;
  }

  const [payload, signature] = token.split('.');

  if (createSignature(payload) !== signature) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    );

    if (parsedPayload.exp < Date.now()) {
      return null;
    }

    return parsedPayload;
  } catch (error) {
    return null;
  }
};

const normalizeRole = (role) => {
  const normalized = String(role || '').trim().toLowerCase();

  if (normalized === 'customer') {
    return 'user';
  }

  if (normalized === 'deliverypartner') {
    return 'delivery';
  }

  return normalized || 'user';
};

const sanitizeUser = (user) => ({
  id: user.id,
  role: normalizeRole(user.role),
  name: user.name,
  shopName: user.shopName ?? null,
  email: user.email,
  phone: user.phone ?? '',
  address: user.address ?? '',
  city: user.city ?? '',
  zipCode: user.zipCode ?? '',
  vehicleType: user.vehicleType ?? '',
  licenseNumber: user.licenseNumber ?? '',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildApiResponse = (status, message, data = null) => ({
  status,
  message,
  data,
});

const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

const sendJson = (res, statusCode, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    ...getCorsHeaders(),
  });
  res.end(body);
};

const sendSuccess = (res, message, data = null, statusCode = 200) =>
  sendJson(res, statusCode, buildApiResponse('success', message, data));

const sendError = (res, statusCode, message, data = null) =>
  sendJson(res, statusCode, buildApiResponse('error', message, data));

const parseRequestBody = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  try {
    return JSON.parse(rawBody);
  } catch (error) {
    throw new Error('Request body must be valid JSON.');
  }
};

const matchPath = (pathname, pattern) => {
  const pathParts = pathname.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);

  if (pathParts.length !== patternParts.length) {
    return null;
  }

  const params = {};

  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
};

const toCurrency = (value) => Number(Number(value || 0).toFixed(2));

const getProductById = (store, productId) =>
  store.products.find((product) => product.id === Number(productId));

const buildCartResponse = (store, userId) => {
  const cartItems = store.carts[userId] ?? [];
  const items = cartItems
    .map((item) => {
      const product = getProductById(store, item.productId);

      if (!product) {
        return null;
      }

      return {
        id: product.id,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        stock: product.stock,
        vendor: product.vendor,
        lineTotal: toCurrency(product.price * item.quantity),
      };
    })
    .filter(Boolean);

  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: toCurrency(
      items.reduce((sum, item) => sum + item.lineTotal, 0),
    ),
  };
};

const buildUserOrders = (store, userId) =>
  store.orders
    .filter((order) => order.userId === userId)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((order) => ({
      ...jsonClone(order),
      items: order.items.map((item) => ({
        ...item,
      })),
    }));

const authenticate = async (req, res, allowedRoles = null) => {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null;

  const payload = verifyToken(token);

  if (!payload) {
    sendError(res, 401, 'Please sign in to continue.');
    return null;
  }

  const store = await readStore();
  const user = store.users.find((candidate) => candidate.id === payload.sub);

  if (!user) {
    sendError(res, 401, 'Your session is no longer valid.');
    return null;
  }

  const normalizedRole = normalizeRole(user.role);

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    sendError(res, 403, 'You do not have permission to access this resource.');
    return null;
  }

  return {
    store,
    user,
    token,
  };
};

const getMimeType = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
};

const serveFrontend = async (req, res, pathname) => {
  const relativePath =
    pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const resolvedPath = path.resolve(DIST_DIR, relativePath);

  if (!resolvedPath.startsWith(DIST_DIR)) {
    sendError(res, 403, 'Forbidden');
    return;
  }

  try {
    const fileBuffer = await fs.readFile(resolvedPath);
    res.writeHead(200, {
      'Content-Type': getMimeType(resolvedPath),
      ...getCorsHeaders(),
    });
    res.end(fileBuffer);
    return;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      sendError(res, 500, 'Unable to read frontend assets.');
      return;
    }
  }

  try {
    const indexFile = await fs.readFile(path.join(DIST_DIR, 'index.html'));
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      ...getCorsHeaders(),
    });
    res.end(indexFile);
  } catch (error) {
    sendError(
      res,
      404,
      'Frontend build not found. Run "npm run build" before starting production mode.',
    );
  }
};

const handleHealth = async (res) => {
  const store = await readStore();
  sendSuccess(res, 'LocalKart backend is ready.', {
    users: store.users.length,
    categories: store.categories.length,
    products: store.products.length,
  });
};

const handleGetCategories = async (res) => {
  const store = await readStore();
  sendSuccess(res, 'Categories retrieved.', {
    content: store.categories,
    totalCategories: store.categories.length,
  });
};

const handleGetProducts = async (res, url) => {
  const store = await readStore();
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  const page = Number(url.searchParams.get('page') ?? 0);
  const size = Number(url.searchParams.get('size') ?? 20);

  let products = store.products.filter((product) => product.isActive !== false);

  if (category && category !== 'all') {
    products = products.filter((product) => product.category === category);
  }

  if (search) {
    const query = search.toLowerCase();
    products = products.filter((product) =>
      [product.name, product.description, product.vendor]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }

  const totalProducts = products.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / size));
  const startIndex = page * size;
  const content = products.slice(startIndex, startIndex + size);

  sendSuccess(res, 'Products retrieved.', {
    content,
    currentPage: page,
    totalProducts,
    totalPages,
    hasNext: page + 1 < totalPages,
    hasPrevious: page > 0,
  });
};

const handleGetProductById = async (res, productId) => {
  const store = await readStore();
  const product = getProductById(store, productId);

  if (!product) {
    sendError(res, 404, 'Product not found.');
    return;
  }

  sendSuccess(res, 'Product retrieved.', product);
};

const createUserPayload = (body, role) => {
  const fullName =
    body.name?.trim() ||
    [body.firstName, body.lastName].filter(Boolean).join(' ').trim();

  return {
    role,
    name: fullName || 'LocalKart User',
    email: String(body.email || '').trim().toLowerCase(),
    phone: String(body.phone || '').trim(),
    address: String(body.address || body.shopAddress || '').trim(),
    city: String(body.city || '').trim(),
    zipCode: String(body.zipCode || '').trim(),
    shopName: body.shopName?.trim() || null,
    vehicleType: body.vehicleType?.trim() || body.vehicle?.trim() || null,
    licenseNumber:
      body.licenseNumber?.trim() || `LK-${randomUUID().slice(0, 8).toUpperCase()}`,
  };
};

const validateCredentials = (body) => {
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !password) {
    return {
      valid: false,
      message: 'Email and password are required.',
    };
  }

  return {
    valid: true,
    email,
    password,
  };
};

const handleLogin = async (req, res) => {
  const body = await parseRequestBody(req);
  const credentials = validateCredentials(body);

  if (!credentials.valid) {
    sendError(res, 400, credentials.message);
    return;
  }

  const store = await readStore();
  const user = store.users.find((candidate) => candidate.email === credentials.email);

  if (!user || user.passwordHash !== hashPassword(credentials.password)) {
    sendError(res, 401, 'Invalid email or password.');
    return;
  }

  sendSuccess(res, 'Login successful.', {
    token: createToken(user),
    user: sanitizeUser(user),
  });
};

const handleSignup = async (req, res, role) => {
  const body = await parseRequestBody(req);
  const credentials = validateCredentials(body);

  if (!credentials.valid) {
    sendError(res, 400, credentials.message);
    return;
  }

  if (role === 'user' && !String(body.name || '').trim()) {
    sendError(res, 400, 'Name is required.');
    return;
  }

  if (role === 'vendor' && !String(body.shopName || '').trim()) {
    sendError(res, 400, 'Shop name is required.');
    return;
  }

  if (role === 'delivery' && !String(body.name || '').trim()) {
    sendError(res, 400, 'Name is required.');
    return;
  }

  let createdUser = null;

  await mutateStore((store) => {
    const existingUser = store.users.find(
      (candidate) => candidate.email === credentials.email,
    );

    if (existingUser) {
      return store;
    }

    const userId = getNextId(store, 'lastUserId');
    const timestamp = new Date().toISOString();
    createdUser = {
      id: userId,
      ...createUserPayload(body, role),
      passwordHash: hashPassword(credentials.password),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.users.push(createdUser);
    return store;
  });

  if (!createdUser) {
    sendError(res, 409, 'An account with this email already exists.');
    return;
  }

  sendSuccess(
    res,
    role === 'vendor'
      ? 'Vendor account created successfully.'
      : role === 'delivery'
        ? 'Delivery partner account created successfully.'
        : 'Account created successfully.',
    {
      token: createToken(createdUser),
      user: sanitizeUser(createdUser),
    },
    201,
  );
};

const handleGetCurrentUser = async (req, res) => {
  const auth = await authenticate(req, res);

  if (!auth) {
    return;
  }

  sendSuccess(res, 'Current user retrieved.', sanitizeUser(auth.user));
};

const handleGetCart = async (req, res) => {
  const auth = await authenticate(req, res, ['user']);

  if (!auth) {
    return;
  }

  sendSuccess(res, 'Cart retrieved.', buildCartResponse(auth.store, auth.user.id));
};

const handleAddCartItem = async (req, res) => {
  const auth = await authenticate(req, res, ['user']);

  if (!auth) {
    return;
  }

  const body = await parseRequestBody(req);
  const productId = Number(body.productId);
  const quantity = Math.max(1, Number(body.quantity ?? 1));

  if (!productId) {
    sendError(res, 400, 'Product ID is required.');
    return;
  }

  let cartResponse = null;

  await mutateStore((store) => {
    const product = getProductById(store, productId);

    if (!product || product.isActive === false) {
      return store;
    }

    store.carts[auth.user.id] = store.carts[auth.user.id] ?? [];
    const existingItem = store.carts[auth.user.id].find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.quantity = Math.min(product.stock, existingItem.quantity + quantity);
    } else {
      store.carts[auth.user.id].push({
        productId,
        quantity: Math.min(product.stock, quantity),
      });
    }

    cartResponse = buildCartResponse(store, auth.user.id);
    return store;
  });

  if (!cartResponse) {
    sendError(res, 404, 'Unable to add this product to cart.');
    return;
  }

  sendSuccess(res, 'Item added to cart.', cartResponse, 201);
};

const handleUpdateCartItem = async (req, res, productId) => {
  const auth = await authenticate(req, res, ['user']);

  if (!auth) {
    return;
  }

  const body = await parseRequestBody(req);
  const quantity = Number(body.quantity);

  if (!Number.isFinite(quantity)) {
    sendError(res, 400, 'Quantity is required.');
    return;
  }

  let cartResponse = null;

  await mutateStore((store) => {
    const cartItems = store.carts[auth.user.id] ?? [];
    const itemIndex = cartItems.findIndex(
      (item) => item.productId === Number(productId),
    );

    if (itemIndex === -1) {
      return store;
    }

    if (quantity <= 0) {
      cartItems.splice(itemIndex, 1);
    } else {
      const product = getProductById(store, productId);

      if (!product) {
        cartItems.splice(itemIndex, 1);
      } else {
        cartItems[itemIndex].quantity = Math.min(product.stock, quantity);
      }
    }

    store.carts[auth.user.id] = cartItems;
    cartResponse = buildCartResponse(store, auth.user.id);
    return store;
  });

  sendSuccess(res, 'Cart updated.', cartResponse ?? buildCartResponse(auth.store, auth.user.id));
};

const handleRemoveCartItem = async (req, res, productId) => {
  const auth = await authenticate(req, res, ['user']);

  if (!auth) {
    return;
  }

  let cartResponse = null;

  await mutateStore((store) => {
    const cartItems = store.carts[auth.user.id] ?? [];
    store.carts[auth.user.id] = cartItems.filter(
      (item) => item.productId !== Number(productId),
    );
    cartResponse = buildCartResponse(store, auth.user.id);
    return store;
  });

  sendSuccess(res, 'Item removed from cart.', cartResponse);
};

const handleClearCart = async (req, res) => {
  const auth = await authenticate(req, res, ['user']);

  if (!auth) {
    return;
  }

  await mutateStore((store) => {
    store.carts[auth.user.id] = [];
    return store;
  });

  sendSuccess(res, 'Cart cleared.', {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
};

const handleCreateOrder = async (req, res) => {
  const auth = await authenticate(req, res, ['user']);

  if (!auth) {
    return;
  }

  const body = await parseRequestBody(req);
  const items =
    body.items?.map((item) => ({
      productId: Number(item.productId ?? item.id),
      quantity: Number(item.quantity ?? 1),
    })) ?? [];

  const fallbackCart = buildCartResponse(auth.store, auth.user.id).items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  const requestedItems = items.length > 0 ? items : fallbackCart;

  if (requestedItems.length === 0) {
    sendError(res, 400, 'Your cart is empty.');
    return;
  }

  let createdOrder = null;

  await mutateStore((store) => {
    const orderItems = requestedItems
      .map((item) => {
        const product = getProductById(store, item.productId);

        if (!product) {
          return null;
        }

        return {
          productId: product.id,
          vendorId: product.vendorId,
          vendor: product.vendor,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: Math.max(1, item.quantity),
          total: toCurrency(product.price * Math.max(1, item.quantity)),
        };
      })
      .filter(Boolean);

    if (orderItems.length === 0) {
      return store;
    }

    const subtotal = toCurrency(
      orderItems.reduce((sum, item) => sum + item.total, 0),
    );
    const deliveryCharge = subtotal > 200 ? 0 : 40;
    const orderId = getNextId(store, 'lastOrderId');
    const timestamp = new Date().toISOString();

    createdOrder = {
      id: orderId,
      orderNumber: `ORD${1000 + orderId}`,
      userId: auth.user.id,
      customerName: auth.user.name,
      items: orderItems,
      subtotal,
      deliveryCharge,
      total: toCurrency(subtotal + deliveryCharge),
      status: 'Pending',
      payment: {
        method: body.payment?.method ?? 'Online',
        transactionId:
          body.payment?.transactionId ?? `TXN-${randomUUID().slice(0, 10).toUpperCase()}`,
        status: 'PAID',
      },
      deliveryAddress: {
        fullName: body.deliveryAddress?.fullName || auth.user.name,
        email: body.deliveryAddress?.email || auth.user.email,
        phone: body.deliveryAddress?.phone || auth.user.phone,
        address: body.deliveryAddress?.address || auth.user.address,
        city: body.deliveryAddress?.city || auth.user.city,
        zipCode: body.deliveryAddress?.zipCode || auth.user.zipCode,
      },
      deliveryPartnerId: null,
      distanceKm: Number((Math.random() * 4 + 1).toFixed(1)),
      rating: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    for (const item of orderItems) {
      const product = getProductById(store, item.productId);

      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        product.soldCount = (product.soldCount ?? 0) + item.quantity;
        product.updatedAt = timestamp;
      }
    }

    store.orders.unshift(createdOrder);
    store.carts[auth.user.id] = [];
    return store;
  });

  if (!createdOrder) {
    sendError(res, 400, 'Unable to create your order.');
    return;
  }

  sendSuccess(res, 'Order placed successfully.', createdOrder, 201);
};

const handleGetOrders = async (req, res) => {
  const auth = await authenticate(req, res);

  if (!auth) {
    return;
  }

  const role = normalizeRole(auth.user.role);

  if (role === 'user') {
    sendSuccess(res, 'Orders retrieved.', buildUserOrders(auth.store, auth.user.id));
    return;
  }

  if (role === 'vendor') {
    const vendorOrders = auth.store.orders.filter((order) =>
      order.items.some((item) => item.vendorId === auth.user.id),
    );
    sendSuccess(res, 'Vendor orders retrieved.', vendorOrders);
    return;
  }

  const deliveryOrders = auth.store.orders.filter(
    (order) =>
      order.deliveryPartnerId === auth.user.id ||
      (order.status === 'Pending' && !order.deliveryPartnerId),
  );
  sendSuccess(res, 'Delivery orders retrieved.', deliveryOrders);
};

const handleGetOrderById = async (req, res, orderId) => {
  const auth = await authenticate(req, res);

  if (!auth) {
    return;
  }

  const order = auth.store.orders.find((candidate) => candidate.id === Number(orderId));

  if (!order) {
    sendError(res, 404, 'Order not found.');
    return;
  }

  sendSuccess(res, 'Order retrieved.', order);
};

const handleGetUserProfile = async (req, res) => {
  const auth = await authenticate(req, res);

  if (!auth) {
    return;
  }

  sendSuccess(res, 'Profile retrieved.', sanitizeUser(auth.user));
};

const handleUpdateUserProfile = async (req, res) => {
  const auth = await authenticate(req, res);

  if (!auth) {
    return;
  }

  const body = await parseRequestBody(req);
  let updatedUser = null;

  await mutateStore((store) => {
    const user = store.users.find((candidate) => candidate.id === auth.user.id);

    if (!user) {
      return store;
    }

    user.name = body.name?.trim() || user.name;
    user.phone = body.phone?.trim() || user.phone;
    user.address = body.address?.trim() || user.address;
    user.city = body.city?.trim() || user.city;
    user.zipCode = body.zipCode?.trim() || user.zipCode;
    user.updatedAt = new Date().toISOString();
    updatedUser = sanitizeUser(user);
    return store;
  });

  sendSuccess(res, 'Profile updated.', updatedUser);
};

const handleGetVendorDashboard = async (req, res) => {
  const auth = await authenticate(req, res, ['vendor']);

  if (!auth) {
    return;
  }

  const products = auth.store.products.filter(
    (product) => product.vendorId === auth.user.id && product.isActive !== false,
  );
  const orders = auth.store.orders.filter((order) =>
    order.items.some((item) => item.vendorId === auth.user.id),
  );
  const totalSales = toCurrency(
    orders.reduce((sum, order) => {
      const vendorRevenue = order.items
        .filter((item) => item.vendorId === auth.user.id)
        .reduce((orderTotal, item) => orderTotal + item.total, 0);
      return sum + vendorRevenue;
    }, 0),
  );

  sendSuccess(res, 'Vendor dashboard retrieved.', {
    vendor: sanitizeUser(auth.user),
    stats: {
      totalProducts: products.length,
      totalSales,
      activeOrders: orders.filter((order) => order.status !== 'Delivered').length,
      happyCustomers: new Set(orders.map((order) => order.userId)).size,
    },
    products,
    orders: orders.slice(0, 8),
  });
};

const handleAddVendorProduct = async (req, res) => {
  const auth = await authenticate(req, res, ['vendor']);

  if (!auth) {
    return;
  }

  const body = await parseRequestBody(req);

  if (!body.name || !body.price || !body.stock) {
    sendError(res, 400, 'Name, price, and stock are required.');
    return;
  }

  let createdProduct = null;

  await mutateStore((store) => {
    const timestamp = new Date().toISOString();
    const productId = getNextId(store, 'lastProductId');
    createdProduct = {
      id: productId,
      vendorId: auth.user.id,
      categoryId: body.category || 'vegetables',
      category: body.category || 'vegetables',
      vendor: auth.user.shopName || auth.user.name,
      vendorVerified: true,
      name: String(body.name).trim(),
      description: String(body.description || '').trim() || 'Fresh product from LocalKart.',
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      image:
        String(body.image || '').trim() ||
        'https://via.placeholder.com/400x300?text=LocalKart+Product',
      images: [
        String(body.image || '').trim() ||
          'https://via.placeholder.com/400x300?text=LocalKart+Product',
      ],
      rating: 4.5,
      reviews: 0,
      stock: Number(body.stock),
      isActive: true,
      soldCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.products.unshift(createdProduct);
    return store;
  });

  sendSuccess(res, 'Product created successfully.', createdProduct, 201);
};

const handleDeleteVendorProduct = async (req, res, productId) => {
  const auth = await authenticate(req, res, ['vendor']);

  if (!auth) {
    return;
  }

  let removed = false;

  await mutateStore((store) => {
    const productIndex = store.products.findIndex(
      (product) =>
        product.id === Number(productId) && product.vendorId === auth.user.id,
    );

    if (productIndex === -1) {
      return store;
    }

    store.products.splice(productIndex, 1);
    removed = true;
    return store;
  });

  if (!removed) {
    sendError(res, 404, 'Product not found.');
    return;
  }

  sendSuccess(res, 'Product removed successfully.');
};

const handleGetDeliveryDashboard = async (req, res) => {
  const auth = await authenticate(req, res, ['delivery']);

  if (!auth) {
    return;
  }

  const availableOrders = auth.store.orders.filter(
    (order) => order.status === 'Pending' && !order.deliveryPartnerId,
  );
  const assignedOrders = auth.store.orders.filter(
    (order) => order.deliveryPartnerId === auth.user.id,
  );
  const completedOrders = assignedOrders.filter(
    (order) => order.status === 'Delivered',
  );

  sendSuccess(res, 'Delivery dashboard retrieved.', {
    partner: sanitizeUser(auth.user),
    stats: {
      deliveries: completedOrders.length,
      earnings: toCurrency(completedOrders.length * 45 + assignedOrders.length * 10),
      trips: assignedOrders.length,
      rating: completedOrders.length > 0 ? 4.9 : 4.7,
    },
    orders: [...assignedOrders, ...availableOrders].sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
    ),
  });
};

const handleAcceptDeliveryOrder = async (req, res, orderId) => {
  const auth = await authenticate(req, res, ['delivery']);

  if (!auth) {
    return;
  }

  let updatedOrder = null;

  await mutateStore((store) => {
    const order = store.orders.find((candidate) => candidate.id === Number(orderId));

    if (!order || (order.deliveryPartnerId && order.deliveryPartnerId !== auth.user.id)) {
      return store;
    }

    order.deliveryPartnerId = auth.user.id;
    order.status = 'Accepted';
    order.updatedAt = new Date().toISOString();
    updatedOrder = jsonClone(order);
    return store;
  });

  if (!updatedOrder) {
    sendError(res, 404, 'Order is not available anymore.');
    return;
  }

  sendSuccess(res, 'Order accepted.', updatedOrder);
};

const handleCompleteDeliveryOrder = async (req, res, orderId) => {
  const auth = await authenticate(req, res, ['delivery']);

  if (!auth) {
    return;
  }

  let updatedOrder = null;

  await mutateStore((store) => {
    const order = store.orders.find(
      (candidate) =>
        candidate.id === Number(orderId) &&
        candidate.deliveryPartnerId === auth.user.id,
    );

    if (!order) {
      return store;
    }

    order.status = 'Delivered';
    order.rating = order.rating || 5;
    order.updatedAt = new Date().toISOString();
    updatedOrder = jsonClone(order);
    return store;
  });

  if (!updatedOrder) {
    sendError(res, 404, 'Order not found.');
    return;
  }

  sendSuccess(res, 'Order marked as delivered.', updatedOrder);
};

const routeApiRequest = async (req, res, url) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, getCorsHeaders());
    res.end();
    return;
  }

  const { pathname } = url;

  if (pathname === '/api/health' && req.method === 'GET') {
    await handleHealth(res);
    return;
  }

  if (pathname === '/api/categories' && req.method === 'GET') {
    await handleGetCategories(res);
    return;
  }

  if (pathname === '/api/products' && req.method === 'GET') {
    await handleGetProducts(res, url);
    return;
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    await handleLogin(req, res);
    return;
  }

  if (pathname === '/api/auth/signup' && req.method === 'POST') {
    await handleSignup(req, res, 'user');
    return;
  }

  if (pathname === '/api/auth/signup/vendor' && req.method === 'POST') {
    await handleSignup(req, res, 'vendor');
    return;
  }

  if (pathname === '/api/auth/signup/delivery' && req.method === 'POST') {
    await handleSignup(req, res, 'delivery');
    return;
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    await handleGetCurrentUser(req, res);
    return;
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    sendSuccess(res, 'Logged out successfully.');
    return;
  }

  if (pathname === '/api/cart' && req.method === 'GET') {
    await handleGetCart(req, res);
    return;
  }

  if (pathname === '/api/cart/items' && req.method === 'POST') {
    await handleAddCartItem(req, res);
    return;
  }

  if (pathname === '/api/cart/clear' && req.method === 'DELETE') {
    await handleClearCart(req, res);
    return;
  }

  if (pathname === '/api/orders' && req.method === 'GET') {
    await handleGetOrders(req, res);
    return;
  }

  if (pathname === '/api/orders' && req.method === 'POST') {
    await handleCreateOrder(req, res);
    return;
  }

  if (pathname === '/api/users/profile' && req.method === 'GET') {
    await handleGetUserProfile(req, res);
    return;
  }

  if (pathname === '/api/users/profile' && req.method === 'PUT') {
    await handleUpdateUserProfile(req, res);
    return;
  }

  if (pathname === '/api/vendor/dashboard' && req.method === 'GET') {
    await handleGetVendorDashboard(req, res);
    return;
  }

  if (pathname === '/api/vendor/products' && req.method === 'POST') {
    await handleAddVendorProduct(req, res);
    return;
  }

  if (pathname === '/api/delivery/dashboard' && req.method === 'GET') {
    await handleGetDeliveryDashboard(req, res);
    return;
  }

  const productRoute = matchPath(pathname, '/api/products/:productId');

  if (productRoute && req.method === 'GET') {
    await handleGetProductById(res, productRoute.productId);
    return;
  }

  const cartItemRoute = matchPath(pathname, '/api/cart/items/:productId');

  if (cartItemRoute && req.method === 'PUT') {
    await handleUpdateCartItem(req, res, cartItemRoute.productId);
    return;
  }

  if (cartItemRoute && req.method === 'DELETE') {
    await handleRemoveCartItem(req, res, cartItemRoute.productId);
    return;
  }

  const orderRoute = matchPath(pathname, '/api/orders/:orderId');

  if (orderRoute && req.method === 'GET') {
    await handleGetOrderById(req, res, orderRoute.orderId);
    return;
  }

  const vendorProductRoute = matchPath(pathname, '/api/vendor/products/:productId');

  if (vendorProductRoute && req.method === 'DELETE') {
    await handleDeleteVendorProduct(req, res, vendorProductRoute.productId);
    return;
  }

  const acceptOrderRoute = matchPath(pathname, '/api/delivery/orders/:orderId/accept');

  if (acceptOrderRoute && req.method === 'POST') {
    await handleAcceptDeliveryOrder(req, res, acceptOrderRoute.orderId);
    return;
  }

  const completeOrderRoute = matchPath(
    pathname,
    '/api/delivery/orders/:orderId/complete',
  );

  if (completeOrderRoute && req.method === 'POST') {
    await handleCompleteDeliveryOrder(req, res, completeOrderRoute.orderId);
    return;
  }

  sendError(res, 404, `Route not found: ${url.pathname}`);
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (url.pathname.startsWith('/api/')) {
      await routeApiRequest(req, res, url);
      return;
    }

    await serveFrontend(req, res, url.pathname);
  } catch (error) {
    sendError(res, 500, error.message || 'Unexpected server error.');
  }
});

server.listen(PORT, () => {
  console.log(`LocalKart server running at http://localhost:${PORT}`);
});
