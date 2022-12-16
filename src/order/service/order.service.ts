import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { CreateOrderDTO, UpdateOrderDTO } from '../dto/order.dto';
import { Order } from '../entity/order.entity';
import { DeleteResult, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from '../../user/service/customer.service';
import { OrderItemService } from './order_item.service';
import { QueryFailedErrorHandler } from '../../common/handler/query_failed_error.handler';
import { OrderItem } from '../entity/order_item.entity';

@Injectable()
export class OrderService implements BaseServiceInterface<Order, string> {
    relations: string[] = ['customer', 'orderItems'];

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private customerService: CustomerService,
        private orderItemService: OrderItemService,
    ) {}

    async findAll(
        limit: number,
        page: number,
        relations = this.relations,
    ): Promise<[Order[], number]> {
        return this.orderRepository.findAndCount({
            relations,
            order: { id: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: string, relations = this.relations): Promise<Order> {
        const order: Order = await this.orderRepository.findOne({
            relations,
            where: {
                id,
            },
        });
        if (order !== null) return order;

        throw new NotFoundException(`Order with id ${id} not found`);
    }

    async create(payload: CreateOrderDTO): Promise<Order> {
        try {
            const tempOrder: Order = new Order();
            tempOrder.customer = await this.customerService.findOne(
                payload.customer,
            );
            tempOrder.observation = payload.observation;

            const order: Order = await this.orderRepository.save(tempOrder);
            for (const orderItemDTO of payload.orderItems) {
                const orderItem: OrderItem =
                    await this.orderItemService.createWithOrder(
                        order,
                        orderItemDTO,
                    );
                order.orderItems.push(orderItem);
                order.total += orderItem.totalValue;
            }
            return await this.orderRepository.save(order);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: string, payload: UpdateOrderDTO): Promise<Order> {
        try {
            const order: Order = await this.findOne(id);

            // if (payload.brandId)
            //     order.brand = await this.brandService.findOne(
            //         payload.brandId,
            //     );
            //
            // if (payload.categoriesIds)
            //     order.categories = await this.categoryService.findMany(
            //         payload.categoriesIds,
            //     );

            await this.orderRepository.merge(order, {});
            return await this.orderRepository.save(order);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async delete(id: string): Promise<Order> {
        const order: Order = await this.findOne(id);
        const result: DeleteResult = await this.orderRepository.delete({
            id: order.id,
        });
        if (result.affected > 0) return order;
        throw new InternalServerErrorException(
            `Can not delete the order with id ${id}`,
        );
    }
}
