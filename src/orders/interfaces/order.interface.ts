import { OrderStatus } from '@prisma/client';

export interface IOrder {
    orderItem?: {
        id?: string;
        productId: number;
        quantity: number;
        price: number;
        name:string;
    }[];
    id: string;
    totalAmount: number;
    totalItems: number;
    status: OrderStatus;
    paid: boolean;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
}