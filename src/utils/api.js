const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const AUTH_TOKEN_KEY = 'authToken';

const buildUrl = (path, params) => {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
};

const parseResponse = async (response) => {
  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok || payload?.status === 'error') {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}.`,
    );
  }

  return payload?.data ?? null;
};

const request = async (path, options = {}) => {
  const token = options.token ?? getStoredAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    options.params ? buildUrl(path, options.params) : `${API_BASE_URL}${path}`,
    {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    },
  );

  return parseResponse(response);
};

export const getStoredAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setStoredAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

export const clearStoredAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const authApi = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: credentials,
    }),
  signupUser: (payload) =>
    request('/auth/signup', {
      method: 'POST',
      body: payload,
    }),
  signupVendor: (payload) =>
    request('/auth/signup/vendor', {
      method: 'POST',
      body: payload,
    }),
  signupDelivery: (payload) =>
    request('/auth/signup/delivery', {
      method: 'POST',
      body: payload,
    }),
  getCurrentUser: () => request('/auth/me'),
  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),
};

export const categoriesApi = {
  getCategories: () => request('/categories'),
};

export const productsApi = {
  getProducts: (params = {}) =>
    request('/products', {
      params,
    }),
  getProduct: (productId) => request(`/products/${productId}`),
};

export const cartApi = {
  getCart: () => request('/cart'),
  addItem: (productId, quantity = 1) =>
    request('/cart/items', {
      method: 'POST',
      body: { productId, quantity },
    }),
  updateItem: (productId, quantity) =>
    request(`/cart/items/${productId}`, {
      method: 'PUT',
      body: { quantity },
    }),
  removeItem: (productId) =>
    request(`/cart/items/${productId}`, {
      method: 'DELETE',
    }),
  clear: () =>
    request('/cart/clear', {
      method: 'DELETE',
    }),
};

export const ordersApi = {
  getOrders: () => request('/orders'),
  getOrder: (orderId) => request(`/orders/${orderId}`),
  createOrder: (payload) =>
    request('/orders', {
      method: 'POST',
      body: payload,
    }),
};

export const usersApi = {
  getProfile: () => request('/users/profile'),
  updateProfile: (payload) =>
    request('/users/profile', {
      method: 'PUT',
      body: payload,
    }),
};

export const vendorApi = {
  getDashboard: () => request('/vendor/dashboard'),
  addProduct: (payload) =>
    request('/vendor/products', {
      method: 'POST',
      body: payload,
    }),
  deleteProduct: (productId) =>
    request(`/vendor/products/${productId}`, {
      method: 'DELETE',
    }),
};

export const deliveryApi = {
  getDashboard: () => request('/delivery/dashboard'),
  acceptOrder: (orderId) =>
    request(`/delivery/orders/${orderId}/accept`, {
      method: 'POST',
    }),
  completeOrder: (orderId) =>
    request(`/delivery/orders/${orderId}/complete`, {
      method: 'POST',
    }),
};

export { API_BASE_URL };
