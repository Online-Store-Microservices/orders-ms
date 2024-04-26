import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { handleSuccess } from 'src/common';
import { ChangeStatusDto, CreateOrderDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NATS_SERVICE } from 'src/config';
import { IProduct } from './interfaces';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  
 private readonly logger =  new Logger('OrdersService');

 constructor( 
  @Inject(NATS_SERVICE) private client: ClientProxy
  ){
    super()
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  } 

  

  async create(createOrderDto: CreateOrderDto) {
    try {
      const productIds = createOrderDto.items.map((item)=>item.productId);
      const products : IProduct[] =  await firstValueFrom(
        this.client.send('validate_products',productIds)
      );

      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;
        return acc + (price * orderItem.quantity);
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc,item)=>{
        return acc+item.quantity;
      },0)

      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          OrderItem: {
            createMany:{
              data: createOrderDto.items.map((orderItem)=>({
                price: products.find(product=>product.id == orderItem.productId).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity
              }))
            }
          }
        },
        include: {
          OrderItem: {
            select:{
              price: true,
              quantity: true,
              productId: true
            }
          }
        }
      });

      const formatOrder = {
        ...order,
        OrderItem: order.OrderItem.map((orderItem)=>({
          ...orderItem,
          name: products.find(product=>product.id === orderItem.productId).name
        }))
      }
      return handleSuccess(HttpStatus.CREATED,formatOrder);
    } catch (error) {
      throw new RpcException({ 
        message: error.message, 
        status: error?.error?.status??HttpStatus.INTERNAL_SERVER_ERROR 
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const {page,limit,status} = paginationDto;
      const totalPage = await this.order.count({where: { status }});
      const lastPage = Math.ceil(totalPage/limit);

      return {
        status: HttpStatus.OK,
        message: 'Successful execution',
        data: await this.order.findMany({
          skip: (page-1)*limit,
          take: limit,
          where: {
            status
          }
        }),
        meta: {
          total : totalPage,
          page,
          lastPage
        }
      }
    } catch (error) {
      throw new RpcException({ 
        message: error.message, 
        status:HttpStatus.INTERNAL_SERVER_ERROR 
      });
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.order.findFirst({
        where: {id:String(id)},
        include: {
          OrderItem: true
        }
      })

      if (!order) {
        throw new RpcException({
          message: `Order with id ${id} not found`,
          status: HttpStatus.NOT_FOUND
        });
      }

      const productIds = order.OrderItem.map((orderItem)=>(orderItem.productId));

      const products : IProduct[] =  await firstValueFrom(
        this.client.send('validate_products',productIds)
      );

      const formatOrder = {
        ...order,
        OrderItem: order.OrderItem.map((orderItem)=>({
          ...orderItem,
          name: products.find(product=>product.id === orderItem.productId).name
        }))
      }
      return handleSuccess(HttpStatus.OK,formatOrder);

    } catch (error) {
      throw new RpcException({ 
        message: error.message, 
        status: error?.error?.status??HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async changeStatus(changeStatusDto:ChangeStatusDto){
    try {
      const {id,status} = changeStatusDto;

      await this.findOne(id);

      const order = await this.order.update({
        where:{id},
        data:{
          status
        }
      });

      return handleSuccess(HttpStatus.OK,order);
    } catch (error) {
      throw new RpcException({ 
        message: error.message, 
        status: error?.error?.status??HttpStatus.INTERNAL_SERVER_ERROR 
      });
    }
  }


}
