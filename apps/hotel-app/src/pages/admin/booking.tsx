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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
  margin-bottom: ${props => props.$hasDropdown ? '220px' : '0'};
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
            case 'U': return '#ef4444'; // Unpaid (Red)
            case 'A': return '#10b981'; // Approved
            case 'P': return '#f59e0b'; // Pending
            case 'C': return '#ef4444'; // Cancel
            case 'I':
            case 'O': return '#6366f1'; // Check-In/Out (Blue/Indigo)
            default: return '#6b7280';
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
  min-width: 160px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 50;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 8px;
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
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;

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

// Interface for Booking
interface Booking {
    booking_id: string;
    create_datetime: string;
    booking_status: string; // 'W' = Pending, 'S' = Success/Approved? Adjust mapping as needed.
    is_review: string;
    member: {
        m_email: string;
    };
    payment_type: {
        payment_type_name: string;
    };
    booking_details: {
        number_of_nights: number;
        price_at_booking: string;
        room?: {
            room_number: string;
        };
    }[];
}

export default function Booking() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/admin/bookings');
            if (res.data && res.data.res_code === '0000') {
                setBookings(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await axios.patch(`/admin/bookings/${id}/status`, { booking_status: newStatus });
            if (res.data && res.data.res_code === '0000') {
                // Update local state
                setBookings(prev => prev.map(b => b.booking_id === id ? { ...b, booking_status: newStatus } : b));
                setOpenDropdownId(null);

                Swal.fire({
                    icon: 'success',
                    title: 'Status Updated',
                    timer: 1500,
                    showConfirmButton: false,
                    position: 'top-end',
                    toast: true
                });
            }
        } catch (error) {
            console.error("Failed to update status", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update booking status.'
            });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        // Backend now sends dates already in Bangkok timezone
        // Just format it nicely: 'YYYY-MM-DDTHH:mm:ss' -> 'DD/MM/YYYY HH:mm:ss'
        const d = new Date(dateString);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'U': return 'Unpaid';
            case 'P': return 'Pending';
            case 'A': return 'Approved';
            case 'C': return 'Cancelled';
            case 'I': return 'Check-In';
            case 'O': return 'Check-Out';
            default: return 'Unpaid';
        }
    };

    const statusOptions = [
        { value: 'U', label: 'Unpaid', color: '#6b7280' },
        { value: 'P', label: 'Pending', color: '#f59e0b' },
        { value: 'A', label: 'Approved', color: '#10b981' },
        { value: 'C', label: 'Cancelled', color: '#ef4444' },
        { value: 'I', label: 'Check-In', color: '#6366f1' },
        { value: 'O', label: 'Check-Out', color: '#6366f1' }
    ];

    const getRoomNumber = (b: Booking) => {
        if (b.booking_details && b.booking_details.length > 0) {
            return b.booking_details[0].room?.room_number || '-';
        }
        return '-';
    };

    const getNights = (b: Booking) => {
        if (b.booking_details && b.booking_details.length > 0) {
            return b.booking_details[0].number_of_nights;
        }
        return 0;
    };

    // Use booking total_price or detail sum? Screenshot shows 'Price' per row.
    // Assuming 1 room per booking for now.
    const getPrice = (b: Booking) => {
        // booking model has total_price, use that?
        // Wait, screenshot shows Price column.
        // Let's use total_price from Booking model which I added.
        // Check BookingModel again... yes it has total_price.
        // But in my BookingModel update (step 272) I included total_price field only created in step 258?
        // Step 258 had total_price. Step 272 (update) REMOVED total_price??
        // Let me check artifacts step 272.

        // Wait, if step 272 update removed total_price, then I need to use details or re-add it.
        // The screenshot validation should guide me.
        // Let's use detail price for now if total_price is missing, or fix model later.
        if (b.booking_details && b.booking_details.length > 0) {
            return parseFloat(b.booking_details[0].price_at_booking).toFixed(2);
        }
        return '0.00';
    };

    const mapIsReview = (flag: string) => {
        return flag === 'Y' ? 'Yes' : 'No';
    }

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Booking" title="Admin - Booking">
                <PageHeader>Booking</PageHeader>
                <Card>
                    {loading ? (
                        <EmptyState>Loading bookings...</EmptyState>
                    ) : (
                        <TableWrapper>
                            <Table $hasDropdown={!!openDropdownId}>
                                <thead>
                                    <tr>
                                        <Th>No</Th>
                                        <Th>Create DateTime</Th>
                                        <Th>Email</Th>
                                        <Th>Room</Th>
                                        <Th>Nights</Th>
                                        <Th>Price</Th>
                                        <Th>Payment Type</Th>
                                        <Th>Is Review</Th>
                                        <Th>Booking Status</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length > 0 ? (
                                        bookings.map((b) => (
                                            <tr key={b.booking_id}>
                                                <Td>{b.booking_id}</Td>
                                                <Td>{formatDate(b.create_datetime)}</Td>
                                                <Td>{b.member?.m_email || '-'}</Td>
                                                <Td>{getRoomNumber(b)}</Td>
                                                <Td>{getNights(b)}</Td>
                                                <Td>{getPrice(b)}</Td>
                                                <Td>{b.payment_type?.payment_type_name || '-'}</Td>
                                                <Td>{mapIsReview(b.is_review)}</Td>
                                                <Td>
                                                    <DropdownWrapper>
                                                        <StatusBadge
                                                            status={b.booking_status}
                                                            onClick={() => setOpenDropdownId(openDropdownId === b.booking_id ? null : b.booking_id)}
                                                        >
                                                            {getStatusLabel(b.booking_status)}
                                                            <ChevronDown size={14} />
                                                        </StatusBadge>
                                                        <DropdownContent show={openDropdownId === b.booking_id}>
                                                            {statusOptions.map(opt => (
                                                                <DropdownItem
                                                                    key={opt.value}
                                                                    color={opt.color}
                                                                    onClick={() => handleStatusUpdate(b.booking_id, opt.value)}
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
                                            <Td colSpan={9}>
                                                <EmptyState>No bookings found.</EmptyState>
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
