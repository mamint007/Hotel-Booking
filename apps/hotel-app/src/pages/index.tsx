import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Calendar, User } from "lucide-react";
import styled, { createGlobalStyle } from "styled-components";
import { Container, Row, Col, ScreenClassProvider } from "react-grid-system";
import Navbar from "../components/Navbar";

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
  padding: 8px 24px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  background-color: ${(props) => (props.$variant === "outline" ? "transparent" : "#4CAF50")};
  color: ${(props) => (props.$variant === "outline" ? "white" : "white")};
  border: ${(props) => (props.$variant === "outline" ? "1px solid white" : "none")};
  font-size: ${(props) => (props.$variant === "outline" ? "12px" : "14px")};
  text-transform: ${(props) => (props.$variant === "outline" ? "uppercase" : "none")};
  letter-spacing: ${(props) => (props.$variant === "outline" ? "0.1em" : "normal")};
  white-space: nowrap;
  
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.$variant === "outline" ? "white" : "#43A047")};
    color: ${(props) => (props.$variant === "outline" ? "#4CAF50" : "white")};
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
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 4px 6px rgba(0,0,0,0.1);
  letter-spacing: 0.05em;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`;

const HotelNameBadge = styled.div`
  display: inline-block;
  background-color: rgba(108, 117, 125, 0.8);
  backdrop-filter: blur(4px);
  padding: 4px 16px;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  border-radius: 4px;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
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
  width: 100%;
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
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  padding: 4px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
`;

const CheckAvailabilityButton = styled(ActionButton)`
  width: 100%;
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

export default function Home() {
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
            <Image
              src="/hero-image.png"
              alt="Hotel Facade"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </HeroBackground>

          <HeroContent>
            <WelcomeTitle>Welcome To</WelcomeTitle>
            <HotelNameBadge>HOTEL NAME HERE</HotelNameBadge>
            <SubTitle>HOTEL RESERVATIONS SYSTEM</SubTitle>
            <ActionButton $variant="outline" style={{ fontSize: '14px', padding: '12px 32px' }}>
              Book Room
            </ActionButton>
          </HeroContent>
        </HeroSection>

        {/* Booking Bar */}
        <BookingBar>
          <Container>
            <Row align="center" style={{ marginLeft: 0, marginRight: 0 }}>
              <Col md={12} lg={2}>
                <BookingTitle>Reservations</BookingTitle>
              </Col>

              <Col md={12} lg={8} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <FilterContainer>
                  {/* Check In */}
                  <FilterItem $borderRight>
                    <Calendar size={20} color="#9ca3af" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <FilterLabel>Check In Data</FilterLabel>
                      <FilterValue>5 NOV 2025</FilterValue>
                      <FilterSubValue>Wednesday</FilterSubValue>
                    </div>
                  </FilterItem>

                  {/* Check Out */}
                  <FilterItem $borderRight>
                    <Calendar size={20} color="#9ca3af" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <FilterLabel>Check Out Data</FilterLabel>
                      <FilterValue>6 NOV 2025</FilterValue>
                      <FilterSubValue>Thursday</FilterSubValue>
                    </div>
                  </FilterItem>

                  {/* Adults */}
                  <FilterItem $borderRight>
                    <User size={20} color="#9ca3af" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563' }}>Adult(s)</span>
                      <StyledSelect>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                      </StyledSelect>
                    </div>
                  </FilterItem>

                  {/* Children */}
                  <FilterItem>
                    <User size={20} color="#9ca3af" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563' }}>Children</span>
                      <StyledSelect>
                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                      </StyledSelect>
                    </div>
                  </FilterItem>
                </FilterContainer>
              </Col>

              <Col md={12} lg={2}>
                <CheckAvailabilityButton $variant="outline">
                  Check Availability
                </CheckAvailabilityButton>
              </Col>
            </Row>
          </Container>
        </BookingBar>

        {/* About Section */}
        <AboutSection>
          <Container>
            <Row align="center" style={{ gap: '64px' }}>
              {/* Image Frame */}
              <Col md={6}>
                <ImageFrame>
                  <AboutImage>
                    <Image
                      src="/hero-image.png"
                      alt="Relaxing Pool View"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </AboutImage>
                </ImageFrame>
              </Col>

              {/* Text Content */}
              <Col md={5}>
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
      </main>
    </ScreenClassProvider>
  );
}
