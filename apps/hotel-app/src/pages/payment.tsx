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

  svg {
    flex-shrink: 0;
  }
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

export default function PaymentPage() {
  const router = useRouter();
  const { roomId, checkIn, checkOut, guests, paymentType, discountAmount, selectedCharges } = router.query;
  const roomIdStr = Array.isArray(roomId) ? roomId[0] : roomId;
  const checkInStr = Array.isArray(checkIn) ? checkIn[0] : checkIn;
  const checkOutStr = Array.isArray(checkOut) ? checkOut[0] : checkOut;
  const guestsStr = Array.isArray(guests) ? guests[0] : guests;
  const discountStr = Array.isArray(discountAmount) ? discountAmount[0] : (discountAmount || '0');
  const selectedChargesStr = Array.isArray(selectedCharges) ? selectedCharges[0] : selectedCharges;

  const [additionalCharges, setAdditionalCharges] = useState<any[]>([]);

  useEffect(() => {
    if (selectedChargesStr) {
      try {
        setAdditionalCharges(JSON.parse(selectedChargesStr));
      } catch (e) {
        console.error("Failed to parse selectedCharges", e);
      }
    }
  }, [selectedChargesStr]);
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [countdown, setCountdown] = useState(24 * 60 * 60); // 24 hours in seconds
  const [timerStarted, setTimerStarted] = useState(false);

  // Start timer once when modal opens for the first time
  useEffect(() => {
    if (showQRModal && !timerStarted) {
      setTimerStarted(true);
    }
  }, [showQRModal, timerStarted]);

  // Keep timer running in background once started
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

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h} hrs ${m} min ${s} sec`;
  };

  useEffect(() => {
    if (router.isReady && roomIdStr) {
      fetchRoom(roomIdStr);
    }
  }, [router.isReady, roomIdStr]);

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
  const start = checkInStr ? new Date(checkInStr) : new Date();
  const end = checkOutStr ? new Date(checkOutStr) : new Date(new Date().setDate(new Date().getDate() + 1));

  let nights = 0;
  if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
    const diffTime = end.getTime() - start.getTime();
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  if (nights < 1) nights = 1;

  const price = parseFloat(room.price_per_night);
  const chargesTotal = additionalCharges.reduce((acc, charge) => {
    const isPerNight = charge.charge_unit.toLowerCase().includes('คืน') || charge.charge_unit.toLowerCase().includes('night');
    const amount = parseFloat(charge.charge_amount);
    return acc + (isPerNight ? amount * nights : amount);
  }, 0);
  const total = price * nights + chargesTotal - parseFloat(discountStr);

  const handlePayment = () => {
    setShowQRModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentSlip(e.target.files[0]);
    }
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    try {
      let finalSlip = paymentSlip;

      // Mockup slip if not uploaded
      if (!finalSlip) {
        console.log("Using mockup slip...");
        const blob = new Blob(["mock-slip-content"], { type: "image/png" });
        finalSlip = new File([blob], "mock-slip.png", { type: "image/png" });
      }

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const memberId = user?.member_id || '';

      const formData = new FormData();
      formData.append('room_id', room.room_id);
      formData.append('check_in_date', checkInStr || '');
      formData.append('check_out_date', checkOutStr || '');
      formData.append('number_of_nights', nights.toString());
      formData.append('total_price', total.toString());
      formData.append('number_of_guests', (guestsStr || '1'));
      formData.append('payment_type', (paymentType as string) || 'PAY');
      formData.append('additional_charges', JSON.stringify(additionalCharges));
      formData.append('payment_slip', finalSlip);
      formData.append('member_id', memberId);
      // Using direct payload for now as per previous handlePayment, but with slip
      // If the backend expects FormData, this is correct. 
      // If it expects JSON, we might need a separate upload or Base64.
      // Based on typical patterns, FormData is used for file uploads.

      const res = await axios.post('/bookings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data && res.data.res_code === '0000') {
        setShowQRModal(false);
        setCurrentStep(3);
        setShowSuccessModal(true);
        
        // Auto redirect after 1.5 second
        setTimeout(() => {
          router.push('/');
        }, 1500);
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
            <Step completed={currentStep > 1} active={currentStep === 1}>
              <StepCircle completed={currentStep > 1} active={currentStep === 1}>1</StepCircle>
              <span>Booking</span>
            </Step>
            <StepLine active={currentStep >= 2} />
            <Step completed={currentStep > 2} active={currentStep === 2}>
              <StepCircle completed={currentStep > 2} active={currentStep === 2}>2</StepCircle>
              <span>Payment</span>
            </Step>
            <StepLine active={currentStep >= 3} />
            <Step completed={currentStep > 3} active={currentStep === 3}>
              <StepCircle completed={currentStep > 3} active={currentStep === 3}>3</StepCircle>
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
                  {formatDate(checkInStr)} - {formatDate(checkOutStr)}
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
                <span>THB {(price * nights).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </PriceRow>
              {additionalCharges.map((charge) => {
                const isPerNight = charge.charge_unit.toLowerCase().includes('คืน') || charge.charge_unit.toLowerCase().includes('night');
                const amount = parseFloat(charge.charge_amount);
                const lineTotal = isPerNight ? amount * nights : amount;
                return (
                  <PriceRow key={charge.charge_id}>
                    <span>{charge.charge_name} {isPerNight ? `(${nights} คืน)` : ''}</span>
                    <span>THB {lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </PriceRow>
                );
              })}
              <PriceRow>
                <span>ค่าธรรมเนียมการจอง</span>
                <span>ฟรี</span>
              </PriceRow>
              {parseFloat(discountStr) > 0 && (
                <PriceRow>
                  <span>ส่วนลด</span>
                  <span style={{ color: '#ef4444' }}>- THB {parseFloat(discountStr).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </PriceRow>
              )}
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

        {showQRModal && (
          <ModalOverlay onClick={() => !submitting && setShowQRModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => !submitting && setShowQRModal(false)}>×</CloseButton>
              <ModalHeader>Payment</ModalHeader>

              {/* Bank Account Info */}
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
                  onChange={handleFileChange}
                />
              </FileInputWrapper>

              <PayButton onClick={handleConfirmPayment} disabled={submitting}>
                {submitting ? 'Processing...' : 'ชำระเงิน'}
              </PayButton>
            </ModalContent>
          </ModalOverlay>
        )}
        {showSuccessModal && (
          <ModalOverlay onClick={() => router.push('/book')}>
            <SuccessModalContent onClick={(e) => e.stopPropagation()}>
              <SuccessTitle>THANK YOU</SuccessTitle>
              <SuccessDivider />
              <SuccessText>
                Payment verification<br />in progress
              </SuccessText>
            </SuccessModalContent>
          </ModalOverlay>
        )}
      </Container>
    </UserAuthGuard>
  );
}
