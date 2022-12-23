import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { IBaseCRUDService } from 'src/common/interface/base_crud_service.interface';
import {
    CreateOrderDTO,
    UpdateOrderDTO,
    QueryOrderDTO,
} from '../dto/order.dto';
import { Order } from '../entity/order.entity';
import {
    Between,
    DataSource,
    DeleteResult,
    FindOptionsWhere,
    QueryFailedError,
    Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from '../../user/service/customer.service';
import { QueryFailedErrorHandler } from '../../common/handler/query_failed_error.handler';

@Injectable()
export class OrderService implements IBaseCRUDService<Order, string> {
    relations: Object = {
        customer: {
            user: true,
        },
        orderItems: {
            product: true,
        },
    };

    constructor(
        private dataSource: DataSource,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private customerService: CustomerService,
    ) {}
    async findAll(
        queryDTO: QueryOrderDTO,
        relations = this.relations,
    ): Promise<[Order[], number]> {
        const {
            limit,
            page,
            observation,
            updatedAtInit,
            updatedAtEnd,
            createdAtInit,
            createdAtEnd,
            totalInit,
            totalEnd,
        } = queryDTO;
        const where: FindOptionsWhere<Order> = {
            observation,
            total:
                totalInit && totalEnd
                    ? Between(totalInit, totalEnd)
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
        return this.orderRepository.findAndCount({
            relations,
            where,
            order: { createdAt: 'DESC' },
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
            order.customer = await this.customerService.findOne(
                payload.customerId,
            );
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

            if (payload.customerId)
                order.customer = await this.customerService.findOne(
                    payload.customerId,
                );

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
