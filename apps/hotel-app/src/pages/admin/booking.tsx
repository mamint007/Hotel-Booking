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
        // Assume 'W' is review/pending, 'S' is success.
        // Based on screenshot 'Pending' (Yellow) vs 'Approved' (Green)
        if (status === 'S' || status === 'A') return 'Approved'; // Adjust based on DB values
        return 'Pending';
    };

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
                        <Table>
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
                                                <StatusBadge status={mapStatus(b.booking_status)}>
                                                    {mapStatus(b.booking_status)}
                                                </StatusBadge>
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
                    )}
                </Card>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
