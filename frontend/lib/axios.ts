import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050",
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    // 🔥 BURADA api DEĞİL, axios kullandık
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/refresh-token`,
      {},
      { withCredentials: true }
    );
    return true;
  } catch (err) {
    console.error("Refresh token başarısız:", err);
    return false;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const success = await refreshAccessToken();

      if (success) {
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
