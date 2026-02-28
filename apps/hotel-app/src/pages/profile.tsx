import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import UserAuthGuard from '../components/UserAuthGuard';
import { User, Mail, Phone, Calendar, ShieldCheck, Edit2 } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding-top: 120px;
  padding-bottom: 60px;
`;

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  padding: 40px;
  text-align: center;
  color: white;
  position: relative;
`;

const AvatarCircle = styled.div`
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4CAF50;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Name = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const Content = styled.div`
  padding: 40px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  padding: 12px;
  background-color: #f3f4f6;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
`;

const EditButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Failed to parse user data', e);
            }
        }
    }, []);

    return (
        <UserAuthGuard>
            <Navbar />
            <Container>
                <Wrapper>
                    <ProfileCard>
                        <Header>
                            <AvatarCircle>
                                <User size={48} />
                            </AvatarCircle>
                            <Name>
                                {user?.m_firstname} {user?.m_lastname}
                            </Name>
                            <Badge>
                                <ShieldCheck size={14} />
                                Verified Member
                            </Badge>
                            <EditButton title="Edit Profile">
                                <Edit2 size={18} />
                            </EditButton>
                        </Header>

                        <Content>
                            <InfoGrid>
                                <InfoItem>
                                    <Label>
                                        <User size={14} />
                                        First Name
                                    </Label>
                                    <Value>{user?.m_firstname || '-'}</Value>
                                </InfoItem>

                                <InfoItem>
                                    <Label>
                                        <User size={14} />
                                        Last Name
                                    </Label>
                                    <Value>{user?.m_lastname || '-'}</Value>
                                </InfoItem>

                                <InfoItem>
                                    <Label>
                                        <Mail size={14} />
                                        Email
                                    </Label>
                                    <Value>{user?.m_email || '-'}</Value>
                                </InfoItem>

                                <InfoItem>
                                    <Label>
                                        <Phone size={14} />
                                        Phone Number
                                    </Label>
                                    <Value>{user?.m_phone || '-'}</Value>
                                </InfoItem>

                                <InfoItem>
                                    <Label>
                                        <Calendar size={14} />
                                        Member Since
                                    </Label>
                                    <Value>
                                        {user?.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                                            : '-'}
                                    </Value>
                                </InfoItem>
                            </InfoGrid>
                        </Content>
                    </ProfileCard>
                </Wrapper>
            </Container>
        </UserAuthGuard>
    );
}
