import { OrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsPositive } from "class-validator";
import { OrderStatusList } from "src/orders/enum";

export class PaginationDto {
    @IsPositive()
    @IsOptional()
    @Type(()=>Number)
    page?: number = 1;

    @IsPositive()
    @IsOptional()
    @Type(()=>Number)
    limit?: number = 10;

    @IsEnum(OrderStatusList,{
        message: `Possible status values are ${OrderStatusList}`
    })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDING;

}