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
    if (props.status === 'P') return '#f59e0b';
    if (props.status === 'A') return '#10b981';
    if (props.status === 'C') return '#ef4444'; // Cancelled
    if (props.status === 'I' || props.status === 'O') return '#6366f1'; // Check-In/Out
    return '#10b981';
  }};
  color: white;
  text-transform: capitalize;
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

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover {
    color: #4b5563;
  }
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
                      <StatusBadge status={booking.booking_status}>
                        {booking.booking_status === 'P' ? 'Pending' : 
                         booking.booking_status === 'A' ? 'Approved' : 
                         booking.booking_status === 'C' ? 'Cancelled' : 
                         booking.booking_status === 'I' ? 'Check-In' : 
                         booking.booking_status === 'O' ? 'Check-Out' : 'Approved'}
                      </StatusBadge>
                    </div>
                  </CardHeader>

                  <CardBody>
                    <RoomImage src={getImageUrl(room?.room_image)} />
                    <InfoSection>
                      <RoomName>
                        {room?.room_type?.room_type_name || 'Room'} {room?.room_number}, {room?.bed_type === 'S' ? 'Single' : 'Double'} Beds
                      </RoomName>
                      <LinkText>More Details</LinkText>

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
                        1 Room, {booking.number_of_guests || 2} people
                      </DetailRow>

                      <LinkText style={{ marginTop: '8px' }}>Edit Booking Details</LinkText>
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
