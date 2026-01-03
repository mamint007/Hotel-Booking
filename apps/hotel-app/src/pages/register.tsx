import Head from "next/head";
import styled from "styled-components";
import { Row, Col, ScreenClassProvider } from "react-grid-system";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { createGlobalStyle } from "styled-components";
import { useState } from "react";
import axios from "axios";


const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #fff;
  padding-top: 80px; 
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
`;

const RegisterCard = styled.div`
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); 
  border: 1px solid #e5e7eb;
  padding: 40px;
  width: 100%;
  max-width: 650px;
  //max-width: 800px; /* Wider for 2 columns */
  //margin: 0 auto;
`;

const FormTitle = styled.h2`
  color: #4CAF50;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
  position: relative;
  padding-bottom: 16px;

   &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 350px;
    height: 1px;
    background-color: #e5e7eb;
   }
`;

const SubText = styled.p`
  color: #9ca3af;
  font-size: 16px;
  margin-bottom: 32px;
  text-align: center;
  margin-top: -10px; 
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
  max-width: 280px;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  color: #374151;

  &::placeholder {
    color: #cecece;
  }

  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  padding-top: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #4b5563;
  font-size: 14px;
`;

const RadioInput = styled.input`
  accent-color: #4CAF50;
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const RegisterButton = styled.button`
  width: 500px;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;
  margin-bottom: 24px;
  max-width: 430px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin: 16px auto 24px;

  &:hover {
    background-color: #43A047;
  }
`;

const LoginText = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 14px;

  a {
    color: #4CAF50;
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
  margin-left: 2px;
`

export default function Register() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null)
  const [lastNameError, setLastNameError] = useState<string | null>(null)
  const [sexError, setSexError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors()
    console.log({ name, lastName, sex, phoneNumber, email, password });
    let isValid = true;

    if (!name) {
      setNameError('Please enter your name')
      isValid = false;
    }
    if (!lastName) {
      setLastNameError('Please enter your lastname')
      isValid = false;
    }
    if (!sex) {
      setSexError('Please enter your sex')
      isValid = false;
    }
    if (!email) {
      setEmailError('Please enter your email')
      isValid = false;
    }
    if (!password) {
      setPasswordError('Please enter your password')
      isValid = false;
    }
    if (!phoneNumber) {
      setPhoneNumberError('Please enter your phoneNumber')
      isValid = false;
    }

    if (!isValid) {
      return
    }

    setLoading(true)

    try {
      const res = await axios.post('/api/authen/register', {
        name: name.trim(),
        last_name: lastName.trim(),
        sex: sex.trim(),
        phone_number: phoneNumber.trim(),
        email: email.trim(),
        password: password
      })
      console.log(res.data)
    } catch (err: any) {

    } finally {
      setLoading(false)
    }



  };


  const resetErrors = () => {
    setNameError(null)
    setLastNameError(null)
    setEmailError(null)
    setPhoneNumberError(null)
    setPasswordError(null)
    setSexError(null)
  }

  return (
    <ScreenClassProvider>
      <Head>
        <title>Create Account | Hotel Reservations System</title>
        <meta name="description" content="Create a new account" />
      </Head>

      <Navbar />

      <PageWrapper>
        <RegisterCard>
          <FormTitle>Create a new account</FormTitle>
          <SubText>to use all features of the website</SubText>

          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {nameError && <ErrorText>{nameError}</ErrorText>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>LastName</Label>
                  <Input
                    type="text"
                    placeholder="Enter your Lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  {lastNameError && <ErrorText>{lastNameError}</ErrorText>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Sex</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        name="sex"
                        value="M"
                        checked={sex === "M"}
                        onChange={(e) => setSex(e.target.value)}
                      /> Male
                    </RadioLabel>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        name="sex"
                        value="F"
                        checked={sex === "F"}
                        onChange={(e) => setSex(e.target.value)}
                      /> Female
                    </RadioLabel>
                  </RadioGroup>
                  {sexError && <ErrorText>{sexError}</ErrorText>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="Enter your Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  {phoneNumberError && <ErrorText>{phoneNumberError}</ErrorText>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && <ErrorText>{emailError}</ErrorText>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && <ErrorText>{passwordError}</ErrorText>}
                </FormGroup>
              </Col>
            </Row>

            <RegisterButton type="submit">Register</RegisterButton>

            <LoginText>
              Already have an account ? <Link href="/signin">Sign In</Link>
            </LoginText>

          </form>
        </RegisterCard>
      </PageWrapper>
    </ScreenClassProvider>
  );
} 