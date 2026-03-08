import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Something went wrong";
    console.error("API Error:", message);
    return Promise.reject(error);
  }
);

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getCategories: () => api.get("/products/categories"),
};

export const paymentAPI = {
  createSession: (items, customerEmail) =>
    api.post("/payments/create-session", { items, customerEmail }),
  getSession: (sessionId) => api.get(`/payments/session/${sessionId}`),
};

export default api;
