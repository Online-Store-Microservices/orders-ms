import { OrderStatus } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";
import { OrderStatusList } from "../enum";

export class ChangeStatusDto {
    @IsUUID()
    id: string;

    @IsEnum(OrderStatusList,{
        message: `Possible status values are ${OrderStatusList}`
    })
    status: OrderStatus;

}
