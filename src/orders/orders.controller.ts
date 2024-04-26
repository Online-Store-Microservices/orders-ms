import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { ChangeStatusDto, CreateOrderDto } from './dto';
import { PaginationDto } from 'src/common';


@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('create_order')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
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

}
