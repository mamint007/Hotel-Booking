import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import styled, { createGlobalStyle } from "styled-components";
import { Container, ScreenClassProvider } from "react-grid-system";
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
`;

const MainContent = styled.main`
  padding-top: 120px;
  padding-bottom: 80px;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #4b5563;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
`;

const ServiceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
  margin-top: 60px;
`;

const ServiceItem = styled.div<{ $reverse?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  @media (min-width: 768px) {
    flex-direction: ${props => props.$reverse ? 'row-reverse' : 'row'};
    justify-content: space-between;
  }
`;

const ServiceImage = styled.div`
  flex: 1;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 16/10;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ServiceContent = styled.div`
  flex: 1;
  max-width: 500px;
`;

const ServiceTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #9ca3af;
`;

const services = [
    {
        title: "Swimming Pool",
        description: "The hotel features a spacious outdoor swimming pool surrounded by comfortable lounge chairs. You can relax, swim, or enjoy the peaceful atmosphere throughout the day.",
        image: "/swimming_pool_service_1772971192168.jpg",
        reverse: false
    },
    {
        title: "Fitness Center",
        description: "Our fitness center is fully equipped with modern exercise machines and free weights. It is open daily for who wish to maintain their workout routine during their stay.",
        image: "/fitness_center_service_1772971214223.jpg",
        reverse: true
    },
    {
        title: "Parking Area",
        description: "The hotel provides a secure parking area for your traveling by car. The parking space is convenient and easily accessible.",
        image: "/parking_area_service_1772971228447.jpg",
        reverse: false
    },
    {
        title: "Mini Bar",
        description: "Each room is equipped with a mini bar stocked with a selection of beverages and snacks. You can conveniently enjoy refreshments in the comfort of their room at any time.",
        image: "/mini_bar_service_1772971251494.jpg",
        reverse: true
    },
    {
        title: "Free Wi-Fi",
        description: "High-speed Wi-Fi is available throughout the hotel. You can easily stay connected for work, entertainment, or communication.",
        image: "/wifi_service_1772971306855.jpg",
        reverse: false
    },
    {
        title: "Breakfast",
        description: "A daily breakfast is provided with a selection of delicious local and international dishes, served in a relaxing dining environment.",
        image: "/breakfast_service_1772971323957.jpg",
        reverse: true
    }
];

export default function Services() {
    return (
        <ScreenClassProvider>
            <Head>
                <title>Services & Facilities | Hotel Reservations System</title>
            </Head>
            <GlobalStyle />

            <Navbar />

            <MainContent className={`${geistSans.variable} ${geistMono.variable}`}>
                <Container>
                    <PageTitle>Our Services and Room Facilities</PageTitle>

                    <ServiceSection>
                        {services.map((service, index) => (
                            <ServiceItem key={index} $reverse={service.reverse}>
                                <ServiceContent>
                                    <ServiceTitle>{service.title}</ServiceTitle>
                                    <ServiceDescription>{service.description}</ServiceDescription>
                                </ServiceContent>
                                <ServiceImage>
                                    <img src={service.image} alt={service.title} />
                                </ServiceImage>
                            </ServiceItem>
                        ))}
                    </ServiceSection>
                </Container>
            </MainContent>
        </ScreenClassProvider>
    );
}
