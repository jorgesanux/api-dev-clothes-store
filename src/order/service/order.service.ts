import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { CreateOrderDTO, UpdateOrderDTO } from '../dto/order.dto';
import { Order } from '../entity/order.entity';
import { DataSource, DeleteResult, QueryFailedError, Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from '../../user/service/customer.service';
import { QueryFailedErrorHandler } from '../../common/handler/query_failed_error.handler';

@Injectable()
export class OrderService implements BaseServiceInterface<Order, string> {
    relations: Object = {
        customer: true,
        orderItems: {
            product: true
        }
    };

    constructor(
        private dataSource: DataSource,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private customerService: CustomerService
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
            const order: Order = new Order();
            order.customer = await this.customerService.findOne(payload.customerId);
            order.observation = payload.observation;

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

            if(payload.customerId)
                order.customer = await this.customerService.findOne(payload.customerId);

            await this.orderRepository.merge(order, payload);
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
