import styled from "styled-components";
import Navbar from "../components/Navbar";
import { Calendar, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding-top: 80px; /* Space for fixed navbar */
`;

const SearchSection = styled.div`
  background-color: #4CAF50; /* Green from the reference */
  padding: 24px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchBarContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const InputGroup = styled.div`
  background: white;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 50px;
  min-width: 200px;
`;

const Label = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelTitle = styled.span`
  font-size: 10px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
`;

const LabelValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

const CheckButton = styled.button`
  background-color: transparent;
  border: 1px solid white;
  color: white;
  padding: 0 24px;
  height: 50px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  gap: 40px;
`;

const Sidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
`;

const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

const PriceRangeContainer = styled.div`
  margin-bottom: 30px;
`;

const RangeSlider = styled.input`
  width: 100%;
  accent-color: #4CAF50;
  margin-bottom: 16px;
`;

const PriceInputs = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const PriceInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;
const PriceLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
`;
const PriceValueInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #f3f4f6;
  font-size: 14px;
`;

const MainContent = styled.div`
  flex: 1;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 30px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  background: white;
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 12px 24px;
  background: ${(p) => (p.active ? "#e8f5e9" : "white")};
  color: ${(p) => (p.active ? "#4CAF50" : "#6b7280")};
  font-weight: ${(p) => (p.active ? "600" : "500")};
  border: none;
  border-right: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background-color: ${(p) => (p.active ? "#e8f5e9" : "#f9fafb")};
  }
`;

const RoomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  display: flex;
  min-height: 240px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const RoomImage = styled.div`
  width: 320px;
  background-color: #e5e7eb;
  position: relative;
  /* Placeholder for image */
  background-image: url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3270&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
`;

const RoomDetails = styled.div`
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
`;

const RoomTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
`;

const RoomDescription = styled.p`
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
  flex: 1;
`;

const BookButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  width: fit-content;
  margin-top: 20px;
  text-transform: uppercase;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background-color: #388E3C;
  }
`;

export default function RoomPage() {
    const router = useRouter();
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [activeTab, setActiveTab] = useState("ALL ROOM");

    const rooms = [
        {
            id: 1,
            name: "Standard Room",
            description: "Experience comfort in our Standard Room, featuring modern amenities and a cozy atmosphere perfect for relaxation after a day of exploring.",
            type: "STANDARD ROOM"
        },
        {
            id: 2,
            name: "Deluxe Room",
            description: "Upgrade your stay with our Deluxe Room, offering more space, premium bedding, and stunning views of the city skyline.",
            type: "DELUXE ROOM"
        },
        {
            id: 3,
            name: "Suite Room",
            description: "Indulge in luxury with our spacious Suite Room, complete with a separate living area, king-sized bed, and exclusive access to the executive lounge.",
            type: "SUITE ROOM"
        }
    ];

    const filteredRooms = activeTab === "ALL ROOM"
        ? rooms
        : rooms.filter(room => room.type === activeTab);

    const handleBook = (room: any) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/signin');
            return;
        }
        // Future booking logic here
        console.log("Booking room:", room);
    };

    return (
        <>
            <Navbar />
            <Container>
                {/* Search Header */}
                <SearchSection>
                    <SearchBarContainer>
                        <InputGroup>
                            <Calendar size={20} color="#9ca3af" />
                            <Label>
                                <LabelTitle>CHECK-IN</LabelTitle>
                                <LabelValue>5 NOV 2025</LabelValue>
                            </Label>
                        </InputGroup>

                        <InputGroup>
                            <Calendar size={20} color="#9ca3af" />
                            <Label>
                                <LabelTitle>CHECK-OUT</LabelTitle>
                                <LabelValue>6 NOV 2025</LabelValue>
                            </Label>
                        </InputGroup>

                        <InputGroup>
                            <User size={20} color="#9ca3af" />
                            <Label>
                                <LabelTitle>GUESTS</LabelTitle>
                                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                    <span style={{ fontSize: 13, fontWeight: 500 }}>2 Adults</span>
                                    <span style={{ color: '#d1d5db' }}>|</span>
                                    <span style={{ fontSize: 13, fontWeight: 500 }}>0 Children</span>
                                </div>
                            </Label>
                        </InputGroup>

                        <CheckButton>CHECK AVAILABILITY</CheckButton>
                    </SearchBarContainer>
                </SearchSection>

                {/* Content */}
                <ContentWrapper>
                    {/* Sidebar */}
                    <Sidebar>
                        <SidebarTitle>
                            <span>Rate Per Night</span>
                            <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 400 }}>THB</span>
                        </SidebarTitle>

                        <PriceRangeContainer>
                            <RangeSlider
                                type="range"
                                min="0"
                                max="10000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            />
                            <PriceInputs>
                                <PriceInputGroup>
                                    <PriceLabel>Min Price</PriceLabel>
                                    <PriceValueInput type="number" value={priceRange[0]} readOnly />
                                </PriceInputGroup>
                                <PriceInputGroup>
                                    <PriceLabel>Max Price</PriceLabel>
                                    <PriceValueInput type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} />
                                </PriceInputGroup>
                            </PriceInputs>
                        </PriceRangeContainer>
                    </Sidebar>

                    {/* Main List */}
                    <MainContent>
                        <TabsContainer>
                            {["ALL ROOM", "STANDARD ROOM", "DELUXE ROOM", "SUITE ROOM"].map(tab => (
                                <Tab
                                    key={tab}
                                    active={activeTab === tab}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </Tab>
                            ))}
                        </TabsContainer>

                        <RoomListContainer>
                            {filteredRooms.map(room => (
                                <RoomCard key={room.id}>
                                    <RoomImage />
                                    <RoomDetails>
                                        <RoomTitle>{room.name}</RoomTitle>
                                        <RoomDescription>
                                            {room.description}
                                        </RoomDescription>
                                        <BookButton onClick={() => handleBook(room)}>BOOK</BookButton>
                                    </RoomDetails>
                                </RoomCard>
                            ))}
                        </RoomListContainer>
                    </MainContent>
                </ContentWrapper>
            </Container>
        </>
    );
}
