import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import UserAuthGuard from "../components/UserAuthGuard";
import axios from "../helpers/axios";
import Swal from 'sweetalert2';

// Styled Components (Reusing some from booking, adapting for Payment)
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding-top: 120px;
  padding-bottom: 40px;
`;

const Wrapper = styled.div`
  max-width: 800px; /* Narrower for payment card */
  margin: 0 auto;
  padding: 0 24px;
`;

const StepperContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  align-items: center;
`;

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: ${(p) => (p.active ? "#4CAF50" : p.completed ? "#4CAF50" : "#d1d5db")};
  position: relative;
  z-index: 1;
`;

const StepCircle = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(p) => (p.active || p.completed ? "#4CAF50" : "#f3f4f6")};
  color: ${(p) => (p.active || p.completed ? "white" : "#9ca3af")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
`;

const StepLine = styled.div<{ active?: boolean }>`
  height: 2px;
  flex: 1;
  background-color: ${(p) => (p.active ? "#4CAF50" : "#e5e7eb")};
  margin: 0 10px;
  position: relative;
  top: -14px;
  max-width: 150px;
  width: 100px;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #4CAF50;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
`;

const RoomSummary = styled.div`
  display: flex;
  gap: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const RoomImage = styled.div<{ src?: string }>`
  width: 180px;
  height: 140px;
  border-radius: 12px;
  background-color: #e5e7eb;
  background-image: url('${p => p.src || ""}');
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  
  @media (max-width: 640px) {
      width: 100%;
      height: 200px;
  }
`;

const RoomDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RoomName = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const RoomMeta = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 6px;
  line-height: 1.5;
`;

const PriceSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  background-color: #fcfcfc;
`;

const PriceHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
`;

const PriceRow = styled.div<{ total?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${p => p.total ? "0" : "12px"};
  padding-top: ${p => p.total ? "16px" : "0"};
  border-top: ${p => p.total ? "1px solid #e5e7eb" : "none"};
  
  span:first-child {
    color: ${p => p.total ? "#4CAF50" : "#6b7280"};
    font-weight: ${p => p.total ? "700" : "400"};
    font-size: ${p => p.total ? "18px" : "14px"};
  }
  
  span:last-child {
    color: ${p => p.total ? "#4CAF50" : "#1f2937"};
    font-weight: ${p => p.total ? "700" : "500"};
    font-size: ${p => p.total ? "18px" : "14px"};
  }
`;

const PayButton = styled.button`
  width: 100%;
  max-width: 300px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  margin: 32px auto 0;
  display: block;
  
  &:hover {
    background-color: #388E3C;
  }
  
  &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
  }
`;

export default function PaymentPage() {
    const router = useRouter();
    const { roomId, checkIn, checkOut, guests, paymentType } = router.query;
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (router.isReady && roomId) {
            fetchRoom(roomId as string);
        } else if (router.isReady && !roomId) {
            // Redirect back if no roomId
            // router.push('/'); // Optional: redirect safety
        }
    }, [router.isReady, roomId]);

    const fetchRoom = async (id: string) => {
        try {
            // Reuse the mock/filter logic or API
            const res = await axios.get('/rooms');
            if (res.data && res.data.res_code === '0000') {
                const found = res.data.data.find((r: any) => r.room_id === id);
                setRoom(found);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (path?: string) => {
        if (!path) return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3270&auto=format&fit=crop';
        return `http://localhost:3001${path}`;
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) return <Container><div style={{ textAlign: 'center' }}>Loading...</div></Container>;
    if (!room) return <Container><div style={{ textAlign: 'center' }}>Room not found or Invalid Booking Details</div></Container>;

    // Calculation
    const start = checkIn ? new Date(checkIn as string) : new Date();
    const end = checkOut ? new Date(checkOut as string) : new Date(new Date().setDate(new Date().getDate() + 1));

    let nights = 0;
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = end.getTime() - start.getTime();
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    if (nights < 1) nights = 1;

    const price = parseFloat(room.price_per_night);
    const total = price * nights;

    const handlePayment = async () => {
        setSubmitting(true);
        try {
            // Prepare payload
            const payload = {
                room_id: room.room_id,
                check_in_date: checkIn,
                check_out_date: checkOut,
                number_of_nights: nights,
                total_price: total,
                number_of_guests: guests || 1,
                payment_type: 'PAY' // Or derived from previous step
            };

            const res = await axios.post('/bookings', payload);

            if (res.data && res.data.res_code === '0000') {
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: 'Your booking has been confirmed!',
                    confirmButtonColor: '#4CAF50'
                }).then(() => {
                    // Redirect to Success Page or Home
                    // router.push('/booking/success');
                    router.push('/dashboard'); // Or wherever
                });
            }
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: error?.response?.data?.res_desc || 'Something went wrong.',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <UserAuthGuard>
            <Navbar />
            <Container>
                <Wrapper>
                    <StepperContainer>
                        <Step completed>
                            <StepCircle completed>1</StepCircle>
                            <span>Booking</span>
                        </Step>
                        <StepLine active />
                        <Step active>
                            <StepCircle active>2</StepCircle>
                            <span>Payment</span>
                        </Step>
                        <StepLine />
                        <Step>
                            <StepCircle>3</StepCircle>
                            <span>Success</span>
                        </Step>
                    </StepperContainer>

                    <ContentCard>
                        <PageTitle>Check Out</PageTitle>

                        <RoomSummary>
                            <RoomImage src={getImageUrl(room.room_image)} />
                            <RoomDetails>
                                <RoomName>{room.room_type?.room_type_name || 'Room'} {room.room_number}</RoomName>
                                <RoomMeta>
                                    {room.room_type?.room_type_name}, {room.bed_type === 'S' ? 'Single' : 'Double'} Beds<br />
                                    1 Room, {room.max_guest} People, {nights} Night{nights > 1 ? 's' : ''}
                                </RoomMeta>
                                <RoomMeta>
                                    {formatDate(checkIn as string)} - {formatDate(checkOut as string)}
                                </RoomMeta>
                            </RoomDetails>
                        </RoomSummary>

                        <PriceSection>
                            <PriceHeader>ราคาที่จ่าย</PriceHeader>
                            <PriceRow>
                                <span>ประเภทการจ่ายเงิน</span>
                                <span>{paymentType === 'PTH' ? 'จ่ายมัดจำ' : 'จ่ายเต็ม'}</span>
                            </PriceRow>
                            <PriceRow>
                                <span>ราคาที่พัก ({nights} คืน)</span>
                                <span>THB {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </PriceRow>
                            <PriceRow>
                                <span>ค่าธรรมเนียมการจอง</span>
                                <span>ฟรี</span>
                            </PriceRow>
                            <PriceRow total>
                                <span>ราคาที่จ่าย</span>
                                <span>THB {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </PriceRow>
                        </PriceSection>

                        <PayButton onClick={handlePayment} disabled={submitting}>
                            {submitting ? 'Processing...' : 'ชำระเงิน'}
                        </PayButton>

                    </ContentCard>
                </Wrapper>
            </Container>
        </UserAuthGuard>
    );
}
