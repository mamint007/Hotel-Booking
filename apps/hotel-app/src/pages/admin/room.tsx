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
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  text-align: center;
  padding: 16px;
  color: #34a853;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  text-align: center;
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
  margin: 0 4px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  background-color: ${props => props.status === 'A' ? '#10b981' : '#ef4444'};
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  min-width: 80px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

// Interface for Room
interface Room {
    room_id: string;
    room_number: string;
    floor: number;
    price_per_night: string; // Decimal comes as string often
    bed_type: string;
    bed_quantity: number;
    max_guest: number;
    room_status: string;
    room_type_id: string;
    room_type?: {
        room_type_name: string;
    };
}

export default function ManageRoom() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = async () => {
        try {
            const res = await axios.get('/admin/rooms');
            if (res.data && res.data.res_code === '0000') {
                setRooms(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch rooms", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const mapBedType = (type: string) => {
        // Map char to readable string if needed, or just return type
        // Assuming DB stores specific chars, but generic fallback
        if (type === 'S') return 'Single Bed';
        if (type === 'D') return 'Double Bed';
        if (type === 'K') return 'King Bed';
        if (type === 'Q') return 'Queen Bed';
        return type;
    };

    const mapStatus = (status: string) => {
        if (status === 'A') return 'Available';
        return 'Unavailable';
    };

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Manage Room" title="Admin - Manage Room">
                <PageHeader>
                    Manage Room
                    <AddButton>ADD ROOM</AddButton>
                </PageHeader>
                <Card>
                    {loading ? (
                        <EmptyState>Loading rooms...</EmptyState>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <Th>Room Number</Th>
                                    <Th>Floor</Th>
                                    <Th>Price</Th>
                                    <Th>Bed Type</Th>
                                    <Th>Bed Quantity</Th>
                                    <Th>Number of Guests</Th>
                                    <Th>Room Status</Th>
                                    <Th>Action</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.length > 0 ? (
                                    rooms.map((room) => (
                                        <tr key={room.room_id}>
                                            <Td>{room.room_number}</Td>
                                            <Td>{room.floor}</Td>
                                            <Td>{parseFloat(room.price_per_night).toFixed(2)}</Td>
                                            <Td>{mapBedType(room.bed_type)}</Td>
                                            <Td>{room.bed_quantity}</Td>
                                            <Td>{room.max_guest}</Td>
                                            <Td>
                                                <StatusBadge status={room.room_status}>
                                                    {mapStatus(room.room_status)}
                                                </StatusBadge>
                                            </Td>
                                            <Td>
                                                <ActionButton color="#3b82f6">EDIT</ActionButton>
                                                <ActionButton color="#ef4444">DELETE</ActionButton>
                                            </Td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <Td colSpan={8}>
                                            <EmptyState>No rooms found.</EmptyState>
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
