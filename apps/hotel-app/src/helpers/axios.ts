import axios from 'axios'
import Swal from 'sweetalert2'

const axiosInstance = axios.create({
    baseURL: '/api', // Changed from /api to localhost:3001
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        if (typeof window !== 'undefined') {
            // Check if request is for admin
            // config.url might be '/admin/...' or 'admin/...'
            const isAdminRequest = config.url?.includes('/admin');

            const token = isAdminRequest
                ? localStorage.getItem('admin_token')
                : localStorage.getItem('token')

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

let isShowingAlert = false; // Flag to prevent duplicate alerts

// Response Interceptor (Optional: Handle 401 globally)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error

        // Handle Token Expired (406 from backend or 401)
        if (response && (response.data?.res_code === '0406' || response.status === 401)) {
            if (isShowingAlert) {
                return new Promise(() => { });
            }

            isShowingAlert = true;

            await Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Your session has expired. Please log in again.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#4CAF50',
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            isShowingAlert = false;

            // Determine if it was an admin request to redirect correctly
            const isAdminRequest = error.config?.url?.includes('/admin') || window.location.pathname.startsWith('/admin');

            if (isAdminRequest) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                window.location.href = '/admin/login';
            } else {
                localStorage.removeItem('token');
                window.location.href = '/signin';
            }

            return new Promise(() => { });
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
