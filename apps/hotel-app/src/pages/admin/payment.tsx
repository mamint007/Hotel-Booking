import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";
import { ChevronDown } from "lucide-react";
import Swal from 'sweetalert2';

// Styled Components
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

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table<{ $hasDropdown: boolean }>`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
  margin-bottom: ${props => props.$hasDropdown ? '160px' : '0'};
  transition: margin-bottom 0.3s ease;
`;

const Th = styled.th`
  text-align: center;
  padding: 16px;
  color: #34a853;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  text-align: center;
  font-size: 14px;
`;

const StatusBadge = styled.button<{ status: string }>`
  background-color: ${props => {
        switch (props.status) {
            case 'A': return '#10b981'; // Approved
            case 'P': return '#f59e0b'; // Pending
            case 'U': return '#ef4444'; // Unpaid
            default: return '#f59e0b';
        }
    }};
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  background-color: white;
  min-width: 140px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 50;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 8px; /* Opens DOWN */
  right: 0;
  border: 1px solid #e5e7eb;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DropdownItem = styled.div<{ color: string }>`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
    color: ${props => props.color};
  }

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.color};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

// Interface for Payment
interface Payment {
    payment_id: string;
    payment_date: string;
    booking_id: string;
    slip_url: string;
    payment_due_time: string;
    employee_id: string; // Or expand object if needed
    payment_status: string;
}

export default function Payment() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const statusOptions = [
        { label: 'Approved', value: 'A', color: '#10b981' },
        { label: 'Pending', value: 'P', color: '#f59e0b' },
        { label: 'Unpaid', value: 'U', color: '#ef4444' },
    ];

    const fetchPayments = async () => {
        try {
            const res = await axios.get('/admin/payments');
            if (res.data && res.data.res_code === '0000') {
                setPayments(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (paymentId: string, newStatus: string) => {
        try {
            const res = await axios.patch(`/admin/payments/${paymentId}/status`, {
                payment_status: newStatus
            });

            if (res.data && res.data.res_code === '0000') {
                setPayments(prev => prev.map(p => p.payment_id === paymentId ? { ...p, payment_status: newStatus } : p));
                setOpenDropdownId(null);

                Swal.fire({
                    icon: 'success',
                    title: 'Status Updated',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Could not update payment status.'
            });
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(',', '');
    };

    const mapStatus = (status: string) => {
        // Assume 'P' = Pending, 'A' = Approved? Or similar mapping.
        // Based on screenshot 'Pending' (Yellow) vs 'Approved' (Green)
        if (status === 'S' || status === 'A' || status === 'Approved') return 'Approved';
        return 'Pending';
    };

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Payment" title="Admin - Payment">
                <PageHeader>Payments</PageHeader>
                <Card>
                    {loading ? (
                        <EmptyState>Loading payments...</EmptyState>
                    ) : (
                        <TableWrapper>
                            <Table $hasDropdown={!!openDropdownId}>
                            <thead>
                                <tr>
                                    <Th>No</Th>
                                    <Th>Payment Date</Th>
                                    <Th>Booking</Th>
                                    <Th>Slip URL</Th>
                                    <Th>Due Time</Th>
                                    <Th>Employee</Th>
                                    <Th>Payment Status</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length > 0 ? (
                                    payments.map((p) => (
                                        <tr key={p.payment_id}>
                                            <Td>{p.payment_id}</Td>
                                            <Td>{formatDate(p.payment_date)}</Td>
                                            <Td>{p.booking_id}</Td>
                                            <Td>
                                                {p.slip_url ? (
                                                    <a 
                                                        href={`http://localhost:3001${p.slip_url}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ color: '#34a853', fontWeight: 600, textDecoration: 'underline' }}
                                                    >
                                                        {p.slip_url}
                                                    </a>
                                                ) : (
                                                    <span style={{ color: '#9ca3af' }}>No Slip</span>
                                                )}
                                            </Td>
                                            <Td>{formatDate(p.payment_due_time)}</Td>
                                            <Td>{p.employee_id || 'E001'}</Td>
                                            <Td>
                                                <DropdownWrapper>
                                                    <StatusBadge
                                                        status={p.payment_status}
                                                        onClick={() => setOpenDropdownId(openDropdownId === p.payment_id ? null : p.payment_id)}
                                                    >
                                                        {statusOptions.find(opt => opt.value === p.payment_status)?.label || 'Pending'}
                                                        <ChevronDown size={14} />
                                                    </StatusBadge>
                                                    <DropdownContent show={openDropdownId === p.payment_id}>
                                                        {statusOptions.map(opt => (
                                                            <DropdownItem
                                                                key={opt.value}
                                                                color={opt.color}
                                                                onClick={() => handleStatusUpdate(p.payment_id, opt.value)}
                                                            >
                                                                {opt.label}
                                                            </DropdownItem>
                                                        ))}
                                                    </DropdownContent>
                                                </DropdownWrapper>
                                            </Td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <Td colSpan={7}>
                                            <EmptyState>No payments found.</EmptyState>
                                        </Td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </TableWrapper>
                )}
            </Card>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
