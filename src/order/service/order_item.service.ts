import { BaseServiceInterface } from '../../common/interface/base-service.interface';
import { OrderItem } from '../entity/order_item.entity';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Between,
    DeleteResult,
    FindOptionsWhere,
    QueryFailedError,
    Repository,
} from 'typeorm';
import {
    CreateOrderItemDTO,
    UpdateOrderItemDTO,
    QueryOrderItemDTO,
} from '../dto/order_item.dto';
import { QueryFailedErrorHandler } from 'src/common/handler/query_failed_error.handler';
import { OrderService } from './order.service';
import { ProductService } from '../../product/service/product.service';

@Injectable()
export class OrderItemService
    implements BaseServiceInterface<OrderItem, string>
{
    relations: string[] = ['order', 'product'];

    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        private orderService: OrderService,
        private productService: ProductService,
    ) {}

    async findAll(
        queryDTO: QueryOrderItemDTO,
        relations = this.relations,
    ): Promise<[OrderItem[], number]> {
        const {
            productId,
            orderId,
            quantityInit,
            quantityEnd,
            totalValueInit,
            totalValueEnd,
            updatedAtEnd,
            updatedAtInit,
            createdAtInit,
            createdAtEnd,
            page,
            limit,
        } = queryDTO;
        const where: FindOptionsWhere<OrderItem> = {
            product: {
                id: productId || undefined,
            },
            order: {
                id: orderId || undefined,
            },
            quantity:
                quantityInit && quantityEnd
                    ? Between(quantityInit, quantityEnd)
                    : undefined,
            totalValue:
                totalValueInit && totalValueEnd
                    ? Between(totalValueInit, totalValueEnd)
                    : undefined,
            updatedAt:
                updatedAtInit && updatedAtEnd
                    ? Between(updatedAtInit, updatedAtEnd)
                    : undefined,
            createdAt:
                createdAtInit && createdAtEnd
                    ? Between(createdAtInit, createdAtEnd)
                    : undefined,
        };
        return this.orderItemRepository.findAndCount({
            relations,
            where,
            order: { id: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: string, relations = this.relations): Promise<OrderItem> {
        const orderItem: OrderItem = await this.orderItemRepository.findOne({
            relations,
            where: {
                id,
            },
        });
        if (orderItem !== null) return orderItem;

        throw new NotFoundException(`OrderItem with id ${id} not found`);
    }

    async create(payload: CreateOrderItemDTO): Promise<OrderItem> {
        try {
            const orderItem: OrderItem = new OrderItem();
            orderItem.order = await this.orderService.findOne(
                payload.order,
                [],
            );
            orderItem.product = await this.productService.findOne(
                payload.product,
                [],
            );
            orderItem.quantity = payload.quantity;
            orderItem.unitValue = orderItem.product.price;
            orderItem.totalValue = orderItem.quantity * orderItem.unitValue;

            return await this.orderItemRepository.save(orderItem);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: string, payload: UpdateOrderItemDTO): Promise<OrderItem> {
        try {
            const orderItem: OrderItem = await this.findOne(id);

            if (orderItem.quantity) orderItem.quantity = payload.quantity;

            if (payload.order)
                orderItem.order = await this.orderService.findOne(
                    payload.order,
                    [],
                );

            if (payload.product) {
                orderItem.product = await this.productService.findOne(
                    payload.product,
                    [],
                );
            }

            orderItem.unitValue = orderItem.product.price;
            orderItem.totalValue = orderItem.quantity * orderItem.unitValue;

            return await this.orderItemRepository.save(orderItem);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async delete(id: string): Promise<OrderItem> {
        const orderItem: OrderItem = await this.findOne(id);
        const result: DeleteResult = await this.orderItemRepository.delete({
            id: orderItem.id,
        });
        if (result.affected > 0) return orderItem;
        throw new InternalServerErrorException(
            `Can not delete the orderItem with id ${id}`,
        );
    }
}
