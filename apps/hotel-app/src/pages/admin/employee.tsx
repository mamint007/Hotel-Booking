import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";

// Styled components
const PageHeader = styled.h2`
  font-size: 24px;
  color: #34a853;
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

// Interface for Employee matching backend model
interface Employee {
    employee_id: string; // CHAR(4)
    emp_firstname: string;
    emp_lastname: string;
    emp_email: string;
    role?: {
        role_name: string;
    };
    // No explicit status in model, but we will show Active
}

export default function ManageEmployee() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Manage Employee" title="Admin - Manage Employee">
                <PageHeader>Manage Employee</PageHeader>
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
                                            <Td>{index + 1}</Td>
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
            </AdminLayout>
        </AdminAuthGuard>
    );
}
