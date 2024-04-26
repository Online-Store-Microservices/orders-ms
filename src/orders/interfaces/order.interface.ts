import { OrderStatus } from '@prisma/client';

export interface IOrder {
    id: string;
    totalAmount: number;
    totalItems: number;
    status: OrderStatus;
    paid: boolean;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
}