import Head from "next/head";
import styled from "styled-components";
import { Container } from "react-grid-system";
import Navbar from "../../components/Navbar";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { useRouter } from "next/router";

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding-top: 80px;
`;

const DashboardCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 32px;
`;

const Title = styled.h1`
  color: #2E7D32;
  margin-bottom: 24px;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #dc2626;
  }
`;

export default function AdminDashboard() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
    };

    return (
        <AdminAuthGuard>
            <Head>
                <title>Admin Dashboard</title>
            </Head>
            <Navbar />
            {/* Note: Navbar might show 'Sign In' for user because we use admin_token. 
          You might want a specific AdminNavbar later. */}

            <PageWrapper>
                <Container>
                    <DashboardCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title>Admin Dashboard</Title>
                            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                        </div>
                        <p>Welcome to the protected admin area.</p>
                    </DashboardCard>
                </Container>
            </PageWrapper>
        </AdminAuthGuard>
    );
}
