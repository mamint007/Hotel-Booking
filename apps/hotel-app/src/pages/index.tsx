import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import { Calendar, User, ChevronLeft, ChevronRight, Star } from "lucide-react";
import styled, { createGlobalStyle } from "styled-components";
import { Container, Row, Col, ScreenClassProvider } from "react-grid-system";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "../helpers/axios";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-geist-sans), sans-serif;
    color: #333;
    background-color: #fff;
  }
  
  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const ActionButton = styled.button<{ $variant?: "primary" | "outline" }>`
  padding: 14px 40px;
  border-radius: 9999px;
  font-weight: 700;
  transition: all 0.25s ease;
  box-shadow: ${(props) => (props.$variant === "outline" ? "0 8px 24px rgba(0,0,0,0.16)" : "0 6px 18px rgba(67,160,71,0.18)")};
  background-color: ${(props) => (props.$variant === "outline" ? "transparent" : "#4CAF50")};
  color: ${(props) => (props.$variant === "outline" ? "white" : "white")};
  border: ${(props) => (props.$variant === "outline" ? "2px solid #FFFFFF" : "none")};
  font-size: 14px;
  text-transform: ${(props) => (props.$variant === "outline" ? "uppercase" : "none")};
  letter-spacing: ${(props) => (props.$variant === "outline" ? "0.1em" : "normal")};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.$variant === "outline" ? "white" : "#43A047")};
    color: ${(props) => (props.$variant === "outline" ? "#4CAF50" : "white")};
    transform: translateY(-2px);
  }
`;

const HeroSection = styled.section`
  position: relative;
  height: 600px;
  width: 100%;
  padding-top: 80px; 
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  background-color: #e5e7eb;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 0 16px;
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  text-shadow: 0 4px 6px rgba(0,0,0,0.1);
  letter-spacing: 0.05em;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`;

/* const HotelNameBadge = styled.div`
  display: inline-block;
  background-color: rgba(108, 117, 125, 0.8);
  backdrop-filter: blur(4px);
  padding: 4px 16px;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  border-radius: 4px;
`; */

const SubTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const BookingBar = styled.div`
  background-color: #4CAF50;
  padding: 24px 0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 20;
`;

const BookingTitle = styled.div`
  color: white;
  text-transform: uppercase;
  font-size: 1.125rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  height: 100%;
  margin-bottom: 16px;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const FilterContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 100px;
  overflow: hidden;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FilterContainer2 = styled.div`
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 170px;
  overflow: hidden;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FilterItem = styled.div<{ $borderRight?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  border-bottom: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    border-bottom: none;
    border-right: ${(props) => (props.$borderRight ? "1px solid #e5e7eb" : "none")};
  }
`;

const FilterLabel = styled.span`
  font-size: 10px;
  color: #9ca3af;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
`;

const FilterValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: block;
`;

const FilterSubValue = styled.span`
  font-size: 12px;
  color: #9ca3af;
  display: block;
`;

const StyledSelect = styled.select`
  background-color: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  outline: none;
  padding: 0;
  cursor: pointer;
  width: 100%;
`;

const StyledDateInput = styled.input`
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  outline: none;
  padding: 0;
  cursor: pointer;
  background: transparent;
  width: 100%;

  /* Hide default calendar icon in Chrome/Edge/Safari */
  &::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }
`;

const CheckAvailabilityButton = styled(ActionButton)`
  width: 100%;
  min-width: 190px;
  padding: 12px 0;
  font-size: 12px;
  font-weight: bold;
  margin-top: 16px;
  
  @media (min-width: 992px) { /* lg breakpoint typically */
    margin-top: 0;
  }
`;

const AboutSection = styled.section`
  padding: 6rem 0;
`;

const ImageFrame = styled.div`
  position: relative;
  padding: 12px;
  background-color: rgba(76, 175, 80, 0.1);
  border: 4px solid rgba(76, 175, 80, 0.3);
  border-radius: 4px;
`;

const AboutImage = styled.div`
  position: relative;
  aspect-ratio: 3/4;
  width: 100%;
  background-color: #e5e7eb;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AboutTitle = styled.h2`
  font-family: serif;
  font-size: 2.25rem;
  color: #1f2937;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 3rem;
  }

  span {
    font-style: italic;
    color: #4b5563;
  }
`;

const Separator = styled.div`
  height: 2px;
  width: 5rem;
  background-color: #e5e7eb;
`;

const AboutText = styled.p`
  color: #6b7280;
  line-height: 1.625;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

/* ===== Promotions Section ===== */
const PromotionsSection = styled.section`
  padding: 4rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #4CAF50;
  font-style: italic;
  margin-bottom: 2rem;
`;

const PromotionCarousel = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const CarouselArrow = styled.button`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f9fafb;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
`;

const PromotionCard = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  max-width: 420px;
  width: 100%;
  background: white;
`;

const PromotionText = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.6;

  strong {
    font-weight: 700;
  }
`;

const CouponLabel = styled.span`
  font-size: 0.85rem;
  color: #9ca3af;
  display: block;
  margin-bottom: 0.25rem;
`;

const CouponName = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4CAF50;
  display: block;
`;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0;
`;

/* ===== Customer Reviews Section ===== */
const ReviewsSection = styled.section`
  padding: 4rem 0;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ReviewCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ReviewerAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: #4CAF50;
  font-size: 0.95rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 2px;
`;

const ReviewText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  word-break: break-word;
`;

const ReviewDate = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
`;

const FooterBanner = styled.div`
  background-color: #4CAF50;
  padding: 2.5rem 0;
  margin-top: 2rem;
`;

// Dynamic promotions will be fetched from API

// Dynamic reviews will be fetched from API

export default function Home() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [promoIndex, setPromoIndex] = useState(0);
  const [promos, setPromos] = useState<any[]>([]);
  const [revs, setRevs] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
    fetchPromotions();
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    setCheckIn(today.toISOString().split("T")[0]);
    setCheckOut(tomorrow.toISOString().split("T")[0]);
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/rooms/reviews');
      if (res.data && res.data.res_code === '0000') {
        setRevs(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch reviews", e);
    }
  };

  const fetchPromotions = async () => {
    try {
      const res = await axios.get('/rooms/promotions');
      if (res.data && res.data.res_code === '0000') {
        setPromos(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch promotions", e);
    }
  };

  const handleSearch = () => {
    router.push({
      pathname: "/room",
      query: {
        checkIn,
        checkOut,
        guests
      }
    });
  };

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    // If check-out is before or same as new check-in, move check-out to the next day
    if (checkOut && val >= checkOut) {
      const date = new Date(val);
      date.setDate(date.getDate() + 1);
      setCheckOut(date.toISOString().split("T")[0]);
    }
  };

  const getDayName = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <ScreenClassProvider>
      <Head>
        <title>Hotel Reservations System</title>
        <meta name="description" content="Welcome to our Hotel Reservations System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyle />

      <main className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection>
          <HeroBackground>
            <img
              src="/hero-image.png"
              alt="Hotel Facade"
            />
          </HeroBackground>

          <HeroContent>
            <WelcomeTitle>Welcome To</WelcomeTitle>
            <SubTitle>HOTEL RESERVATIONS SYSTEM</SubTitle>
            <Link href="/room">
              <ActionButton $variant="outline" style={{ fontSize: '14px', padding: '12px 32px' }}>
                Book Room
              </ActionButton>
            </Link>

          </HeroContent>
        </HeroSection>

        {/* Booking Bar */}
        <BookingBar>
          <Container>
            <Row align="center" style={{ marginLeft: 0, marginRight: 0 }}>
              <Col md={12} lg={2}>
                <BookingTitle>Reservations</BookingTitle>
              </Col>

              <Col md={12} lg={10} style={{ paddingLeft: 0, paddingRight: 0, display: "flex", gap: "30px", alignItems: "center", flexWrap: "wrap" }}>
                <FilterContainer style={{ width: '40%', minWidth: '400px' }}>
                  {/* Check In */}
                  <FilterItem $borderRight as="label" htmlFor="check-in-input" style={{ cursor: 'pointer' }}>
                    <Calendar size={20} color="#9ca3af" />
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <FilterLabel>Check In Date</FilterLabel>
                      <StyledDateInput
                        id="check-in-input"
                        type="date"
                        value={checkIn}
                        onChange={(e) => handleCheckInChange(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        onClick={(e) => (e.target as any).showPicker?.()}
                      />
                      <FilterSubValue>{getDayName(checkIn)}</FilterSubValue>
                    </div>
                  </FilterItem>

                  {/* Check Out */}
                  <FilterItem as="label" htmlFor="check-out-input" style={{ cursor: 'pointer' }}>
                    <Calendar size={20} color="#9ca3af" />
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <FilterLabel>Check Out Date</FilterLabel>
                      <StyledDateInput
                        id="check-out-input"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        onClick={(e) => (e.target as any).showPicker?.()}
                      />
                      <FilterSubValue>{getDayName(checkOut)}</FilterSubValue>
                    </div>
                  </FilterItem>
                </FilterContainer>

                <FilterContainer2>
                  {/* Guests */}
                  <FilterItem as="label" htmlFor="guests-select" style={{ cursor: 'pointer' }}>
                    <User size={20} color="#9ca3af" />
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <FilterLabel>Guests</FilterLabel>
                      <StyledSelect
                        id="guests-select"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5">5 Persons</option>
                        <option value="6">6 Persons</option>
                      </StyledSelect>
                      <FilterSubValue>Total Guests</FilterSubValue>
                    </div>
                  </FilterItem>
                </FilterContainer2>

                <CheckAvailabilityButton $variant="outline" onClick={handleSearch} style={{ width: 'auto' }}>
                  Check Availability
                </CheckAvailabilityButton>
              </Col>
            </Row>
          </Container>
        </BookingBar>

        {/* Promotions Section */}
        {promos.length > 0 && (
          <PromotionsSection>
            <Container>
              <SectionTitle>Promotions</SectionTitle>
              <PromotionCarousel>
                <CarouselArrow
                  onClick={() => setPromoIndex((prev) => (prev - 1 + promos.length) % promos.length)}
                  aria-label="Previous promotion"
                >
                  <ChevronLeft size={20} color="#9ca3af" />
                </CarouselArrow>
                <PromotionCard>
                  <PromotionText
                    dangerouslySetInnerHTML={{
                      __html: promos[promoIndex]?.promo_detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '',
                    }}
                  />
                  <CouponLabel>use coupon name :</CouponLabel>
                  <CouponName>{promos[promoIndex]?.promo_name}</CouponName>
                </PromotionCard>
                <CarouselArrow
                  onClick={() => setPromoIndex((prev) => (prev + 1) % promos.length)}
                  aria-label="Next promotion"
                >
                  <ChevronRight size={20} color="#9ca3af" />
                </CarouselArrow>
              </PromotionCarousel>
            </Container>
          </PromotionsSection>
        )}

        <SectionDivider />

        {/* About Section */}
        <AboutSection>
          <Container>
            <Row align="center">
              {/* Image Frame */}
              <Col md={6} style={{ paddingRight: '2rem' }}>
                <ImageFrame>
                  <AboutImage>
                    <img
                      src="/hero-image.png"
                      alt="Relaxing Pool View"
                    />
                  </AboutImage>
                </ImageFrame>
              </Col>

              {/* Text Content */}
              <Col md={6}>
                <AboutContent>
                  <AboutTitle>
                    A best to enjoy <br />
                    <span>your life</span>
                  </AboutTitle>
                  <Separator />
                  <AboutText>
                    Feel at home away from home. Relax, unwind, and enjoy warm hospitality in every detail.
                    From thoughtfully designed rooms to personalized service, we create a comforting space
                    where every moment feels easy and effortless — just like home, but with a little extra indulgence.
                  </AboutText>
                </AboutContent>
              </Col>
            </Row>
          </Container>
        </AboutSection>

        <SectionDivider />

        {/* Customer Reviews Section */}
        <ReviewsSection>
          <Container>
            <SectionTitle>Our Customer Reviews</SectionTitle>
            <ReviewsGrid>
              {revs.map((review, idx) => (
                <ReviewCard key={idx}>
                  <ReviewHeader>
                    <ReviewerInfo>
                      <ReviewerAvatar>
                        <User size={18} />
                      </ReviewerAvatar>
                      <ReviewerName>{review.member?.m_firstname} {review.member?.m_lastname}</ReviewerName>
                    </ReviewerInfo>
                    <StarRating>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < (review.review_detail?.rating || 0) ? '#4CAF50' : 'none'}
                          color={i < (review.review_detail?.rating || 0) ? '#4CAF50' : '#D1D5DB'}
                        />
                      ))}
                    </StarRating>
                  </ReviewHeader>
                  <ReviewText>{review.review_detail?.comment}</ReviewText>
                  <ReviewDate>{new Date(review.review_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</ReviewDate>
                </ReviewCard>
              ))}
            </ReviewsGrid>
          </Container>
        </ReviewsSection>

        {/* Footer Banner */}
        <FooterBanner>
          <Container>
            <div style={{ textAlign: 'center', color: 'white' }}>
              {/* Placeholder for footer content */}
            </div>
          </Container>
        </FooterBanner>
      </main>
    </ScreenClassProvider>
  );
}