import { HttpStatus } from '@nestjs/common';
import { IOrder } from 'src/orders/interfaces';


export function handleSuccess(status: HttpStatus, data: IOrder | IOrder[]) {
  return {
    status,
    message: 'Successful execution',
    data,
  };
}
