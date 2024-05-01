import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { ChangeStatusDto, CreateOrderDto, PaidOrderDto } from './dto';
import { PaginationDto } from 'src/common';


@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('create_order')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const order  = await this.ordersService.create(createOrderDto);
    
    const paymentSesion = await this.ordersService.createSessionPayment(order);
    return {
      order,
      paymentSesion
    }
  }

  @MessagePattern('find_all_orders')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

  @MessagePattern('find_one_order')
  findOne(@Payload('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('change_order_status')
  changeStatus(@Payload() changeStatusDto: ChangeStatusDto) {
    return this.ordersService.changeStatus(changeStatusDto);
  }

  @EventPattern('payment_succeded')
  paidOrder(@Payload() paidOrderDto: PaidOrderDto){
    this.ordersService.paidOrder(paidOrderDto);
  }

}
