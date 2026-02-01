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
  font-size: 14px;
`;

const StatusBadge = styled.span<{ status: string }>`
  background-color: ${props => props.status === 'Approved' ? '#10b981' : '#f59e0b'};
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  display: inline-block;
  min-width: 80px;
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
                        <Table>
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
                                            <Td>{p.slip_url}</Td>
                                            <Td>{formatDate(p.payment_due_time)}</Td>
                                            <Td>{p.employee_id || 'E001'}</Td> {/* Fallback for mock/null */}
                                            <Td>
                                                <StatusBadge status={mapStatus(p.payment_status)}>
                                                    {mapStatus(p.payment_status)}
                                                </StatusBadge>
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
                    )}
                </Card>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
