
import React, { ReactNode } from "react";
import styled from "styled-components";
import {
    User,
    Users,
    Bed,
    Settings,
    CalendarDays,
    CreditCard,
    Flag,
    LogOut,
    LayoutDashboard
} from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "./Navbar";

// Styled Components
const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
  padding-top: 80px;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #34a853; /* Match the green in the image */
  color: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const SidebarHeader = styled.div`
  padding: 24px;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.li<{ active?: boolean }>`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-left: 4px solid ${props => props.active ? 'white' : 'transparent'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const NavText = styled.span`
  font-size: 16px;
`;

const LogoutButton = styled.button`
  margin-top: auto;
  padding: 16px 24px;
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TopHeader = styled.header`
  height: 64px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const AdminProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
`;

const ContentBody = styled.div`
  padding: 32px;
  overflow-y: auto;
`;

interface AdminLayoutProps {
    children: ReactNode;
    activeMenu?: string;
    title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeMenu = 'Manage User', title = 'Hotel Admin' }) => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
    };

    const menuItems = [
        { name: 'Manage User', icon: User, path: '/admin/dashboard' },
        { name: 'Manage Employee', icon: Users, path: '/admin/employee' },
        { name: 'Manage Room', icon: Bed, path: '/admin/room' },
        { name: 'Manage Room Type', icon: Settings, path: '/admin/room-type' }, // Settings icon as placeholder for complex icon
        { name: 'Booking', icon: CalendarDays, path: '/admin/booking' },
        { name: 'Payment', icon: CreditCard, path: '/admin/payment' },
        { name: 'Promotion', icon: Flag, path: '/admin/promotion' },
    ];

    return (
        <LayoutWrapper>
            <Head>
                <title>{title}</title>
            </Head>
            <Navbar />
            <Sidebar>
                <SidebarHeader>Admin Panel</SidebarHeader>
                <NavList>
                    {menuItems.map((item) => (
                        <NavItem
                            key={item.name}
                            active={activeMenu === item.name}
                            onClick={() => router.push(item.path)}
                        >
                            <item.icon size={20} />
                            <NavText>{item.name}</NavText>
                        </NavItem>
                    ))}
                </NavList>
                <LogoutButton onClick={handleLogout}>
                    <LogOut size={20} />
                    Log Out
                </LogoutButton>
            </Sidebar>
            <MainContent>
                <ContentBody>
                    {children}
                </ContentBody>
            </MainContent>
        </LayoutWrapper>
    );
};

export default AdminLayout;
