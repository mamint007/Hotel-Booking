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

const UserAuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Store return url perhaps? But for now just redirect
            router.push('/signin');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return <LoadingContainer>Verifying Access...</LoadingContainer>;
    }

    return <>{children}</>;
};

export default UserAuthGuard;
