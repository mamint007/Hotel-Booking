import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";

// Styled components for the specific page content
const PageHeader = styled.h2`
  font-size: 24px;
  color: #34a853; /* Match theme color */
  margin-bottom: 24px;
  font-weight: 600;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  color: #34a853;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
`;

const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 0.5px;
  
  &:hover {
    background-color: #dc2626;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

// Interface for User Data based on API Response
interface User {
    member_id: string;
    m_firstname: string;
    m_lastname: string;
    m_email: string;
    m_tel: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/admin/users');
            if (res.data && res.data.res_code === '0000') {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const res = await axios.delete(`/admin/users/${id}`);
                if (res.data && res.data.res_code === '0000') {
                    setUsers(users.filter(user => user.member_id !== id));
                    // Optional: Show success alert
                    // alert("User deleted successfully"); 
                }
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user");
            }
        }
    };


    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Manage User" title="Admin - Manage User">
                <PageHeader>Manage User</PageHeader>
                <Card>
                    {loading ? (
                        <EmptyState>Loading users...</EmptyState>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <Th>No.</Th>
                                    <Th>Email</Th>
                                    <Th>Name</Th>
                                    <Th>Lastname</Th>
                                    <Th>Phone</Th>
                                    <Th>Action</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.member_id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{user.m_email}</Td>
                                            <Td>{user.m_firstname}</Td>
                                            <Td>{user.m_lastname}</Td>
                                            <Td>{user.m_tel}</Td>
                                            <Td>
                                                <DeleteButton onClick={() => handleDelete(user.member_id)}>
                                                    DELETE
                                                </DeleteButton>
                                            </Td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <Td colSpan={6}>
                                            <EmptyState>No users found.</EmptyState>
                                        </Td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
