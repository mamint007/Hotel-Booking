import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";
import Swal from 'sweetalert2';
import { X, Plus, ChevronDown } from "lucide-react";

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
  max-width: 800px;
  margin: 0 auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ align?: string }>`
  text-align: ${props => props.align || 'left'};
  padding: 16px;
  color: #34a853;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td<{ align?: string }>`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  font-size: 16px;
  text-align: ${props => props.align || 'left'};
`;

const ActionButton = styled.button<{ color?: string }>`
  background-color: ${props => props.color || '#3b82f6'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
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
  font-size: 16px;
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


interface AdditionalCharge {
    charge_id: string;
    charge_name: string;
    charge_amount: number;
    charge_unit: string;
}

interface ChargeFormData {
    charge_name: string;
    charge_amount: string;
    charge_unit: string;
}

export default function AdditionalChargesPage() {
    const [charges, setCharges] = useState<AdditionalCharge[]>([]);
    const [currentChargeId, setCurrentChargeId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const initialFormData: ChargeFormData = {
        charge_name: '',
        charge_amount: '',
        charge_unit: ''
    };

    const [formData, setFormData] = useState<ChargeFormData>(initialFormData);

    const fetchCharges = async () => {
        try {
            const res = await axios.get('/admin/additional-charges');
            if (res.data && res.data.res_code === '0000') {
                setCharges(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch additional charges", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharges();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddClick = () => {
        setIsEditMode(false);
        setCurrentChargeId(null);
        setFormData(initialFormData);
        setIsModalOpen(true);
    };

    const handleEditClick = (charge: AdditionalCharge) => {
        setIsEditMode(true);
        setCurrentChargeId(charge.charge_id);

        setFormData({
            charge_name: charge.charge_name,
            charge_amount: charge.charge_amount.toString(),
            charge_unit: charge.charge_unit
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
                const res = await axios.delete(`/admin/additional-charges/${id}`);
                if (res.data && res.data.res_code === '0000') {
                    Swal.fire(
                        'Deleted!',
                        'Additional charge has been deleted.',
                        'success'
                    );
                    fetchCharges();
                } else {
                    Swal.fire(
                        'Error!',
                        res.data.res_desc || 'Failed to delete charge.',
                        'error'
                    );
                }
            } catch (error: any) {
                console.error("Delete error", error);

                const errorMsg = error?.response?.data?.res_desc || 'Failed to delete charge.';

                Swal.fire(
                    'Error!',
                    errorMsg,
                    'error'
                );
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Convert payload types
        const payload = {
            charge_name: formData.charge_name,
            charge_amount: parseFloat(formData.charge_amount),
            charge_unit: formData.charge_unit
        }

        try {
            let res;
            if (isEditMode && currentChargeId) {
                res = await axios.put(`/admin/additional-charges/${currentChargeId}`, payload, {
                    validateStatus: (status) => status < 500
                });
            } else {
                res = await axios.post('/admin/additional-charges', payload, {
                    validateStatus: (status) => status < 500
                });
            }

            if (res.data && res.data.res_code === '0000') {
                Swal.fire({
                    icon: 'success',
                    title: isEditMode ? 'Updated' : 'Created',
                    text: `Additional charge ${isEditMode ? 'updated' : 'created'} successfully`,
                    timer: 1500
                });
                setIsModalOpen(false);
                fetchCharges();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.data?.res_desc || 'Operation failed'
                });
            }
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

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Additional Charges" title="Admin - Additional Charges">

                <PageHeader>
                    Additional Charges
                    <AddButton onClick={handleAddClick}>
                        ADD CHARGE
                    </AddButton>
                </PageHeader>

                <Card>
                    {loading ? (
                        <EmptyState>Loading additional charges...</EmptyState>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <Th align="center" style={{ width: '80px' }}>ID</Th>
                                    <Th>Charge Name</Th>
                                    <Th>Amount (THB)</Th>
                                    <Th>Action</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {charges.length > 0 ? (
                                    charges.map((charge) => (
                                        <tr key={charge.charge_id}>
                                            <Td align="center">{charge.charge_id}</Td>
                                            <Td>{charge.charge_name}</Td>
                                            <Td>{parseFloat(charge.charge_amount.toString()).toFixed(2)}</Td>
                                            <Td>
                                                <ActionButton color="#3b82f6" onClick={() => handleEditClick(charge)}>EDIT</ActionButton>
                                                <ActionButton color="#ef4444" onClick={() => handleDelete(charge.charge_id)}>DELETE</ActionButton>
                                            </Td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <Td colSpan={4} align="center">
                                            <EmptyState>No additional charges found.</EmptyState>
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

                            <ModalHeader>{isEditMode ? 'Edit Charge' : 'Add New Charge'}</ModalHeader>

                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label>Charge Name</Label>
                                    <Input
                                        name="charge_name"
                                        placeholder="e.g. Extra Bed"
                                        value={formData.charge_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <FormGroup>
                                        <Label>Amount (THB)</Label>
                                        <Input
                                            type="number"
                                            name="charge_amount"
                                            placeholder="0.00"
                                            step="0.01"
                                            value={formData.charge_amount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Unit Type</Label>
                                        <Input
                                            type="text"
                                            name="charge_unit"
                                            placeholder="e.g. THB/Person/Day"
                                            value={formData.charge_unit}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>
                                </div>

                                <SubmitButton type="submit" disabled={submitting}>
                                    {submitting ? 'Saving...' : (isEditMode ? 'Update Charge' : 'Create Charge')}
                                </SubmitButton>
                            </form>
                        </ModalContent>
                    </ModalOverlay>
                )}

            </AdminLayout>
        </AdminAuthGuard>
    );
}
