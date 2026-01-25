import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #4CAF50;
`;

const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check for admin token
        const token = localStorage.getItem('admin_token');

        if (!token) {
            // Redirect to login if no token
            router.push('/admin/login');
        } else {
            // Optional: Decode token to check expiration or role client-side
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return <LoadingContainer>Verifying Access...</LoadingContainer>;
    }

    return <>{children}</>;
};

export default AdminAuthGuard;
