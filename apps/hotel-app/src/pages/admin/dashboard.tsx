import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";

const PageHeader = styled.h2`
  font-size: 24px;
  color: #34a853;
  margin-bottom: 24px;
  font-weight: 600;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  color: #374151;
  
  &:focus {
    border-color: #34a853;
    box-shadow: 0 0 0 2px rgba(52, 168, 83, 0.15);
  }
`;

const GenerateButton = styled.button`
  padding: 8px 24px;
  background-color: #34a853;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2d9249;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ReportTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: white;
  
  th, td {
    border: 1px solid black;
    padding: 8px;
    color: black;
    font-size: 14px;
    word-break: break-all;
  }
`;

const Th = styled.th`
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: center;
`;

const Td = styled.td<{ $bold?: boolean; $right?: boolean }>`
  text-align: ${(p) => (p.$right ? 'right' : 'center')};
  font-weight: ${(p) => (p.$bold ? 'bold' : 'normal')};
`;

const TotalRow = styled.tr`
  border-top: 2px solid #1f2937;
  
  td {
    font-weight: 700;
    color: #1f2937;
    border-bottom: 2px solid #1f2937;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

const SectionSpacer = styled.div`
  height: 40px;
`;

const PDFButton = styled.button`
  padding: 8px 24px;
  background-color: #1f2937;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #374151;
  }

  @media print {
    display: none;
  }
`;

const PrintStyles = styled.div`
  @media print {
    @page {
      size: A4;
      margin: 20mm;
    }

    /* Hide ALL administrative UI components */
    nav, aside, header, footer, button, .no-print, 
    [class*="Sidebar"], [class*="Navbar"], [class*="TopHeader"],
    .FilterRow, [class*="Card"]:first-of-type,
    [class*="PageHeader"] {
      display: none !important;
    }

    /* Reset global layout containers */
    html, body, #__next, 
    [class*="LayoutWrapper"], [class*="MainContent"], [class*="ContentBody"] {
      display: block !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      width: 100% !important;
      height: auto !important;
      min-height: auto !important;
      position: static !important;
      box-shadow: none !important;
      border: none !important;
    }

    /* Style the report content */
    #report-content {
      display: block !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }

    /* Professional Table Styles for Print */
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin-bottom: 20px !important;
      border: 1px solid black !important;
    }

    th, td {
      border: 1px solid black !important;
      padding: 6px !important;
      color: black !important;
      background: white !important;
      text-align: center !important;
    }

    th {
      background-color: #f2f2f2 !important;
      font-weight: bold !important;
      -webkit-print-color-adjust: exact;
    }

    h2, h3, [class*="ReportTitle"] {
      color: black !important;
      text-align: left !important;
      margin: 20px 0 10px 0 !important;
      font-size: 16px !important;
      font-weight: bold !important;
      background: none !important;
    }

    /* Remove card borders in print */
    [class*="Card"] {
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
    }
  }
`;

interface ReportRow {
    room_type_name: string;
    booking_count: string;
    avg_price_per_night: string;
    total_revenue: string;
}

interface OccupancyRow {
    date: string;
    [roomType: string]: string;
}

interface OccupancyData {
    roomTypes: string[];
    data: OccupancyRow[];
}

const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatThaiDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
};

const formatThaiShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const thaiShortMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const day = date.getDate();
    const month = thaiShortMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
};

export default function AdminReport() {
    const [reportData, setReportData] = useState<ReportRow[]>([]);
    const [occupancyData, setOccupancyData] = useState<OccupancyData | null>(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportGenerated, setReportGenerated] = useState(false);

    const router = useRouter();

    useEffect(() => {
        // Check for owner role
        const adminUserStr = localStorage.getItem('admin_user');
        if (adminUserStr) {
            try {
                const adminUser = JSON.parse(adminUserStr);
                // Allow Owner, Admin, and Employee to enter admin portal
                const allowedRoles = ['Owner', 'Admin', 'Employee'];
                if (!allowedRoles.includes(adminUser.role?.role_name)) {
                    // Redirect unauthorized users
                    router.push('/admin/login');
                    return;
                }
                
                // If not Owner, they might be redirected from specifically the Report content
                // but let's allow them to "enter" the dashboard first.
                // Or if you want them to land on Bookings if not Owner:
                if (adminUser.role?.role_name === 'Employee') {
                    router.push('/admin/booking');
                    return;
                }
            } catch (error) {
                console.error("Failed to parse admin_user", error);
                router.push('/admin/login');
                return;
            }
        }

        // Default to current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
    }, [router]);

    const fetchReport = async () => {
        if (!startDate || !endDate) return;
        setLoading(true);
        try {
            const [bookingRes, occupancyRes] = await Promise.all([
                axios.get('/admin/report/bookings', { params: { startDate, endDate } }),
                axios.get('/admin/report/occupancy', { params: { startDate, endDate } })
            ]);

            if (bookingRes.data && bookingRes.data.res_code === '0000') {
                setReportData(bookingRes.data.data);
            }
            if (occupancyRes.data && occupancyRes.data.res_code === '0000') {
                setOccupancyData(occupancyRes.data.data);
            }
            setReportGenerated(true);
        } catch (error) {
            console.error("Failed to fetch report", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const content = document.getElementById('report-content-data')?.innerHTML;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>รายงานสรุปข้อมูลการจอง</title>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
                            body { 
                                font-family: 'Sarabun', sans-serif; 
                                padding: 40px; 
                                background: white;
                                color: black;
                            }
                            table { 
                                width: 100%; 
                                border-collapse: collapse; 
                                margin-bottom: 30px; 
                                border: 1px solid black;
                            }
                            th, td { 
                                border: 1px solid black; 
                                padding: 10px; 
                                text-align: center; 
                                font-size: 14px;
                            }
                            th { 
                                background-color: #f2f2f2 !important; 
                                -webkit-print-color-adjust: exact;
                            }
                            h2, h3 { 
                                text-align: left; 
                                margin: 20px 0 10px 0;
                                font-size: 18px;
                            }
                            .report-title {
                                font-weight: bold;
                                font-size: 20px;
                                text-align: center;
                                margin-bottom: 30px;
                            }
                            /* Remove scrollbars and height limits for printing */
                            div {
                                max-height: none !important;
                                overflow: visible !important;
                            }
                            @media print {
                                body { padding: 0; }
                                @page { margin: 2cm; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="report-title">รายงานสรุปข้อมูลโรงแรม</div>
                        ${content}
                        <script>
                            window.document.close();
                            window.focus();
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        </script>
                    </body>
                </html>
            `);
        }
    };

    const totalBookings = reportData.reduce((sum, r) => sum + parseInt(r.booking_count || '0'), 0);
    const totalRevenue = reportData.reduce((sum, r) => sum + parseFloat(r.total_revenue || '0'), 0);

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Report" title="Admin - Report">
                <PageHeader>รายงานสรุปข้อมูลการจอง</PageHeader>

                <Card>
                    <FilterRow>
                        <FilterGroup>
                            <FilterLabel>วันที่เริ่มต้น</FilterLabel>
                            <FilterInput
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </FilterGroup>
                        <FilterGroup>
                            <FilterLabel>วันที่สิ้นสุด</FilterLabel>
                            <FilterInput
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </FilterGroup>
                        <GenerateButton onClick={fetchReport} disabled={loading}>
                            {loading ? 'กำลังโหลด...' : 'สร้างรายงาน'}
                        </GenerateButton>
                        {reportGenerated && (
                            <PDFButton onClick={handlePrint}>
                                ดาวน์โหลดเอกสาร PDF
                            </PDFButton>
                        )}
                    </FilterRow>
                </Card>

                <div id="report-content-data">
                    {reportGenerated && (
                        <>
                            {/* Report 1: Booking Summary by Room Type */}
                        <Card>
                            <ReportTitle>
                                รายงานยอดการจองตามช่วงเวลา แยกตามประเภทห้องพัก ({formatThaiDate(startDate)} – {formatThaiDate(endDate)})
                            </ReportTitle>

                            {reportData.length > 0 ? (
                                <Table>
                                    <thead>
                                        <tr>
                                            <Th>ประเภทห้องพัก</Th>
                                            <Th>จำนวนการจอง (ครั้ง)</Th>
                                            <Th>ราคาเฉลี่ยต่อคืน (บาท)</Th>
                                            <Th>รายได้รวม (บาท)</Th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((row, index) => (
                                            <tr key={index}>
                                                <Td>{row.room_type_name}</Td>
                                                <Td>{formatNumber(parseInt(row.booking_count))}</Td>
                                                <Td>{formatNumber(parseFloat(row.avg_price_per_night))}</Td>
                                                <Td $right>{formatNumber(parseFloat(row.total_revenue))}</Td>
                                            </tr>
                                        ))}
                                        <TotalRow>
                                            <Td $bold>รวม</Td>
                                            <Td $bold>{formatNumber(totalBookings)}</Td>
                                            <Td $bold>-</Td>
                                            <Td $bold $right>{formatNumber(totalRevenue)}</Td>
                                        </TotalRow>
                                    </tbody>
                                </Table>
                            ) : (
                                <EmptyState>ไม่พบข้อมูลการจองในช่วงเวลาที่เลือก</EmptyState>
                            )}
                        </Card>

                        <SectionSpacer />

                        {/* Report 2: Daily Room Occupancy */}
                        <Card>
                            <ReportTitle>
                                รายงานจำนวนห้องว่าง/ห้องเต็ม แยกตามประเภทห้องพัก ({formatThaiDate(startDate)} – {formatThaiDate(endDate)})
                            </ReportTitle>

                            {occupancyData && occupancyData.data.length > 0 ? (
                                <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <Th rowSpan={2} style={{ verticalAlign: 'bottom', position: 'sticky', top: 0, background: '#f9fafb', zIndex: 1 }}>วันที่ (วัน/เดือน/ปี)</Th>
                                                <Th colSpan={occupancyData.roomTypes.length} style={{ borderBottom: '1px solid #d1d5db', position: 'sticky', top: 0, background: '#f9fafb', zIndex: 1 }}>ประเภทห้องพัก</Th>
                                            </tr>
                                            <tr>
                                                {occupancyData.roomTypes.map((type) => (
                                                    <Th key={type} style={{ borderTop: 'none', position: 'sticky', top: '46px', background: '#f9fafb', zIndex: 1 }}>{type}</Th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {occupancyData.data.map((row, index) => (
                                                <tr key={index}>
                                                    <Td>{formatThaiShortDate(row.date)}</Td>
                                                    {occupancyData.roomTypes.map((type) => (
                                                        <Td key={type}>{row[type]}</Td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            ) : (
                                <EmptyState>ไม่พบข้อมูลในช่วงเวลาที่เลือก</EmptyState>
                            )}
                        </Card>
                    </>
                )}
                </div>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
