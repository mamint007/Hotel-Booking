import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { useRouter } from 'next/router';
import UserAuthGuard from "../components/UserAuthGuard";
import axios from "../helpers/axios";
import { Calendar, Users, Home, Star, X } from "lucide-react";
import Swal from 'sweetalert2';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding-top: 120px;
  padding-bottom: 60px;
`;

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
`;



const BookingCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BookingId = styled.span`
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ status?: string }>`
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => {
    if (props.status === 'U') return '#ef4444'; // Unpaid (Red)
    if (props.status === 'P') return '#f59e0b'; // Pending (Yellow)
    if (props.status === 'A') return '#10b981'; // Approved (Green)
    if (props.status === 'C') return '#ef4444'; // Cancelled (Red)
    if (props.status === 'I' || props.status === 'O') return '#6366f1'; // Check-In/Out (Indigo)
    return '#10b981';
  }};
  color: white;
  display: inline-block;
  white-space: nowrap;
`;

const PayNowButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 8px;

  &:hover {
    background-color: #388E3C;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 8px;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 24px;
  padding: 32px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SuccessModalContent = styled(ModalContent)`
  max-width: 380px;
  text-align: center;
  padding: 48px 32px;
`;

const ModalHeader = styled.h2`
  text-align: center;
  color: #4CAF50;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const BankInfoBox = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  text-align: center;
  margin-bottom: 24px;
  background: #fafafa;

  p {
    font-size: 15px;
    color: #374151;
    margin: 4px 0;
    line-height: 1.6;
  }
`;

const CountdownBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #f3f4f6;
  margin-bottom: 24px;
`;

const SlipLabel = styled.div`
  font-weight: 700;
  color: #4CAF50;
  font-size: 18px;
  margin-bottom: 4px;
`;

const SlipHint = styled.p`
  color: #9ca3af;
  font-size: 11px;
  margin-bottom: 12px;
`;

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const ChooseFileButton = styled.label`
  background-color: #f3f4f6;
  color: #6b7280;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  white-space: nowrap;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const FileName = styled.span`
  font-size: 12px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HiddenInput = styled.input`
  display: none;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
  
  &:hover {
    color: #374151;
  }
`;

const ConfirmPayButton = styled.button`
  width: 100%;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background-color: #388E3C;
  }
  
  &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
  }
`;

const SuccessTitle = styled.h2`
  color: #4CAF50;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SuccessText = styled.p`
  color: #6b7280;
  font-size: 18px;
  line-height: 1.4;
  margin: 0;
`;

const SuccessDivider = styled.div`
  height: 1px;
  background-color: #f3f4f6;
  margin: 16px 0;
`;

const ReviewLink = styled.a`
  font-size: 12px;
  color: #9ca3af;
  text-decoration: underline;
  cursor: pointer;
  margin-right: 12px;
  
  &:hover {
    color: #4CAF50;
  }
`;

// Review Modal Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalTitle = styled.h2`
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  color: #34a853;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 8px;
`;

const StarButton = styled.button<{ $active: boolean; $hovered: boolean }>`
  background: none;
  border: 1px solid ${p => (p.$active || p.$hovered ? "#34a853" : "#e5e7eb")};
  border-radius: 8px;
  padding: 12px;
  color: ${p => (p.$active || p.$hovered ? "#34a853" : "#d1d5db")};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    border-color: #34a853;
    color: #34a853;
    background-color: #f0fdf4;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #34a853;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
`;

const GhostButton = styled.button`
  flex: 1;
  background: none;
  border: 1px solid #e5e7eb;
  color: #9ca3af;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    color: #6b7280;
  }
`;

const SubmitBtn = styled.button`
  flex: 1;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CardBody = styled.div`
  display: flex;
  gap: 24px;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const RoomImage = styled.div<{ src?: string }>`
  width: 180px;
  height: 135px;
  border-radius: 10px;
  background-image: url('${p => p.src || ""}');
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  border: 1px solid #f3f4f6;
`;

const InfoSection = styled.div`
  flex: 1;
`;

const RoomName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 4px;
`;

const LinkText = styled.a`
  font-size: 12px;
  color: #9ca3af;
  text-decoration: underline;
  cursor: pointer;
  display: block;
  margin-bottom: 12px;
  
  &:hover {
    color: #4CAF50;
  }
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 6px;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
  font-weight: 600;
`;

const TotalLabel = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const TotalValue = styled.span`
  color: #374151;
  font-size: 16px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 40px;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: white;
  border-radius: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  max-width: 600px;
  margin: 0 auto;
`;

const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  background: #f0fdf4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4CAF50;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  text-align: center;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
  text-align: center;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 14px 40px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(76, 175, 80, 0.3);

  &:hover {
    background: #43A047;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function BookPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showQRModal, setShowQRModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Review Modal State
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/bookings/my-bookings');
      if (res.data && res.data.res_code === '0000') {
        setBookings(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch bookings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!timerStarted) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted]);

  const handlePayNow = (b: any) => {
    setSelectedBooking(b);
    
    const payment = b.payments?.[0];
    if (payment && payment.remaining_seconds !== undefined) {
      setCountdown(payment.remaining_seconds);
      setTimerStarted(true);
    } else if (payment && (payment.payment_due_time || b.create_datetime)) {
      // Robust fallback logic (legacy/safety)
      let deadlineStr = payment.payment_due_time || b.create_datetime;
      let dueTime: number;
      if (!payment.payment_due_time) {
        dueTime = new Date(b.create_datetime).getTime() + 24 * 60 * 60 * 1000;
      } else {
        let dStr = deadlineStr;
        if (typeof dStr === 'string' && !dStr.endsWith('Z') && !dStr.includes('+')) {
          dStr = dStr.replace(' ', 'T') + 'Z';
        }
        dueTime = new Date(dStr).getTime();
        const createTime = new Date(b.create_datetime).getTime();
        if (dueTime - createTime < 20 * 60 * 60 * 1000) {
            dueTime = createTime + 24 * 60 * 60 * 1000;
        }
      }
      const now = new Date().getTime();
      setCountdown(Math.max(0, Math.floor((dueTime - now) / 1000)));
      setTimerStarted(true);
    }
    setShowQRModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!paymentSlip || !selectedBooking) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('booking_id', selectedBooking.booking_id);
      formData.append('payment_slip', paymentSlip);

      const res = await axios.post('/bookings/submit-payment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data && res.data.res_code === '0000') {
        setShowQRModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          fetchBookings(); // Refresh list
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'Something went wrong.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (booking_id: string) => {
    const result = await Swal.fire({
      title: 'ยกเลิกการจอง?',
      text: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ยืนยันการยกเลิก',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post('/bookings/cancel', { booking_id });
        if (res.data && res.data.res_code === '0000') {
          Swal.fire({
            icon: 'success',
            title: 'Cancelled!',
            text: 'การจองของคุณถูกยกเลิกเรียบร้อยแล้ว',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            router.push('/'); // Redirect to Home
          }, 1500);
          // fetchBookings(); // No need to refresh since we redirect
        }
      } catch (error) {
        console.error('Cancel Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'ไม่สามารถยกเลิกการจองได้ กรุณาลองใหม่อีกครั้ง'
        });
      }
    }
  };

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h} hrs ${m} min ${s} sec`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getImageUrl = (path?: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3270&auto=format&fit=crop';
    return `http://localhost:3001${path}`;
  };

  return (
    <UserAuthGuard>
      <Navbar />
      <Container>
        <Wrapper>
          <PageTitle>Your Booking</PageTitle>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <EmptyState>
              <IconWrapper>
                <Home size={44} />
              </IconWrapper>
              <EmptyTitle>ยังไม่มีรายการจองห้องพัก</EmptyTitle>
              <EmptyText>ขณะนี้คุณยังไม่มีประวัติการจองในระบบค่ะ เริ่มต้นเลือกห้องพักที่ถูกใจคุณได้ที่หน้าจองห้องพักนะคะ</EmptyText>
              <ActionButton onClick={() => router.push('/room')}>
                จองห้องพักตอนนี้
              </ActionButton>
            </EmptyState>
          ) : (
            bookings.map((booking) => {
              const detail = booking.booking_details?.[0];
              const room = detail?.room;
              return (
                <BookingCard key={booking.booking_id}>
                  <CardHeader>
                    <div>
                      <BookingId># {booking.booking_id}</BookingId>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        จองเมื่อวันที่: {formatDate(booking.create_datetime)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {booking.booking_status === 'O' && booking.is_review !== 'Y' && (
                        <ReviewLink onClick={() => {
                          setSelectedBookingId(booking.booking_id);
                          setShowReview(true);
                        }}>Add Your Room Review</ReviewLink>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <StatusBadge status={booking.booking_status}>
                          {booking.booking_status === 'U' ? 'Unpaid' : 
                           booking.booking_status === 'P' ? 'Pending' : 
                           booking.booking_status === 'A' ? 'Approved' : 
                           booking.booking_status === 'C' ? 'Cancelled' : 
                           booking.booking_status === 'I' ? 'Check-In' : 
                           booking.booking_status === 'O' ? 'Check-Out' : 'Approved'}
                        </StatusBadge>
                        {booking.booking_status === 'U' && (
                          <>
                            <CancelButton onClick={() => handleCancelBooking(booking.booking_id)}>Cancel</CancelButton>
                            <PayNowButton onClick={() => handlePayNow(booking)}>Pay Now</PayNowButton>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody>
                    <RoomImage src={getImageUrl(room?.room_image)} />
                    <InfoSection>
                      <RoomName>
                        {room?.room_type?.room_type_name || 'Room'} {room?.room_number}, {room?.bed_type === 'S' ? 'Single' : 'Double'} Beds
                      </RoomName>

                      <DetailRow>
                        <Calendar size={14} />
                        {booking.stay_details ? (
                          `${formatDate(booking.stay_details.checkin_date)} - ${formatDate(booking.stay_details.checkout_date)}`
                        ) : (
                          'No dates specified'
                        )}
                      </DetailRow>

                      <DetailRow>
                        <Users size={14} />
                        1 Room, {room?.max_guest || booking.number_of_guests || 2} people
                      </DetailRow>
                    </InfoSection>
                  </CardBody>

                  <TotalSection>
                    <TotalLabel>Total :</TotalLabel>
                    <TotalValue>{parseFloat(detail?.price_at_booking || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} THB</TotalValue>
                  </TotalSection>
                </BookingCard>
              );
            })
          )}
        </Wrapper>

        {showQRModal && (
          <ModalOverlay onClick={() => !submitting && setShowQRModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => !submitting && setShowQRModal(false)}>×</CloseButton>
              <ModalHeader>Payment</ModalHeader>

              <BankInfoBox>
                <p>ชื่อบัญชี : โรงแรมออนไลน์</p>
                <p>เลขบัญชี : 123-456-7890</p>
              </BankInfoBox>

              <Divider />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <SlipLabel style={{ marginBottom: 0 }}>Slip</SlipLabel>
                <CountdownBadge>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {formatCountdown(countdown)}
                </CountdownBadge>
              </div>
              <SlipHint>โปรดแนบสลิปการโอนเงิน</SlipHint>
              <FileInputWrapper>
                <ChooseFileButton htmlFor="slip-upload">Choose Files</ChooseFileButton>
                <FileName>{paymentSlip ? paymentSlip.name : 'No file chosen'}</FileName>
                <HiddenInput
                  id="slip-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPaymentSlip(e.target.files[0]);
                    }
                  }}
                />
              </FileInputWrapper>

              <ConfirmPayButton onClick={handleConfirmPayment} disabled={submitting || !paymentSlip}>
                {submitting ? 'Processing...' : 'ชำระเงิน'}
              </ConfirmPayButton>
            </ModalContent>
          </ModalOverlay>
        )}

        {showSuccessModal && (
          <ModalOverlay>
            <SuccessModalContent>
              <SuccessTitle>THANK YOU</SuccessTitle>
              <SuccessDivider />
              <SuccessText>
                Payment verification<br />in progress
              </SuccessText>
            </SuccessModalContent>
          </ModalOverlay>
        )}
      </Container>
      
      {showReview && (
        <Overlay onClick={() => !isSubmitting && setShowReview(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowReview(false)}>
              <X size={20} />
            </CloseButton>
            
            <ModalTitle>Rate Our Room</ModalTitle>
            
            <FormGroup>
              <Label>Your Rating</Label>
              <StarContainer>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarButton
                    key={star}
                    $active={star <= rating}
                    $hovered={star <= hoverRating}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    type="button"
                  >
                    <Star 
                      size={24} 
                      fill={(star <= rating || star <= hoverRating) ? "currentColor" : "none"} 
                    />
                  </StarButton>
                ))}
              </StarContainer>
            </FormGroup>
            
            <FormGroup>
              <Label>Room Review</Label>
              <TextArea 
                placeholder="Share your experience staying with us..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </FormGroup>
            
            <ModalFooter>
              <GhostButton onClick={() => setShowReview(false)}>Cancel</GhostButton>
              <SubmitBtn 
                disabled={rating === 0 || isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    // Placeholder for actual submission
                    const res = await axios.post('/bookings/review', {
                      booking_id: selectedBookingId,
                      rating,
                      review_text: reviewText
                    });
                    
                    if (res.data && res.data.res_code === '0000') {
                      Swal.fire({
                        icon: 'success',
                        title: 'Thank You!',
                        text: 'Your review has been submitted successfully.',
                        confirmButtonColor: '#10b981'
                      });
                      setShowReview(false);
                      setRating(0);
                      setReviewText("");
                      fetchBookings(); // Refresh to update is_review status
                    }
                  } catch (e) {
                    console.error("Submission failed", e);
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong. Please try again later.'
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </SubmitBtn>
            </ModalFooter>
          </ModalContainer>
        </Overlay>
      )}
    </UserAuthGuard>
  );
}
