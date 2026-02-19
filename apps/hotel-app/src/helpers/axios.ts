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

        // 1. Handle Invalid Credentials (0405) - Alert only, NO redirect
        if (response && response.data?.res_code === '0405' || response.data?.res_code === '1402') {
            // if (!isShowingAlert) {
            //     isShowingAlert = true;
            //     await Swal.fire({
            //         icon: 'error',
            //         title: 'Login Failed',
            //         text: 'Invalid email or password.',
            //         confirmButtonText: 'OK',
            //         confirmButtonColor: '#ef4444',
            //         allowOutsideClick: false,
            //         allowEscapeKey: false
            //     });
            //     isShowingAlert = false;
            // }
            return Promise.reject(error);
        }

        // 2. Handle Session Expired (0406 or 401)
        // Note: Check this after 0405 to allow specific handling above
        if (response && (response.data?.res_code === '0406' || response.status === 401)) {
            if (isShowingAlert) {
                return new Promise(() => { });
            }

            isShowingAlert = true;

            await Swal.fire({
                icon: 'warning',
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
                // Avoid loop if already on login page
                if (!window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/admin/login';
                }
            } else {
                localStorage.removeItem('token');
                // Avoid loop if already on signin page
                if (!window.location.pathname.includes('/signin')) {
                    window.location.href = '/signin';
                }
            }

            return new Promise(() => { });
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
