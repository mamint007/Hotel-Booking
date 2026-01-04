import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: '/api', // All requests will be prefixed with /api, matching the middleware rewrite pattern
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptor (Optional: Handle 401 globally)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle unified error logging or token expiration handling here
        return Promise.reject(error)
    }
)

export default axiosInstance
