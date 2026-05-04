const API_BASE_URL = '/api';

const AUTH_TOKEN_KEY = 'authToken';

const buildUrl = (path, params) => {
  // Use window.location.origin so the URL constructor works with a relative API_BASE_URL
  const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
  const url = new URL(`${API_BASE_URL}${path}`, base);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.pathname + url.search; // return relative path+query only
};

const parseResponse = async (response) => {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok || payload?.status === 'error') {
    throw new Error(payload?.message || `Request failed with status ${response.status}.`);
  }
  return payload?.data ?? null;
};

const request = async (path, options = {}) => {
  const token = options.token ?? getStoredAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers = isFormData
    ? {}
    : { 'Content-Type': 'application/json', ...(options.headers || {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = options.params
    ? buildUrl(path, options.params)
    : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });

  return parseResponse(response);
};

export const getStoredAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const setStoredAuthToken = (token) => { if (token) localStorage.setItem(AUTH_TOKEN_KEY, token); };
export const clearStoredAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

// ── Auth ────────────────────────────────────────────────
export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  signupUser: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  signupVendor: (payload) => request('/auth/signup/vendor', { method: 'POST', body: payload }),
  signupDelivery: (payload) => request('/auth/signup/delivery', { method: 'POST', body: payload }),
  getCurrentUser: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
};

// ── Categories ──────────────────────────────────────────
export const categoriesApi = {
  getCategories: () => request('/categories'),
};

// ── Products ────────────────────────────────────────────
export const productsApi = {
  getProducts: (params = {}) => request('/products', { params }),
  getProduct: (productId) => request(`/products/${productId}`),
  searchProducts: (query, params = {}) => request('/products', { params: { search: query, ...params } }),
  getByCategory: (categoryId, params = {}) => request('/products', { params: { category: categoryId, ...params } }),
};

// ── Cart ────────────────────────────────────────────────
export const cartApi = {
  getCart: () => request('/cart'),
  addItem: (productId, quantity = 1) => request('/cart/items', { method: 'POST', body: { productId, quantity } }),
  updateItem: (productId, quantity) => request(`/cart/items/${productId}`, { method: 'PUT', body: { quantity } }),
  removeItem: (productId) => request(`/cart/items/${productId}`, { method: 'DELETE' }),
  clear: () => request('/cart/clear', { method: 'DELETE' }),
};

// ── Orders ──────────────────────────────────────────────
export const ordersApi = {
  getOrders: () => request('/orders'),
  getOrder: (orderId) => request(`/orders/${orderId}`),
  createOrder: (payload) => request('/orders', { method: 'POST', body: payload }),
  getAvailable: () => request('/orders/available'),
  updateStatus: (orderId, status) => request(`/orders/${orderId}/status?status=${status}`, { method: 'PUT' }),
};

// ── Users ───────────────────────────────────────────────
export const usersApi = {
  getProfile: () => request('/users/profile'),
  updateProfile: (payload) => request('/users/profile', { method: 'PUT', body: payload }),
};

// ── Vendor ──────────────────────────────────────────────
export const vendorApi = {
  getDashboard: () => request('/vendors/dashboard'),
  getProducts: (params = {}) => request('/vendors/products', { params }),
  addProduct: (payload) => request('/vendors/products', { method: 'POST', body: payload }),
  updateProduct: (productId, payload) => request(`/vendors/products/${productId}`, { method: 'PUT', body: payload }),
  deleteProduct: (productId) => request(`/vendors/products/${productId}`, { method: 'DELETE' }),
  uploadProductImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Returns the data payload: { imageUrl: '...' }
    return request('/vendors/products/upload-image', { method: 'POST', body: formData });
  },
  getOrders: () => request('/vendors/orders'),
  updateOrderStatus: (orderId, status) => request(`/vendors/orders/${orderId}/status?status=${status}`, { method: 'PUT' }),
  getProfile: () => request('/vendors/profile'),
  updateProfile: (payload) => request('/vendors/profile', { method: 'PUT', body: payload }),
};

// ── Delivery ────────────────────────────────────────────
export const deliveryApi = {
  getDashboard: () => request('/delivery/dashboard'),
  getAvailableOrders: () => request('/delivery/available-orders'),
  getMyOrders: () => request('/delivery/orders'),
  acceptOrder: (orderId) => request(`/delivery/orders/${orderId}/accept`, { method: 'POST' }),
  completeOrder: (orderId) => request(`/delivery/orders/${orderId}/complete`, { method: 'POST' }),
  getProfile: () => request('/delivery/profile'),
};

// ── Chat ────────────────────────────────────────────────
export const chatApi = {
  getMessages: (vendorId) => request(`/chat/messages/${vendorId}`),
  sendMessage: (payload) => request('/chat/send', { method: 'POST', body: payload }),
  markAsRead: (vendorId) => request(`/chat/read/${vendorId}`, { method: 'PUT' }),
  getUnreadCount: () => request('/chat/unread-count'),
  getConversations: () => request('/chat/conversations'),
};

// ── AI Predictions ──────────────────────────────────────
export const predictionApi = {
  getPredictions: () => request('/predictions'),
};

// ── Combo Orders ────────────────────────────────────────
export const comboApi = {
  createComboOrder: (payload) => request('/combo/orders', { method: 'POST', body: payload }),
  getMyComboOrders: () => request('/combo/orders'),
  getAvailableComboOrders: () => request('/combo/available'),
  acceptComboOrder: (orderId) => request(`/combo/orders/${orderId}/accept`, { method: 'POST' }),
  updateStatus: (orderId, status) => request(`/combo/orders/${orderId}/status?status=${status}`, { method: 'PUT' }),
  suggestCombo: (productIds) => request('/combo/suggest', { method: 'POST', body: { productIds } }),
};

// ── ChatBot Assistant ────────────────────────────────────
export const chatbotApi = {
  query: (query) => request('/chatbot/query', { method: 'POST', body: { query } }),
};

// ── Email Notifications ─────────────────────────────────
export const emailApi = {
  notify: (email, type = 'NEWSLETTER') => request('/email/notify', { method: 'POST', body: { email, type } }),
};

export { API_BASE_URL };
