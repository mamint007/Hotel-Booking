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

const DropdownMenu = styled.div`
  position: absolute;
  top: 70px;
  right: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: 1px solid #f3f4f6;
  width: 280px;
  overflow: hidden;
  z-index: 100;
`;

const DropdownHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  background-color: #f9fafb;
`;

const DropdownName = styled.p`
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin: 0;
`;

const DropdownEmail = styled.p`
  color: #6b7280;
  font-size: 12px;
  margin: 4px 0 0 0;
`;

const DropdownRole = styled.span`
  display: inline-block;
  background-color: #dcfce7;
  color: #166534;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  margin-top: 8px;
  font-weight: 600;
  text-transform: uppercase;
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("admin_token");
    const adminUserData = localStorage.getItem("admin_user");

    setIsLoggedIn(!!token);
    setIsAdmin(!!adminToken);

    if (adminUserData) {
      try {
        setAdminUser(JSON.parse(adminUserData));
        console.log(adminUserData)
      } catch (e) {
        console.error("Failed to parse admin user data", e);
      }
    }

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
    localStorage.removeItem('admin_user');
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
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#555' }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Admin</span>
                  <ChevronDown size={14} />
                </div>

                {showDropdown && (
                  <DropdownMenu>
                    <DropdownHeader>
                      <DropdownName>{adminUser?.emp_firstname} {adminUser?.emp_lastname}</DropdownName>
                      <DropdownEmail>{adminUser?.emp_email}</DropdownEmail>
                      {/* Accessing role from included model, structure might be User.role.role_name or User.Role.role_name depending on sequelize alias */}
                      <DropdownRole>{adminUser?.role?.role_name || adminUser?.Role?.role_name || 'Admin'}</DropdownRole>
                    </DropdownHeader>
                    <DropdownItem onClick={() => router.push('/admin/dashboard')}>
                      <LayoutDashboard size={16} />
                      Dashboard
                    </DropdownItem>
                    <DropdownItem onClick={handleAdminLogout} style={{ color: '#ef4444' }}>
                      <LogOut size={16} />
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                )}
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