import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";
import { X } from "lucide-react";
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
  max-width: 500px;
  position: relative;
`;

const ModalHeader = styled.h3`
  font-size: 24px;
  color: #34a853;
  font-weight: 600;
  text-align: center;
  margin-top: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 16px;
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

// Interface for Room Type
interface RoomType {
  room_type_id: string;
  room_type_name: string;
}

export default function ManageRoomType() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomTypeName, setRoomTypeName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let res;
      if (editMode && selectedRoomTypeId) {
        res = await axios.put(`/admin/room-types/${selectedRoomTypeId}`, { room_type_name: roomTypeName });
      } else {
        res = await axios.post('/admin/room-types', { room_type_name: roomTypeName });
      }

      if (res.data && res.data.res_code === '0000') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: editMode ? 'Room type updated successfully' : 'Room type created successfully',
          confirmButtonColor: '#34a853'
        });
        setIsModalOpen(false);
        setRoomTypeName('');
        setEditMode(false);
        setSelectedRoomTypeId(null);
        fetchRoomTypes(); // Refresh list
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.response?.data?.res_desc || (editMode ? 'Failed to update room type' : 'Failed to create room type'),
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rt: RoomType) => {
    setRoomTypeName(rt.room_type_name);
    setSelectedRoomTypeId(rt.room_type_id);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`/admin/room-types/${id}`);
        if (res.data && res.data.res_code === '0000') {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Room type has been deleted.',
            confirmButtonColor: '#34a853'
          });
          fetchRoomTypes(); // Refresh list
        }
      } catch (error: any) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.response?.data?.res_desc || 'Failed to delete room type',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleAddNew = () => {
    setRoomTypeName('');
    setSelectedRoomTypeId(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return (
    <AdminAuthGuard>
      <AdminLayout activeMenu="Manage Room Type" title="Admin - Manage Room Type">
        <PageHeader>
          Manage Room Type
          <AddButton onClick={handleAddNew}>ADD ROOM TYPE</AddButton>
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
                        <ActionButton color="#3b82f6" onClick={() => handleEdit(rt)}>EDIT</ActionButton>
                        <ActionButton color="#ef4444" onClick={() => handleDelete(rt.room_type_id)}>DELETE</ActionButton>
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

        {/* Add/Edit Room Type Modal */}
        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </CloseButton>

              <ModalHeader>{editMode ? 'Edit Room Type' : 'Add New Room Type'}</ModalHeader>

              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Name of Room Type</Label>
                  <Input
                    placeholder="Enter Name of Room Type"
                    value={roomTypeName}
                    onChange={(e) => setRoomTypeName(e.target.value)}
                    required
                  />
                </FormGroup>

                <SubmitButton type="submit" disabled={submitting}>
                  {submitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Room Type' : 'Add New Room Type')}
                </SubmitButton>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AdminLayout>
    </AdminAuthGuard>
  );
}
