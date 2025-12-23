import Head from "next/head";
import styled from "styled-components";
import Image from "next/image";
import { Container, Row, Col, ScreenClassProvider } from "react-grid-system";
import Navbar from "../components/Navbar";
import Link from "next/link";


const Content = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
  gap: 40px;
  width: 100%;
  width: min(70vw, 1000px);
  margin: 0 auto;
`;


const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #fff;
  padding-top: 80px; 
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SignInCard = styled.div`
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 60px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

const SignInInnerCard = styled.div`
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 40px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 500px;
  width: 100%;
  margin-left: -43px;
`;

const PatioImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 220px;
  height: 320px;
  border-radius: 20px;
overflow: hidden;
  z-index: 2;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  border: 4px solid white;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BedroomImage = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 260px;
  height: 360px;
  border-radius: 20px;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
`;

const WelcomeText = styled.h2`
  color: #4CAF50;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
`;

const SubText = styled.p`
  color: #9ca3af;
  font-size: 16px;
  margin-bottom: 32px;
  text-align: center;
    position: relative;
    padding-bottom: 16px;

   &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 1px;
    background-color: #e5e7eb;
   }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  color: #374151;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;

const ForgotPasswordLink = styled.a`
  display: block;
  text-align: left;
  color: #9ca3af;
  font-size: 14px;
  margin-bottom: 24px;
  text-decoration: underline; 
  cursor: pointer;

  &:hover {
    color: #4CAF50;
  }
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 24px;

  &:hover {
    background-color: #43A047;
  }
`;

const RegisterText = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 14px;

  span {
    color: #4CAF50;
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function SignIn() {
  return (
    <ScreenClassProvider>
      <Head>
        <title>Sign In | Hotel Reservations System</title>
        <meta name="description" content="Sign In to your account" />
      </Head>

      <Navbar />

      <PageWrapper>
        <Container fluid>
          <SignInCard>
            <Content>
              {/* Left Side - Images */}
                <ImageContainer>
                  <PatioImage>
                    <Image
                      src="/signin-patio.png"
                      alt="Hotel Patio"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </PatioImage>

                  <BedroomImage>
                    <Image
                      src="/signin-bedroom.png"
                      alt="Hotel Bedroom"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </BedroomImage>
                </ImageContainer>

              {/* Right Side - Form */}
                <SignInInnerCard>
                  <FormContainer>
                    <WelcomeText>
                      Welcome to HOTEL RESERVATIONS SYSTEM
                    </WelcomeText>

                    <SubText>Sign In to your account</SubText>

                    <form>
                      <FormGroup>
                        <Label>Email</Label>
                        <Input type="email" placeholder="Enter your Email" />
                      </FormGroup>

                      <FormGroup>
                        <Label>Password</Label>
                        <Input type="password" placeholder="Enter your Password" />
                      </FormGroup>

                      <ForgotPasswordLink href="#">
                        Forgot password?
                      </ForgotPasswordLink>

                      <SignInButton type="submit">
                        Sign In
                      </SignInButton>
                       <Link href="/register">
                        <RegisterText>
                        {"Don't have an account ?"} <span>Register</span>
                      </RegisterText>
                       </Link>
                  
                    </form>
                  </FormContainer>
                </SignInInnerCard>
            </Content>

          </SignInCard>
        </Container>
      </PageWrapper>
    </ScreenClassProvider>
  );
}
