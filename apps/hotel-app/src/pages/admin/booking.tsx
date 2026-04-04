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
    stay_details?: {
        stay_id: string;
        checkin_date: string;
        checkout_date: string;
    };
}

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
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
`;

const ChargeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none;
  }
`;

const ChargeButton = styled.button<{ $added?: boolean }>`
  background-color: ${p => p.$added ? '#ef4444' : '#10b981'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export default function Booking() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // Additional Charges State
    const [showChargesModal, setShowChargesModal] = useState(false);
    const [selectedStayId, setSelectedStayId] = useState<string | null>(null);
    const [allCharges, setAllCharges] = useState<any[]>([]);
    const [stayCharges, setStayCharges] = useState<string[]>([]);
    const [initialStayCharges, setInitialStayCharges] = useState<string[]>([]);
    const [loadingCharges, setLoadingCharges] = useState(false);
    const [savingCharges, setSavingCharges] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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

    const handleOpenCharges = async (stay_id: string | undefined) => {
        if (!stay_id) {
            Swal.fire({ icon: 'warning', title: 'No Stay ID', text: 'This booking has no stay details yet.' });
            return;
        }
        setSelectedStayId(stay_id);
        setShowChargesModal(true);
        setLoadingCharges(true);
        try {
            const res = await axios.get(`/admin/stays/${stay_id}/charges`);
            if (res.data && res.data.res_code === '0000') {
                setAllCharges(res.data.data.all_charges);
                const addedIds = res.data.data.added_charges.map((ac: any) => ac.charge_id);
                setStayCharges(addedIds);
                setInitialStayCharges(addedIds);
            }
        } catch (error) {
            console.error("Failed to fetch charges", error);
        } finally {
            setLoadingCharges(false);
        }
    };

    const handleSaveCharges = async () => {
        if (!selectedStayId) return;
        setSavingCharges(true);
        try {
            const toAdd = stayCharges.filter(id => !initialStayCharges.includes(id));
            const toRemove = initialStayCharges.filter(id => !stayCharges.includes(id));

            for (const id of toAdd) {
                await axios.post(`/admin/stays/${selectedStayId}/charges`, { charge_id: id });
            }
            for (const id of toRemove) {
                await axios.delete(`/admin/stays/${selectedStayId}/charges/${id}`);
            }

            setInitialStayCharges(stayCharges);
            Swal.fire({ icon: 'success', title: 'Saved', text: 'Charges saved successfully', timer: 1500, showConfirmButton: false });
        } catch (error) {
            console.error("Failed to save charges", error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save charges' });
        } finally {
            setSavingCharges(false);
        }
    };

    const handlePayCharges = () => {
        setShowPaymentModal(true);
    };

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
                                        <Th>Charges</Th>
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
                                                    <button 
                                                        onClick={() => {
                                                            if (b.booking_status !== 'I') {
                                                                Swal.fire({
                                                                    icon: 'warning',
                                                                    title: 'Not Available',
                                                                    text: 'สามารถจัดการค่าใช้จ่ายเพิ่มเติมได้เฉพาะรายการที่ทำการ Check-In แล้วเท่านั้น'
                                                                });
                                                                return;
                                                            }
                                                            handleOpenCharges(b.stay_details?.stay_id);
                                                        }}
                                                        style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                                                    >
                                                        Manage
                                                    </button>
                                                </Td>
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

                {showChargesModal && (
                    <ModalOverlay onClick={() => setShowChargesModal(false)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <CloseButton onClick={() => setShowChargesModal(false)}>&times;</CloseButton>
                            <h3 style={{ marginBottom: '20px', color: '#1f2937', fontWeight: 600 }}>Manage Additional Charges</h3>
                            {loadingCharges ? (
                                <p>Loading...</p>
                            ) : allCharges.length > 0 ? (
                                <>
                                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '20px' }}>
                                        {allCharges.map(charge => {
                                            const isChecked = stayCharges.includes(charge.charge_id);
                                            return (
                                                <ChargeItem key={charge.charge_id}>
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) setStayCharges(prev => [...prev, charge.charge_id]);
                                                                    else setStayCharges(prev => prev.filter(id => id !== charge.charge_id));
                                                                }}
                                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                            />
                                                            {charge.charge_name}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#6b7280', marginLeft: '24px' }}>
                                                            {parseFloat(charge.charge_amount).toLocaleString()} THB
                                                        </div>
                                                    </div>
                                                </ChargeItem>
                                            );
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 600, color: '#374151', fontSize: '15px' }}>
                                            Total: {allCharges.filter(c => stayCharges.includes(c.charge_id)).reduce((sum, c) => sum + parseFloat(c.charge_amount), 0).toLocaleString()} THB
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button 
                                                onClick={handlePayCharges}
                                                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                                            >
                                                Pay
                                            </button>
                                            <button 
                                                onClick={handleSaveCharges}
                                                disabled={savingCharges}
                                                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#34a853', fontWeight: 600, color: 'white', cursor: savingCharges ? 'not-allowed' : 'pointer', opacity: savingCharges ? 0.7 : 1 }}
                                            >
                                                {savingCharges ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p>No additional charges available.</p>
                            )}
                        </ModalContent>
                    </ModalOverlay>
                )}

                {showPaymentModal && (() => {
                    const selectedChargesList = allCharges.filter(c => stayCharges.includes(c.charge_id));
                    const totalSelectedSum = selectedChargesList.reduce((sum, c) => sum + parseFloat(c.charge_amount), 0);

                    return (
                        <ModalOverlay onClick={() => setShowPaymentModal(false)}>
                            <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
                                <CloseButton onClick={() => setShowPaymentModal(false)}>&times;</CloseButton>
                                <h2 style={{ color: '#4CAF50', marginBottom: '24px', fontWeight: 700 }}>Payment</h2>
                                
                                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '20px' }}>
                                    <p style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '15px' }}>ชื่อบัญชี : โรงแรมออนไลน์</p>
                                    <p style={{ margin: 0, color: '#4b5563', fontSize: '15px' }}>เลขบัญชี : 123-456-7890</p>
                                </div>

                                {selectedChargesList.length > 0 && (
                                    <div style={{ textAlign: 'left', marginBottom: '0px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                        <h4 style={{ margin: '0 0 12px 0', color: '#166534', fontSize: '15px' }}>รายการที่ต้องชำระ:</h4>
                                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#15803d', fontSize: '14px', marginBottom: '12px' }}>
                                            {selectedChargesList.map(c => (
                                                <li key={c.charge_id} style={{ marginBottom: '4px' }}>
                                                    {c.charge_name} <span style={{ float: 'right' }}>{parseFloat(c.charge_amount).toLocaleString()} THB</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div style={{ borderTop: '1px dashed #86efac', paddingTop: '12px', fontWeight: 700, color: '#166534', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>ยอดรวมทั้งหมด</span>
                                            <span>{totalSelectedSum.toLocaleString()} THB</span>
                                        </div>
                                    </div>
                                )}
                            </ModalContent>
                        </ModalOverlay>
                    );
                })()}
            </AdminLayout>
        </AdminAuthGuard>
    );
}
