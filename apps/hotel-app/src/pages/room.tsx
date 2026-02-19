import styled from "styled-components";
import Navbar from "../components/Navbar";
import { Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "../helpers/axios";

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

interface Room {
  room_id: string;
  room_number: string;
  floor: number;
  price_per_night: string;
  bed_type: string;
  bed_quantity: number;
  max_guest: number;
  room_status: string;
  room_type: {
    room_type_name: string;
  };
  room_image?: string;
}

export default function RoomPage() {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [activeTab, setActiveTab] = useState("ALL ROOM");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get('/rooms/types');
      if (res.data && res.data.res_code === '0000') {
        const types = res.data.data.map((rt: any) => rt.room_type_name);
        setRoomTypes(types);
      }
    } catch (error) {
      console.error("Failed to fetch room types", error);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      const params: any = {
        minPrice: priceRange[0],
        maxPrice: priceRange[1]
      };
      if (activeTab !== "ALL ROOM") {
        params.type = activeTab;
      }

      const res = await axios.get('/rooms', { params });
      if (res.data && res.data.res_code === '0000') {
        setRooms(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [activeTab, priceRange]); // Re-fetch when filters change (debouncing recommended for price range in production)

  const handleBook = (room: Room) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }
    router.push({
      pathname: '/booking',
      query: { roomId: room.room_id }
    });
  };

  const getImageUrl = (path?: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3270&auto=format&fit=crop';
    return `http://localhost:3001${path}`;
  };

  const getBedTypeName = (type: string) => {
    switch (type) {
      case 'S': return 'Single Bed';
      case 'D': return 'Double Bed';
      case 'K': return 'King Bed';
      case 'Q': return 'Queen Bed';
      default: return type;
    }
  }

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
              <Tab
                active={activeTab === "ALL ROOM"}
                onClick={() => setActiveTab("ALL ROOM")}
              >
                ALL ROOM
              </Tab>
              {roomTypes.length > 0 ? roomTypes.map(tab => (
                <Tab
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Tab>
              )) : ["STANDARD ROOM", "DELUXE ROOM", "SUITE ROOM"].map(tab => (
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
              {loading ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>Loading rooms...</div>
              ) : rooms.length > 0 ? (
                rooms.map(room => (
                  <RoomCard key={room.room_id}>
                    <RoomImage style={{ backgroundImage: `url('${getImageUrl(room.room_image)}')` }} />
                    <RoomDetails>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <RoomTitle>{room.room_type?.room_type_name} {room.room_number}</RoomTitle>
                        <span style={{ fontSize: '18px', fontWeight: 600, color: '#4CAF50' }}>฿{parseFloat(room.price_per_night).toLocaleString()}</span>
                      </div>
                      <RoomDescription>
                        Floor {room.floor} • {getBedTypeName(room.bed_type)} x{room.bed_quantity} • Max {room.max_guest} Guests
                      </RoomDescription>
                      <BookButton onClick={() => handleBook(room)}>BOOK NOW</BookButton>
                    </RoomDetails>
                  </RoomCard>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>No rooms found.</div>
              )}
            </RoomListContainer>
          </MainContent>
        </ContentWrapper>
      </Container>
    </>
  );
}
