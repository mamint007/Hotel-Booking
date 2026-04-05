
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "../helpers/axios";
import { Calendar, Bed, Users, Wifi, Car, CreditCard, CheckCircle } from "lucide-react";
import UserAuthGuard from "../components/UserAuthGuard";
import Swal from 'sweetalert2';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding-top: 120px;
  padding-bottom: 40px;
`;

const Wrapper = styled.div`
  max-width: 1200px;
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
`;

const ContentGrid = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  width: 380px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const DateDisplay = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
`;

const DateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const DateIcon = styled.div`
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const DateInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
`;

const DateValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`;

const NightCount = styled.div`
  padding: 8px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
`;

const RoomCard = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const RoomImage = styled.div<{ src?: string }>`
  width: 160px;
  height: 120px;
  border-radius: 8px;
  background-color: #e5e7eb;
  background-image: url('${p => p.src || ""}');
  background-size: cover;
  background-position: center;
`;

const RoomInfo = styled.div`
  flex: 1;
`;

const RoomTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const RoomMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 14px;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
`;

const Tag = styled.span`
  background-color: #e8f5e9;
  color: #2e7d32;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 24px;
`;

const OptionBox = styled.div`
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
`;

const OptionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 16px;
  text-transform: uppercase;
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
`;

const SummaryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
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

const CouponInput = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  
  input {
    flex: 1;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
  }
`;

const NextButton = styled.button`
  width: 100%;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 24px;
  
  &:hover {
    background-color: #388E3C;
  }
`;

export default function BookingPage() {
  const router = useRouter();
  const { roomId, checkIn, checkOut } = router.query;
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [paymentType, setPaymentType] = useState('PAY');
  const [allAdditionalCharges, setAllAdditionalCharges] = useState<any[]>([]);
  const [selectedCharges, setSelectedCharges] = useState<any[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      if (checkIn) setCheckInDate(checkIn as string);
      else {
        const today = new Date();
        setCheckInDate(today.toISOString().split('T')[0]);
      }

      if (checkOut) setCheckOutDate(checkOut as string);
      else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setCheckOutDate(tomorrow.toISOString().split('T')[0]);
      }
    }
  }, [router.isReady, checkIn, checkOut]);

  useEffect(() => {
    if (roomId) {
      fetchRoom(roomId as string);
      fetchAdditionalCharges();
    }
  }, [roomId]);

  const fetchAdditionalCharges = async () => {
    try {
      const res = await axios.get('/rooms/additional-charges');
      if (res.data && res.data.res_code === '0000') {
        setAllAdditionalCharges(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };


  const fetchRoom = async (id: string) => {
    try {
      // Mocking fetch or using filter
      // For now, let's use the list endpoint and filter client side
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

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplying(true);
    try {
      const res = await axios.post('/rooms/validate-coupon', { couponCode }, {
        validateStatus: (status) => status < 500
      });
      if (res.data && res.data.res_code === '0000') {
        setAppliedPromo(res.data.data);
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: 'success',
          title: 'Coupon applied!'
        });
      } else {
        setAppliedPromo(null);
        
        // Show specific alert for quota exceeded
        if (res.data?.res_code === '1432') {
            Swal.fire({
              icon: 'warning',
              title: 'Limit Reached',
              text: res.data?.res_desc || 'You have already used this promotion.',
              confirmButtonColor: '#4CAF50'
            });
        } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res.data?.res_desc || 'Invalid coupon code',
            });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setApplying(false);
    }
  };

  const getImageUrl = (path?: string) => {

    if (!path) return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3270&auto=format&fit=crop';
    return `http://localhost:3001${path}`;
  };

  if (loading) return <Container><div style={{ textAlign: 'center' }}>Loading...</div></Container>;
  if (!room) return <Container><div style={{ textAlign: 'center' }}>Room not found</div></Container>;

  const price = parseFloat(room.price_per_night);

  // Calculate nights
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  let nights = 0;
  if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
    const diffTime = end.getTime() - start.getTime();
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  if (nights < 1) nights = 1;

  const total = price * nights;

  const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  };

  const chargesTotal = selectedCharges.reduce((acc, charge) => {
    const isPerNight = charge.charge_unit.toLowerCase().includes('คืน') || charge.charge_unit.toLowerCase().includes('night');
    const amount = parseFloat(charge.charge_amount);
    return acc + (isPerNight ? amount * nights : amount);
  }, 0);
  
  const discountAmount = appliedPromo ? parseFloat(appliedPromo.discount_value) : 0;
  const baseTotal = total + chargesTotal - discountAmount;
  const finalToPay = paymentType === 'PTH' ? baseTotal / 2 : baseTotal;

  return (
    <UserAuthGuard>
      <Navbar />
      <Container>
        <Wrapper>
          <StepperContainer>
            <Step active>
              <StepCircle active>1</StepCircle>
              <span>Booking</span>
            </Step>
            <StepLine />
            <Step>
              <StepCircle>2</StepCircle>
              <span>Payment</span>
            </Step>
            <StepLine />
            <Step>
              <StepCircle>3</StepCircle>
              <span>Success</span>
            </Step>
          </StepperContainer>

          <ContentGrid>
            <LeftColumn>
              <Section>
                <div style={{ display: 'flex', gap: 40 }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: 16, color: '#6b7280', fontSize: 12, textTransform: 'uppercase' }}>Check In</h4>
                    <DateBox>
                      <DateIcon><Calendar size={20} /></DateIcon>
                      <DateInfo>
                        <input
                          type="date"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          style={{ border: 'none', fontSize: '14px', fontWeight: 600, color: '#1f2937', background: 'transparent', outline: 'none' }}
                        />
                        <DateLabel>{getDayName(checkInDate)}</DateLabel>
                      </DateInfo>
                    </DateBox>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: 16, color: '#6b7280', fontSize: 12, textTransform: 'uppercase' }}>Check Out</h4>
                    <DateBox>
                      <DateIcon><Calendar size={20} /></DateIcon>
                      <DateInfo>
                        <input
                          type="date"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          style={{ border: 'none', fontSize: '14px', fontWeight: 600, color: '#1f2937', background: 'transparent', outline: 'none' }}
                        />
                        <DateLabel>{getDayName(checkOutDate)}</DateLabel>
                      </DateInfo>
                    </DateBox>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <NightCount><Bed size={16} /> {nights} Night{nights > 1 ? 's' : ''}</NightCount>
                  </div>
                </div>
              </Section>

              <Section>
                <RoomCard>
                  <RoomImage src={getImageUrl(room.room_image)} />
                  <RoomInfo>
                    <RoomTitle>{room.room_type?.room_type_name} {room.room_number}</RoomTitle>
                    <RoomMeta>
                      <span>1 Room, {room.max_guest} People</span>
                    </RoomMeta>
                    <TagList>
                      {room.amenities?.map((amenity: any, index: number) => (
                        <Tag key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {amenity.amenity_icon && (
                            <img
                              src={`/amentity/${amenity.amenity_icon}`}
                              alt={amenity.amenity_name}
                              width={14}
                              height={14}
                              style={{ objectFit: 'contain' }} // Ensure icon fits well
                            />
                          )}
                          {amenity.amenity_name}
                        </Tag>
                      ))}
                      {(!room.amenities || room.amenities.length === 0) && (
                        <Tag>No Amenities</Tag>
                      )}
                    </TagList>
                  </RoomInfo>
                </RoomCard>
              </Section>

              <OptionsContainer>
                <OptionBox>
                  <OptionTitle>Additional Charges</OptionTitle>
                  <CheckboxList>
                    {allAdditionalCharges.map((charge) => (
                      <CheckboxItem key={charge.charge_id}>
                        <input
                          type="checkbox"
                          checked={selectedCharges.some(c => c.charge_id === charge.charge_id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCharges([...selectedCharges, charge]);
                            } else {
                              setSelectedCharges(selectedCharges.filter(c => c.charge_id !== charge.charge_id));
                            }
                          }}
                        /> {charge.charge_name}
                      </CheckboxItem>
                    ))}
                  </CheckboxList>
                </OptionBox>

                <OptionBox>
                  <OptionTitle>Payment Type</OptionTitle>
                  <CheckboxList>
                    <CheckboxItem>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentType === 'PAY'}
                        onChange={() => setPaymentType('PAY')}
                      /> Full Payment
                    </CheckboxItem>
                    <CheckboxItem>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentType === 'PTH'}
                        onChange={() => setPaymentType('PTH')}
                      /> Deposit
                    </CheckboxItem>
                  </CheckboxList>
                </OptionBox>
              </OptionsContainer>
            </LeftColumn>

            <RightColumn>
              <Section>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#4CAF50', marginBottom: 24 }}>
                  <CheckCircle size={20} />
                  <span style={{ fontWeight: 600 }}>Coupon Code</span>
                </div>
                <CouponInput>
                  <input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applying || !couponCode}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: (applying || !couponCode) ? 0.6 : 1
                    }}
                  >
                    {applying ? '...' : 'APPLY'}
                  </button>
                </CouponInput>

                <SummaryTitle>Proprietary Summary</SummaryTitle>
                <PriceRow>
                  <span>Payment Type</span>
                  <span>{paymentType === 'PAY' ? 'Full Payment' : 'Deposit'}</span>
                </PriceRow>
                <PriceRow>
                  <span>Room Price ({nights} Night{nights > 1 ? 's' : ''})</span>
                  <span>THB {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </PriceRow>
                {selectedCharges.map((charge) => {
                  const isPerNight = charge.charge_unit.toLowerCase().includes('คืน') || charge.charge_unit.toLowerCase().includes('night');
                  const amount = parseFloat(charge.charge_amount);
                  const lineTotal = isPerNight ? amount * nights : amount;
                  return (
                    <PriceRow key={charge.charge_id}>
                      <span>{charge.charge_name} {isPerNight ? `(${nights} Night${nights > 1 ? 's' : ''})` : ''}</span>
                      <span>THB {lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </PriceRow>
                  );
                })}

                <PriceRow>
                  <span>Booking Fee</span>
                  <span>Free</span>
                </PriceRow>
                {appliedPromo && (
                  <PriceRow>
                    <span style={{ color: '#E53935' }}>Discount ({appliedPromo.promo_name})</span>
                    <span style={{ color: '#E53935' }}>- THB {parseFloat(appliedPromo.discount_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </PriceRow>
                )}
                <PriceRow total>
                  <span>Total {paymentType === 'PTH' ? '(50% Deposit)' : ''}</span>
                  <span>THB {finalToPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </PriceRow>


                <NextButton 
                  disabled={submitting}
                  onClick={async () => {
                    setSubmitting(true);
                    try {
                      const userStr = localStorage.getItem('user');
                      const user = userStr ? JSON.parse(userStr) : null;
                      const memberId = user?.member_id || '';

                      const res = await axios.post('/bookings', {
                        room_id: roomId,
                        check_in_date: checkInDate,
                        check_out_date: checkOutDate,
                        number_of_nights: nights.toString(),
                        total_price: finalToPay.toString(),
                        number_of_guests: (room.max_guest || '1').toString(),
                        payment_type: paymentType,
                        additional_charges: JSON.stringify(selectedCharges),
                        member_id: memberId,
                        promo_id: appliedPromo?.promo_id || null
                      });

                      if (res.data && res.data.res_code === '0000') {
                        router.push({
                          pathname: '/payment',
                          query: {
                            bookingId: res.data.data.booking_id
                          }
                        });
                      }
                    } catch (error: any) {
                      console.error("Booking failed:", error);
                      const Swal = require('sweetalert2');
                      Swal.fire({
                        icon: 'error',
                        title: 'Booking Failed',
                        text: error?.response?.data?.res_desc || 'Something went wrong.',
                      });
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {submitting ? 'PROCESSING...' : 'NEXT'}
                </NextButton>
              </Section>
            </RightColumn>
          </ContentGrid>
        </Wrapper>
      </Container>
    </UserAuthGuard>
  );
}