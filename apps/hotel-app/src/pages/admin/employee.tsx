import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";
import { X, Plus, UserPlus } from "lucide-react";
import Swal from 'sweetalert2';

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

const StatusBadge = styled.span`
  background-color: #4CAF50;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
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

const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
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

// Interface for Employee
interface Employee {
    employee_id: string;
    emp_firstname: string;
    emp_lastname: string;
    emp_email: string;
    role?: {
        role_name: string;
    };
}

export default function ManageEmployee() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        emp_firstname: '',
        emp_lastname: '',
        emp_sex: 'M',
        emp_tel: '',
        emp_email: '',
        emp_password: '',
        role_id: 'R03' // Default to Employee
    });

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('/admin/employees');
            if (res.data && res.data.res_code === '0000') {
                setEmployees(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch employees", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await axios.post('/admin/employees', formData);
            if (res.data && res.data.res_code === '0000') {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Employee created successfully',
                    confirmButtonColor: '#34a853'
                });
                setIsModalOpen(false);
                fetchEmployees(); // Refresh list
                // Reset form
                setFormData({
                    emp_firstname: '',
                    emp_lastname: '',
                    emp_sex: 'M',
                    emp_tel: '',
                    emp_email: '',
                    emp_password: '',
                    role_id: 'R03'
                });
            }
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.res_desc || 'Failed to create employee',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Manage Employee" title="Admin - Manage Employee">
                <PageHeader>
                    <PageTitle>Manage Employee</PageTitle>
                    <AddButton onClick={() => setIsModalOpen(true)}>
                        ADD EMPLOYEE
                    </AddButton>
                </PageHeader>

                <Card>
                    {loading ? (
                        <EmptyState>Loading employees...</EmptyState>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <Th>No.</Th>
                                    <Th>Name</Th>
                                    <Th>Lastname</Th>
                                    <Th>Role</Th>
                                    <Th>Action</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length > 0 ? (
                                    employees.map((emp, index) => (
                                        <tr key={emp.employee_id}>
                                            <Td>{emp.employee_id}</Td>
                                            <Td>{emp.emp_firstname}</Td>
                                            <Td>{emp.emp_lastname}</Td>
                                            <Td>{emp.role?.role_name || '-'}</Td>
                                            <Td>
                                                <StatusBadge>
                                                    Active
                                                </StatusBadge>
                                            </Td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <Td colSpan={5}>
                                            <EmptyState>No employees found.</EmptyState>
                                        </Td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card>

                {/* Add Employee Modal */}
                {isModalOpen && (
                    <ModalOverlay onClick={() => setIsModalOpen(false)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <CloseButton onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </CloseButton>

                            <ModalHeader>Add New Employee</ModalHeader>

                            <form onSubmit={handleSubmit}>
                                <FormGrid>


                                    <FormGroup>
                                        <Label>First Name</Label>
                                        <Input
                                            name="emp_firstname"
                                            placeholder="Enter your First Name"
                                            value={formData.emp_firstname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>


                                      <FormGroup>
                                        <Label>Last Name</Label>
                                        <Input
                                            name="emp_lastname"
                                            placeholder="Enter your Last Name"
                                            value={formData.emp_lastname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>


                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Label>Sex</Label>
                                        <RadioGroup>
                                            <RadioLabel>
                                                <input
                                                    type="radio"
                                                    name="emp_sex"
                                                    value="M"
                                                    checked={formData.emp_sex === 'M'}
                                                    onChange={handleChange}
                                                />
                                                Male
                                            </RadioLabel>
                                            <RadioLabel>
                                                <input
                                                    type="radio"
                                                    name="emp_sex"
                                                    value="F"
                                                    checked={formData.emp_sex === 'F'}
                                                    onChange={handleChange}
                                                />
                                                Female
                                            </RadioLabel>
                                        </RadioGroup>
                                    </div>


                                    <FormGroup>
                                        <Label>Phone Number</Label>
                                        <Input
                                            name="emp_tel"
                                            placeholder="Enter your Phone Number"
                                            value={formData.emp_tel}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            name="emp_email"
                                            placeholder="Enter your Email"
                                            value={formData.emp_email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Password</Label>
                                        <Input
                                            type="password"
                                            name="emp_password"
                                            placeholder="Enter your Password"
                                            value={formData.emp_password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Role</Label>
                                        <Select
                                            name="role_id"
                                            value={formData.role_id}
                                            onChange={handleChange}
                                        >
                                            <option value="R01">Owner</option>
                                            <option value="R02">Admin</option>
                                            <option value="R03">Employee</option>
                                        </Select>
                                    </FormGroup>
                                </FormGrid>

                                <SubmitButton type="submit" disabled={submitting}>
                                    {submitting ? 'Creating...' : 'Add New Employee'}
                                </SubmitButton>
                            </form>
                        </ModalContent>
                    </ModalOverlay>
                )}

            </AdminLayout>
        </AdminAuthGuard>
    );
}
