import React, { useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";

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

// Mock Data
const MOCK_USERS = [
    { id: 1, email: 'aaa@gmail.com', name: 'AAA', lastname: 'AAAAA' },
    { id: 2, email: 'bbb@gmail.com', name: 'BBB', lastname: 'BBBBB' },
    { id: 3, email: 'ccc@gmail.com', name: 'CCC', lastname: 'CCCCC' },
    { id: 4, email: 'ddd@gmail.com', name: 'DDD', lastname: 'DDDDD' },
    { id: 5, email: 'eee@gmail.com', name: 'EEE', lastname: 'EEEEE' },
    { id: 6, email: 'fff@gmail.com', name: 'FFF', lastname: 'FFFFF' },
    { id: 7, email: 'ggg@gmail.com', name: 'GGG', lastname: 'GGGGG' },
    { id: 8, email: 'hhh@gmail.com', name: 'HHH', lastname: 'HHHHH' },
];

export default function AdminDashboard() {
    const [users, setUsers] = useState(MOCK_USERS);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Manage User" title="Admin - Manage User">
                <PageHeader>Manage User</PageHeader>
                <Card>
                    <Table>
                        <thead>
                            <tr>
                                <Th>No.</Th>
                                <Th>Email</Th>
                                <Th>Name</Th>
                                <Th>Lastname</Th>
                                <Th>Action</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <Td>{index + 1}</Td>
                                    <Td>{user.email}</Td>
                                    <Td>{user.name}</Td>
                                    <Td>{user.lastname}</Td>
                                    <Td>
                                        <DeleteButton onClick={() => handleDelete(user.id)}>
                                            DELETE
                                        </DeleteButton>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
