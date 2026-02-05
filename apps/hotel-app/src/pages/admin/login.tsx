import Head from "next/head";
import styled from "styled-components";
import { Container, ScreenClassProvider } from "react-grid-system";
import Navbar from "../../components/Navbar"; // Adjusted path
import { useState } from "react";
import axios from "../../helpers/axios"; // Adjusted path
import { useRouter } from "next/router";
import swalInstance from 'sweetalert2'

const Content = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
  gap: 40px;
  width: 100%;
  width: min(70vw, 1000px);
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 100%;
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6; /* Light gray background */
  padding-top: 80px; 
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AdminCard = styled.div`
  border-radius: 20px;
  border: 1px solid #d1d5db;
  padding: 60px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const InnerCard = styled.div`
  border-radius: 20px;
  padding: 40px;
  width: 100%;
`;

const GradientSide = styled.div`
  position: relative;
  height: 500px;
  width: 100%;
  border-radius: 20px;
  background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%);
  background-image: url('/signin-patio.png');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const BrandTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.025em;
`;

const BrandSubtitle = styled.p`
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  height: 100%;
`;

const WelcomeText = styled.h2`
  color: #2E7D32; /* Dark Green */
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
`;

const SubText = styled.p`
  color: #6b7280;
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
    width: 60px;
    height: 3px;
    background-color: #2E7D32;
    border-radius: 2px;
   }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  color: #1f2937;
  background-color: #f9fafb;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #4CAF50;
    background-color: #fff;
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
  }
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover {
    background-color: #43A047;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(76, 175, 80, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorText = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null)

        // 1. Client-side Validation
        if (!email.trim() || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            // Updated endpoint to Admin login
            const res = await axios.post('/admin/login', {
                email: email.trim(),
                password: password
            })

            if (res.data?.res_code === '0000') {
                const token = res.data.data.token
                const employee = res.data.data.employee
                localStorage.setItem('admin_token', token)
                localStorage.setItem('admin_user', JSON.stringify(employee))

                swalInstance.fire({
                    icon: 'success',
                    title: 'Welcome Back, Admin',
                    text: 'Redirecting to dashboard...',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#fff',
                    iconColor: '#4CAF50'
                }).then(() => {
                    router.push('/admin/dashboard')
                })
            }
        } catch (err: any) {
            console.error(err)
            const resCode = err?.response?.data?.res_code
            const resDesc = err?.response?.data?.res_desc?.th || err?.response?.data?.res_desc || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'

            // Admin Error Mapping based on admin.error.json
            if (["1403"].includes(resCode)) {
                setError("Admin account not found.");
            } else if (resCode === "1401") {
                setError(resDesc);
            } else if (resCode === "1402") {
                setError("Invalid email or password");
            }
            else {
                const generalError = 'System error. Please contact support.';
                setError(generalError);
            }
        }
    }

    return (
        <ScreenClassProvider>
            <Head>
                <title>Admin Login | Management Portal</title>
                <meta name="description" content="Admin Login" />
            </Head>

            <Navbar />

            <PageWrapper>
                <Container fluid>
                    <AdminCard>
                        <Content>
                            {/* Left Side - Gradient & Info */}
                            <GradientSide>
                                <BrandTitle>Admin</BrandTitle>
                                <BrandSubtitle>
                                    Secure access for hotel management and administration.
                                </BrandSubtitle>
                            </GradientSide>

                            {/* Right Side - Form */}
                            <InnerCard>
                                <FormContainer>
                                    <WelcomeText>
                                        Sign In
                                    </WelcomeText>
                                    <SubText>Enter your credentials to continue</SubText>

                                    <form onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label>Username / Email</Label>
                                            <Input
                                                type="text"
                                                placeholder="admin@hotel.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>Password</Label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {error && <ErrorText>{error}</ErrorText>}
                                        </FormGroup>

                                        <SignInButton type="submit">
                                            Access Dashboard
                                        </SignInButton>

                                    </form>
                                </FormContainer>
                            </InnerCard>
                        </Content>
                    </AdminCard>
                </Container>
            </PageWrapper>
        </ScreenClassProvider>
    );
}
