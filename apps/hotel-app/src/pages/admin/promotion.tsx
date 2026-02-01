import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout from "../../components/AdminLayout";
import axios from "../../helpers/axios";

// Styled Components (matching Dashboard/Admin style)
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  color: #34a853;
  font-weight: 600;
  margin: 0;
`;

const AddButton = styled.button`
  background-color: #34a853;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2e8b46;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
`;

const Thead = styled.thead`
  border-bottom: 1px solid #e5e7eb;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  color: #34a853; /* Theme Green */
  font-weight: 500;
  white-space: nowrap;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  font-size: 13px;
  vertical-align: middle;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  background-color: ${props => props.variant === 'delete' ? '#ef4444' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  margin-right: 8px;
  
  &:last-child {
    margin-right: 0;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const Badge = styled.span<{ active?: boolean }>`
  background-color: ${props => props.active ? '#34a853' : '#9ca3af'};
  color: white;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

// Interface for API response
interface Promotion {
    promo_id: string;
    promo_name: string;
    discount_value: string;
    usage_per_user: number;
    promo_start_date: string;
    promo_end_date: string;
    promo_detail: string;
    employee: {
        emp_firstname: string;
        emp_lastname: string;
    } | null;
    is_active: string;
}

export default function PromotionPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPromotions = async () => {
        try {
            const res = await axios.get('/admin/promotions');
            if (res.data && res.data.res_code === '0000') {
                setPromotions(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch promotions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            console.log("Deleting promotion:", id);
            // TODO: Implement delete API call here
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <AdminAuthGuard>
            <AdminLayout activeMenu="Promotion" title="Admin - Promotion Management">

                <PageHeader>
                    <PageTitle>Promotion</PageTitle>
                    <AddButton>
                        ADD PROMOTION
                    </AddButton>
                </PageHeader>

                <Card>
                    {loading ? (
                        <EmptyState>Loading promotions...</EmptyState>
                    ) : (
                        <Table>
                            <Thead>
                                <tr>
                                    <Th>No</Th>
                                    <Th>Promo Name</Th>
                                    <Th>Discount</Th>
                                    <Th>Usage/user</Th>
                                    <Th>Start</Th>
                                    <Th>End</Th>
                                    <Th>Details</Th>
                                    <Th>Room Type</Th>
                                    <Th>Employee</Th>
                                    <Th>Is Active</Th>
                                    <Th>Action</Th>
                                </tr>
                            </Thead>
                            <tbody>
                                {promotions.length > 0 ? (
                                    promotions.map((promo) => (
                                        <tr key={promo.promo_id}>
                                            <Td>{promo.promo_id}</Td>
                                            <Td>{promo.promo_name}</Td>
                                            <Td>{parseFloat(promo.discount_value).toFixed(2)}</Td>
                                            <Td>{promo.usage_per_user}</Td>
                                            <Td>{formatDate(promo.promo_start_date)}</Td>
                                            <Td>{formatDate(promo.promo_end_date)}</Td>
                                            <Td style={{ maxWidth: '200px' }}>{promo.promo_detail}</Td>
                                            <Td>-</Td> {/* Room Type placeholder */}
                                            <Td>{promo.employee ? `${promo.employee.emp_firstname} ${promo.employee.emp_lastname}` : '-'}</Td>
                                            <Td>
                                                <Badge active={promo.is_active === 'A'}>
                                                    {promo.is_active === 'A' ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <div style={{ display: 'flex' }}>
                                                    <ActionButton variant="edit">EDIT</ActionButton>
                                                    <ActionButton variant="delete" onClick={() => handleDelete(promo.promo_id)}>DELETE</ActionButton>
                                                </div>
                                            </Td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <Td colSpan={11}>
                                            <EmptyState>No promotions found.</EmptyState>
                                        </Td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card>

            </AdminLayout>
        </AdminAuthGuard>
    );
}
