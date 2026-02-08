import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";
import { X, Plus } from "lucide-react";
import Swal from 'sweetalert2';

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

const StatusSelect = styled.select<{ status: string }>`
  background-color: ${props => props.status === 'A' ? '#10b981' : '#ef4444'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  outline: none;
  
  option {
    background-color: white;
    color: black;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 800px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.h3`
  font-size: 24px;
  color: #34a853;
  font-weight: 600;
  text-align: center;
  margin-top: 0;
  margin-bottom: 32px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  
  &:hover {
    color: #6b7280;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #34a853;
    box-shadow: 0 0 0 2px rgba(52, 168, 83, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background-color: white;

  &:focus {
    border-color: #34a853;
    box-shadow: 0 0 0 2px rgba(52, 168, 83, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #34a853;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2e8b46;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
      grid-template-columns: 1fr;
  }
`;

interface RoomType {
    room_type_id: string;
    room_type_name: string;
}

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
    room_image?: string;
}

export default function ManageRoom() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        room_id: '', // Keep for edit mode reference
        room_number: '',
        floor: 1,
        price_per_night: '',
        bed_type: 'S',
        bed_quantity: 1,
        max_guest: 2,
        room_status: 'A',
        room_type_id: ''
    });

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

    const fetchRoomTypes = async () => {
        try {
            const res = await axios.get('/admin/room-types');
            if (res.data && res.data.res_code === '0000') {
                setRoomTypes(res.data.data);
                if (res.data.data.length > 0) {
                    setFormData(prev => ({ ...prev, room_type_id: res.data.data[0].room_type_id }));
                }
            }
        } catch (error) {
            console.error("Failed to fetch room types", error);
        }
    };

    useEffect(() => {
        fetchRooms();
        fetchRoomTypes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleEdit = (room: Room) => {
        setEditMode(true);
        setSelectedFile(null);
        setFormData({
            room_id: room.room_id,
            room_number: room.room_number,
            floor: room.floor,
            price_per_night: room.price_per_night,
            bed_type: room.bed_type,
            bed_quantity: room.bed_quantity,
            max_guest: room.max_guest,
            room_status: room.room_status,
            room_type_id: room.room_type_id
        });
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setEditMode(false);
        setSelectedFile(null);
        setFormData({
            room_id: '',
            room_number: '',
            floor: 1,
            price_per_night: '',
            bed_type: 'S',
            bed_quantity: 1,
            max_guest: 2,
            room_status: 'A',
            room_type_id: roomTypes.length > 0 ? roomTypes[0].room_type_id : ''
        });
        setIsModalOpen(true);
    };

    const mapBedType = (type: string) => {
        if (type === 'S') return 'Single Bed';
        if (type === 'D') return 'Double Bed';
        if (type === 'K') return 'King Bed';
        if (type === 'Q') return 'Queen Bed';
        return type;
    };


    const handleStatusChange = async (roomId: string, newStatus: string) => {
        try {
            const res = await axios.patch(`/admin/rooms/${roomId}/status`, { room_status: newStatus });
            if (res.data && res.data.res_code === '0000') {
                setRooms(prevRooms => prevRooms.map(room =>
                    room.room_id === roomId ? { ...room, room_status: newStatus } : room
                ));
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            // Append all form fields
            data.append('room_number', formData.room_number);
            data.append('floor', String(formData.floor));
            data.append('price_per_night', String(formData.price_per_night));
            data.append('bed_type', formData.bed_type);
            data.append('bed_quantity', String(formData.bed_quantity));
            data.append('max_guest', String(formData.max_guest));
            data.append('room_status', formData.room_status);
            data.append('room_type_id', formData.room_type_id);

            if (selectedFile) {
                data.append('room_image', selectedFile);
            }

            let res;
            if (editMode) {
                res = await axios.put(`/admin/rooms/${formData.room_id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await axios.post('/admin/rooms', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (res.data && res.data.res_code === '0000') {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: editMode ? 'Room updated successfully' : 'Room created successfully',
                    confirmButtonColor: '#34a853'
                });
                setIsModalOpen(false);
                fetchRooms(); // Refresh list
            }
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.res_desc || (editMode ? 'Failed to update room' : 'Failed to create room'),
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (roomId: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#34a853',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.delete(`/admin/rooms/${roomId}`);
                if (res.data && res.data.res_code === '0000') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Room has been deleted.',
                        confirmButtonColor: '#34a853'
                    });
                    fetchRooms(); // Refresh list
                }
            } catch (error: any) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error?.response?.data?.res_desc || 'Failed to delete room',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Manage Room" title="Admin - Manage Room">
                <PageHeader>
                    Manage Room
                    <AddButton onClick={handleAddClick}>ADD ROOM</AddButton>
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
                                                <StatusSelect
                                                    status={room.room_status}
                                                    value={room.room_status}
                                                    onChange={(e) => handleStatusChange(room.room_id, e.target.value)}
                                                >
                                                    <option value="A">Available</option>
                                                    <option value="U">Unavailable</option>
                                                </StatusSelect>
                                            </Td>
                                            <Td>
                                                <ActionButton color="#3b82f6" onClick={() => handleEdit(room)}>EDIT</ActionButton>
                                                <ActionButton color="#ef4444" onClick={() => handleDelete(room.room_id)}>DELETE</ActionButton>
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

                {/* Add Room Modal */}
                {isModalOpen && (
                    <ModalOverlay onClick={() => setIsModalOpen(false)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <CloseButton onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </CloseButton>

                            <ModalHeader>{editMode ? 'Edit Room' : 'Add New Room'}</ModalHeader>

                            <form onSubmit={handleSubmit}>
                                <FormGrid>
                                    {/* Room ID Removed - Auto Generated */}

                                    <FormGroup>
                                        <Label>Room Number</Label>
                                        <Input
                                            name="room_number"
                                            placeholder="Enter your Room Number"
                                            value={formData.room_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Floor</Label>
                                        <Select
                                            name="floor"
                                            value={formData.floor}
                                            onChange={handleChange}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(f => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                        </Select>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Price</Label>
                                        <Input
                                            type="number"
                                            name="price_per_night"
                                            placeholder="Enter your Price"
                                            value={formData.price_per_night}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Bed Type</Label>
                                        <Select
                                            name="bed_type"
                                            value={formData.bed_type}
                                            onChange={handleChange}
                                        >
                                            <option value="S">Single Bed</option>
                                            <option value="D">Double Bed</option>
                                            <option value="K">King Bed</option>
                                            <option value="Q">Queen Bed</option>
                                        </Select>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Bed Quantity</Label>
                                        <Select
                                            name="bed_quantity"
                                            value={formData.bed_quantity}
                                            onChange={handleChange}
                                        >
                                            {[1, 2, 3, 4].map(q => (
                                                <option key={q} value={q}>{q}</option>
                                            ))}
                                        </Select>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Number of Guests</Label>
                                        <Select
                                            name="max_guest"
                                            value={formData.max_guest}
                                            onChange={handleChange}
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </Select>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Room Status</Label>
                                        <Select
                                            name="room_status"
                                            value={formData.room_status}
                                            onChange={handleChange}
                                        >
                                            <option value="A">Available</option>
                                            <option value="U">Unavailable</option>
                                        </Select>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Room Type</Label>
                                        <Select
                                            name="room_type_id"
                                            value={formData.room_type_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            {roomTypes.map(type => (
                                                <option key={type.room_type_id} value={type.room_type_id}>
                                                    {type.room_type_name}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Room Image</Label>
                                        <Input
                                            type="file"
                                            name="room_image"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        {editMode && !selectedFile && (
                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Do not upload if you don't want to change current image</span>
                                        )}
                                    </FormGroup>
                                </FormGrid>

                                <SubmitButton type="submit" disabled={submitting}>
                                    {submitting ? (editMode ? 'Updating...' : 'Adding...') : (editMode ? 'Update Room' : 'Add New Room')}
                                </SubmitButton>
                            </form>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </AdminLayout>
        </AdminAuthGuard>
    );
}
