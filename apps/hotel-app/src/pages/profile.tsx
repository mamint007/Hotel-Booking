import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import UserAuthGuard from '../components/UserAuthGuard';
import { User, Mail, Phone, Calendar, Edit2, X, Save, UserCircle, Lock } from 'lucide-react';
import axios from '../helpers/axios';
import swalInstance from 'sweetalert2';

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
  min-height: 46px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  padding: 12px;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #4CAF50;
  outline: none;
  width: 100%;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const Select = styled.select`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  padding: 12px;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #4CAF50;
  outline: none;
  width: 100%;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
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

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'secondary' ? `
    background: #f3f4f6;
    color: #4b5563;
    border: 1px solid #e5e7eb;
    &:hover {
      background: #e5e7eb;
    }
  ` : `
    background: #4CAF50;
    color: white;
    border: 1px solid #4CAF50;
    &:hover {
      background: #43A047;
    }
  `}
`;

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        // Don't put actual password in editedUser initial state for security/logic
        setEditedUser({ ...parsed, password: '' });
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
  }, []);

  const toggleEditing = () => {
    if (isEditing) {
      setEditedUser({ ...user, password: '' });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        name: editedUser.m_firstname,
        last_name: editedUser.m_lastname,
        sex: editedUser.m_sex,
        phone_number: editedUser.m_tel
      };

      if (editedUser.password && editedUser.password.trim() !== '') {
        payload.password = editedUser.password;
      }

      const res = await axios.put('/authen/me', payload);

      if (res.data?.res_code === '0000') {
        const updatedUser = res.data.data.member;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);

        swalInstance.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      swalInstance.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong. Please try again.',
      });
    }
  };

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
              {!isEditing && (
                <EditButton title="Edit Profile" onClick={toggleEditing}>
                  <Edit2 size={18} />
                </EditButton>
              )}
            </Header>

            <Content>
              <InfoGrid>
                <InfoItem>
                  <Label>
                    <User size={14} />
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      name="m_firstname"
                      value={editedUser?.m_firstname || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    <Value>{user?.m_firstname || '-'}</Value>
                  )}
                </InfoItem>

                <InfoItem>
                  <Label>
                    <User size={14} />
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      name="m_lastname"
                      value={editedUser?.m_lastname || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    <Value>{user?.m_lastname || '-'}</Value>
                  )}
                </InfoItem>

                <InfoItem>
                  <Label>
                    <UserCircle size={14} />
                    Gender
                  </Label>
                  {isEditing ? (
                    <Select
                      name="m_sex"
                      value={editedUser?.m_sex || ''}
                      onChange={handleChange}
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Select>
                  ) : (
                    <Value>
                      {user?.m_sex === 'M' ? 'Male' : user?.m_sex === 'F' ? 'Female' : '-'}
                    </Value>
                  )}
                </InfoItem>

                <InfoItem>
                  <Label>
                    <Phone size={14} />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      name="m_tel"
                      value={editedUser?.m_tel || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    <Value>{user?.m_tel || '-'}</Value>
                  )}
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
                    <Lock size={14} />
                    Password
                  </Label>
                  {isEditing ? (
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter new password (optional)"
                      value={editedUser?.password || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    <Value>••••••••</Value>
                  )}
                </InfoItem>
              </InfoGrid>

              {isEditing && (
                <ActionButtons>
                  <Button variant="secondary" onClick={toggleEditing}>
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save size={16} />
                    Save Changes
                  </Button>
                </ActionButtons>
              )}
            </Content>
          </ProfileCard>
        </Wrapper>
      </Container>
    </UserAuthGuard>
  );
}
