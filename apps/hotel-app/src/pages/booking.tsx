
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "../helpers/axios";
import { Calendar, Bed, Users, Wifi, Car, CreditCard, CheckCircle } from "lucide-react";
import UserAuthGuard from "../components/UserAuthGuard";

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

    useEffect(() => {
        if (roomId) {
            // Find room from API or fetch single
            // Since we don't have getRoomById API yet (or do we?), we can assume passing data or fetching all and filtering
            // Let's implement fetch single room later or just filter for now
            // Actually `getRooms` allows filtering by ID? No.
            // But we have `adminController` `updateRoom`.
            // Let's try fetching all and finding one for now, or just mock data to match UI.
            // In production, should have `GET /rooms/:id`.
            fetchRoom(roomId as string);
        }
    }, [roomId]);

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

    const getImageUrl = (path?: string) => {
        if (!path) return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3270&auto=format&fit=crop';
        return `http://localhost:3001${path}`;
    };

    if (loading) return <Container><div style={{ textAlign: 'center' }}>Loading...</div></Container>;
    if (!room) return <Container><div style={{ textAlign: 'center' }}>Room not found</div></Container>;

    const price = parseFloat(room.price_per_night);
    const nights = 1; // Calculate from dates
    const total = price * nights;

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
                                                <DateValue>5 NOV 2025</DateValue>
                                                <DateLabel>Wednesday</DateLabel>
                                            </DateInfo>
                                        </DateBox>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: 16, color: '#6b7280', fontSize: 12, textTransform: 'uppercase' }}>Check Out</h4>
                                        <DateBox>
                                            <DateIcon><Calendar size={20} /></DateIcon>
                                            <DateInfo>
                                                <DateValue>6 NOV 2025</DateValue>
                                                <DateLabel>Thursday</DateLabel>
                                            </DateInfo>
                                        </DateBox>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <NightCount><Bed size={16} /> 1 Night</NightCount>
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
                                            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Edit Booking Details</span>
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
                                        <CheckboxItem><input type="checkbox" /> Extra Bed</CheckboxItem>
                                        <CheckboxItem><input type="checkbox" /> Airport Transfer</CheckboxItem>
                                    </CheckboxList>
                                </OptionBox>
                                <OptionBox>
                                    <OptionTitle>Payment Type</OptionTitle>
                                    <CheckboxList>
                                        <CheckboxItem><input type="radio" name="pay" defaultChecked /> Pay Now</CheckboxItem>
                                        <CheckboxItem><input type="radio" name="pay" /> Pay at Hotel</CheckboxItem>
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
                                    <input placeholder="Enter coupon code" />
                                </CouponInput>

                                <SummaryTitle>Proprietary Summary</SummaryTitle>
                                <PriceRow>
                                    <span>Payment Type</span>
                                    <span>Pay Now</span>
                                </PriceRow>
                                <PriceRow>
                                    <span>Room Price ({nights} Night)</span>
                                    <span>THB {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </PriceRow>
                                <PriceRow>
                                    <span>Booking Fee</span>
                                    <span>Free</span>
                                </PriceRow>
                                <PriceRow total>
                                    <span>Total</span>
                                    <span>THB {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </PriceRow>

                                <NextButton onClick={() => alert("Proceed to Payment...")}>NEXT</NextButton>
                            </Section>
                        </RightColumn>
                    </ContentGrid>
                </Wrapper>
            </Container>
        </UserAuthGuard>
    );
}
