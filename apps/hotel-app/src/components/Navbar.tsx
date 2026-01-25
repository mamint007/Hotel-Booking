import styled from "styled-components";
//import { Container, Row, Col } from "react-grid-system";
import { Building2, User, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  z-index: 50;
`;

const NavContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;



const NavMenu = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #4CAF50;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px; /* ระยะระหว่าง menu กับปุ่ม */
`;

const ActionButton = styled.button<{ outline?: boolean }>`
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: ${(p) => (p.outline ? "1px solid #4CAF50" : "none")};
  background: ${(p) => (p.outline ? "transparent" : "#4CAF50")};
  color: ${(p) => (p.outline ? "#4CAF50" : "white")};

  &:hover {
    background: #43A047;
    color: white;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #4CAF50;
  
  &:hover {
    opacity: 0.8;
  }
`;

const AdminProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AdminBadge = styled.span`
  background-color: #e8f5e9;
  color: #2e7d32;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
`;

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("admin_token");

    setIsLoggedIn(!!token);
    setIsAdmin(!!adminToken);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/signin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    router.push('/admin/login');
  };

  return (
    <Header>
      <NavContainer>
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Building2 size={24} color="#4b5563" />
            <span style={{ fontSize: 14, color: "black" }}>
              HOTEL RESERVATIONS SYSTEM
            </span>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <RightGroup>
          {!isAdmin && (
            <NavMenu>
              <NavLink href="/">HOME</NavLink>
              <NavLink href="#">ROOM</NavLink>
              <NavLink href="#">SERVICE & FACILITIES</NavLink>
              <NavLink href="/admin/login">ADMIN</NavLink>
            </NavMenu>
          )}

          <ActionGroup>
            {isAdmin ? (
              <div
                onClick={handleAdminLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#555' }}
              >
                <span style={{ fontSize: 13, fontWeight: 500 }}>Admin</span>
                <ChevronDown size={14} />
              </div>
            ) : isLoggedIn ? (
              <UserProfile onClick={handleLogout}>
                <User size={24} />
                <ChevronDown size={16} />
              </UserProfile>
            ) : (
              <>
                <Link href="/signin">
                  <ActionButton>Sign in</ActionButton>
                </Link>
                <Link href="/register">
                  <ActionButton outline>Register</ActionButton>
                </Link>
              </>
            )}
          </ActionGroup>
        </RightGroup>
      </NavContainer>
    </Header>
  );
}