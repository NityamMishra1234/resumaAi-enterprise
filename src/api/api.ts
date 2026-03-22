import axios from "axios"
import { tokenServices } from "../services/tokenServices";



const api = axios.create({
    baseURL: "https://api.gcs-online.space",
    timeout: 50000,
})

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}
api.interceptors.request.use(
    async (config) => {
        const token = await tokenServices.getAccesToken()

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        //  SKIP AUTH ROUTES
        if (originalRequest.url.includes("/company/auth")) {
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] =
                            "Bearer " + token;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = tokenServices.getRefreshToken();

                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const res = await axios.post(
                    "https://api.gcs-online.space/company/auth/refreshtoken",
                    { refreshToken }
                );

                const newAccessToken = res.data.accessToken;
                const newRefreshToken = res.data.refreshToken;

                tokenServices.setTokens(newAccessToken, newRefreshToken);

                processQueue(null, newAccessToken);

                return api(originalRequest);

            } catch (err) {
                processQueue(err, null);
                await tokenServices.removeToken();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;