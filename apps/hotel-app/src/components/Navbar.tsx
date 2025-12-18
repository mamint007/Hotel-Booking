import styled from "styled-components";
import { Container, Row, Col } from "react-grid-system";
import { Building2 } from "lucide-react";
import Link from "next/link";

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  background-color: white;
  border-bottom: 1px solid #f3f4f6;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  height: 80px;
  display: flex;
  align-items: center;
`;

const NavLink = styled.a<{ $active?: boolean }>`
  background-color: ${(props) => (props.$active ? "#4CAF50" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#6b7280")};
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: ${(props) => (props.$active ? "#43A047" : "transparent")};
    color: ${(props) => (props.$active ? "white" : "#4CAF50")};
  }
`;

const ActionButton = styled.button<{ $variant?: "primary" | "outline" }>`
  padding: 8px 24px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  background-color: ${(props) => (props.$variant === "outline" ? "transparent" : "#4CAF50")};
  color: ${(props) => (props.$variant === "outline" ? "white" : "white")};
  border: ${(props) => (props.$variant === "outline" ? "1px solid white" : "none")};
  font-size: ${(props) => (props.$variant === "outline" ? "12px" : "14px")};
  text-transform: ${(props) => (props.$variant === "outline" ? "uppercase" : "none")};
  letter-spacing: ${(props) => (props.$variant === "outline" ? "0.1em" : "normal")};
  white-space: nowrap;
  
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.$variant === "outline" ? "white" : "#43A047")};
    color: ${(props) => (props.$variant === "outline" ? "#4CAF50" : "white")};
  }
`;

export default function Navbar() {
    return (
        <Header>
            <Container fluid>
                <Row align="center" justify="between" style={{ height: '100%' }}>
                    <Col xs={6} md={4}>
                        <Link href="/" passHref style={{ textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <Building2 size={32} color="#4b5563" />
                                <span style={{ color: '#4b5563', fontWeight: 500, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                    HOTEL RESERVATIONS SYSTEM
                                </span>
                            </div>
                        </Link>
                    </Col>

                    <Col xs={6} md={8}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '32px' }}>
                            <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="hidden md:flex">
                                <Link href="/" passHref legacyBehavior>
                                    <NavLink>HOME</NavLink>
                                </Link>
                                <NavLink href="#">Room</NavLink>
                                <NavLink href="#">Service & Facilities</NavLink>
                            </nav>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Link href="/signin">
                                    <ActionButton>Sign in</ActionButton>
                                </Link>
                                <Link href="/register">
                                    <ActionButton>Register</ActionButton>
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Header>
    );
}
