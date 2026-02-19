import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";
import Swal from 'sweetalert2';
import { X } from "lucide-react";

// Styled Components
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  color: #34a853;
  font-weight: 600;
  margin: 0;
`;

const AddButton = styled.button`
  background-color: #34a853;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2e8b46;
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
  min-width: 1000px;
`;

const Thead = styled.thead`
  border-bottom: 1px solid #e5e7eb;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  color: #34a853; /* Theme Green */
  font-weight: 500;
  white-space: nowrap;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  font-size: 13px;
  vertical-align: middle;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  background-color: ${props => props.variant === 'delete' ? '#ef4444' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  margin-right: 8px;
  
  &:last-child {
    margin-right: 0;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const Badge = styled.span<{ active?: boolean }>`
  background-color: ${props => props.active ? '#34a853' : '#9ca3af'};
  color: white;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

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
  max-width: 600px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  min-height: 80px;

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

interface Promotion {
    promo_id: string;
    promo_name: string;
    discount_value: string;
    usage_per_user: number;
    promo_start_date: string;
    promo_end_date: string;
    promo_detail: string;
    employee: {
        emp_firstname: string;
        emp_lastname: string;
    } | null;
    is_active: string;
}

interface PromotionFormData {
    promo_name: string;
    discount_value: string;
    usage_per_user: string;
    promo_start_date: string;
    promo_end_date: string;
    promo_detail: string;
    is_active: string;
}

export default function PromotionPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPromoId, setCurrentPromoId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const initialFormData: PromotionFormData = {
        promo_name: '',
        discount_value: '',
        usage_per_user: '',
        promo_start_date: '',
        promo_end_date: '',
        promo_detail: '',
        is_active: 'A'
    };

    const [formData, setFormData] = useState<PromotionFormData>(initialFormData);

    const fetchPromotions = async () => {
        try {
            const res = await axios.get('/admin/promotions');
            if (res.data && res.data.res_code === '0000') {
                setPromotions(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch promotions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddClick = () => {
        setIsEditMode(false);
        setCurrentPromoId(null);
        setFormData(initialFormData);
        setIsModalOpen(true);
    };

    const handleEditClick = (promo: Promotion) => {
        setIsEditMode(true);
        setCurrentPromoId(promo.promo_id);

        const formatDateForInput = (isoString: string) => {
            if (!isoString) return '';
            // Assuming ISO format, take first 16 chars (YYYY-MM-DDTHH:mm)
            return isoString.slice(0, 16);
        };

        setFormData({
            promo_name: promo.promo_name,
            discount_value: promo.discount_value,
            usage_per_user: promo.usage_per_user.toString(),
            promo_start_date: formatDateForInput(promo.promo_start_date),
            promo_end_date: formatDateForInput(promo.promo_end_date),
            promo_detail: promo.promo_detail,
            is_active: promo.is_active
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/admin/promotions/${id}`);
                Swal.fire(
                    'Deleted!',
                    'Promotion has been deleted.',
                    'success'
                );
                fetchPromotions();
            } catch (error) {
                console.error("Delete error", error);
                Swal.fire(
                    'Error!',
                    'Failed to delete promotion.',
                    'error'
                );
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (isEditMode && currentPromoId) {
                await axios.put(`/admin/promotions/${currentPromoId}`, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'Promotion updated successfully',
                    timer: 1500
                });
            } else {
                await axios.post('/admin/promotions', formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Created',
                    text: 'Promotion created successfully',
                    timer: 1500
                });
            }
            setIsModalOpen(false);
            fetchPromotions();
        } catch (error: any) {
            console.error("Submit error", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.res_desc || 'Operation failed'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await axios.put(`/admin/promotions/${id}`, { is_active: newStatus });
            setPromotions(prev => prev.map(p =>
                p.promo_id === id ? { ...p, is_active: newStatus } : p
            ));

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });

            Toast.fire({
                icon: 'success',
                title: 'Status updated'
            });

        } catch (error) {
            console.error("Status update error", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update status'
            });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Promotion" title="Admin - Promotion Management">

                <PageHeader>
                    <PageTitle>Promotion</PageTitle>
                    <AddButton onClick={handleAddClick}>
                        ADD PROMOTION
                    </AddButton>
                </PageHeader>

                <Card>
                    {loading ? (
                        <EmptyState>Loading promotions...</EmptyState>
                    ) : (
                        <Table>
                            <Thead>
                                <tr>
                                    <Th>No</Th>
                                    <Th>Promo Name</Th>
                                    <Th>Discount</Th>
                                    <Th>Usage/user</Th>
                                    <Th>Start</Th>
                                    <Th>End</Th>
                                    <Th>Details</Th>
                                    <Th>Employee</Th>
                                    <Th>Is Active</Th>
                                    <Th>Action</Th>
                                </tr>
                            </Thead>
                            <tbody>
                                {promotions.length > 0 ? (
                                    promotions.map((promo) => (
                                        <tr key={promo.promo_id}>
                                            <Td>{promo.promo_id}</Td>
                                            <Td>{promo.promo_name}</Td>
                                            <Td>{parseFloat(promo.discount_value).toFixed(2)}</Td>
                                            <Td>{promo.usage_per_user}</Td>
                                            <Td>{formatDate(promo.promo_start_date)}</Td>
                                            <Td>{formatDate(promo.promo_end_date)}</Td>
                                            <Td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={promo.promo_detail}>{promo.promo_detail}</Td>
                                            <Td>{promo.employee ? `${promo.employee.emp_firstname} ${promo.employee.emp_lastname}` : '-'}</Td>
                                            <Td>
                                                <StatusSelect
                                                    value={promo.is_active}
                                                    status={promo.is_active}
                                                    onChange={(e) => handleStatusChange(promo.promo_id, e.target.value)}
                                                >
                                                    <option value="A">Active</option>
                                                    <option value="I">Inactive</option>
                                                </StatusSelect>
                                            </Td>
                                            <Td>
                                                <div style={{ display: 'flex' }}>
                                                    <ActionButton variant="edit" onClick={() => handleEditClick(promo)}>EDIT</ActionButton>
                                                    <ActionButton variant="delete" onClick={() => handleDelete(promo.promo_id)}>DELETE</ActionButton>
                                                </div>
                                            </Td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <Td colSpan={10}>
                                            <EmptyState>No promotions found.</EmptyState>
                                        </Td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card>

                {isModalOpen && (
                    <ModalOverlay onClick={() => setIsModalOpen(false)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <CloseButton onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </CloseButton>

                            <ModalHeader>{isEditMode ? 'Edit Promotion' : 'Add New Promotion'}</ModalHeader>

                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label>Promotion Name</Label>
                                    <Input
                                        name="promo_name"
                                        placeholder="Enter Promotion Name"
                                        value={formData.promo_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <FormGroup>
                                        <Label>Discount Value</Label>
                                        <Input
                                            type="number"
                                            name="discount_value"
                                            placeholder="0.00"
                                            step="0.01"
                                            value={formData.discount_value}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Usage Per User</Label>
                                        <Input
                                            type="number"
                                            name="usage_per_user"
                                            placeholder="1"
                                            value={formData.usage_per_user}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <FormGroup>
                                        <Label>Start Date</Label>
                                        <Input
                                            type="datetime-local"
                                            name="promo_start_date"
                                            value={formData.promo_start_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>End Date</Label>
                                        <Input
                                            type="datetime-local"
                                            name="promo_end_date"
                                            value={formData.promo_end_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </div>

                                <FormGroup>
                                    <Label>Details</Label>
                                    <TextArea
                                        name="promo_detail"
                                        placeholder="Enter Promotion Details"
                                        value={formData.promo_detail}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Status</Label>
                                    <Select
                                        name="is_active"
                                        value={formData.is_active}
                                        onChange={handleChange}
                                    >
                                        <option value="A">Active</option>
                                        <option value="I">Inactive</option>
                                    </Select>
                                </FormGroup>

                                <SubmitButton type="submit" disabled={submitting}>
                                    {submitting ? 'Saving...' : (isEditMode ? 'Update Promotion' : 'Create Promotion')}
                                </SubmitButton>
                            </form>
                        </ModalContent>
                    </ModalOverlay>
                )}

            </AdminLayout>
        </AdminAuthGuard>
    );
}
