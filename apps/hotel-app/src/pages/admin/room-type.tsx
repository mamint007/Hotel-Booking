import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";

// Styled Components
const PageHeader = styled.h2`
  font-size: 24px;
  color: #34a853;
  margin-bottom: 24px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  background-color: #10b981; /* Green */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-transform: uppercase;
  
  &:hover {
    background-color: #059669;
  }
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

const ActionButton = styled.button<{ color?: string }>`
  background-color: ${props => props.color || '#3b82f6'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 0.5px;
  margin-right: 8px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

// Interface for Room Type
interface RoomType {
    room_type_id: string;
    room_type_name: string;
}

export default function ManageRoomType() {
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRoomTypes = async () => {
        try {
            const res = await axios.get('/admin/room-types');
            if (res.data && res.data.res_code === '0000') {
                setRoomTypes(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch room types", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Manage Room Type" title="Admin - Manage Room Type">
                <PageHeader>
                    Manage Room Type
                    <AddButton>ADD ROOM TYPE</AddButton>
                </PageHeader>
                <Card>
                    {loading ? (
                        <EmptyState>Loading room types...</EmptyState>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <Th>No.</Th>
                                    <Th>Name of Room Type</Th>
                                    <Th>Action</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomTypes.length > 0 ? (
                                    roomTypes.map((rt, index) => (
                                        <tr key={rt.room_type_id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{rt.room_type_name}</Td>
                                            <Td>
                                                <ActionButton color="#3b82f6">EDIT</ActionButton>
                                                <ActionButton color="#ef4444">DELETE</ActionButton>
                                            </Td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <Td colSpan={3}>
                                            <EmptyState>No room types found.</EmptyState>
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
