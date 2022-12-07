import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { CreateOrderDTO, UpdateOrderDTO } from '../dto/order.dto';
import { Order } from '../entity/order.entity';

@Injectable()
export class OrderService implements BaseServiceInterface<Order, number> {
    private SEQUENCE = 0;
    private orders: Order[] = [];

    findAll(): Order[] {
        return this.orders;
    }
    findOne(id: number): Order {
        const order: Order = this.orders.find((o) => o.id === id);
        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }
        return order;
    }
    create(payload: Order): Order {
        this.SEQUENCE++;
        const order: Order = {
            id: this.SEQUENCE,
            ...payload,
        };
        this.orders.push(order);
        return order;
    }
    update(id: number, payload: UpdateOrderDTO): Order {
        const orderIndex = this.orders.findIndex((c) => c.id === id);
        if (orderIndex < 0) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }
        return Object.assign(this.orders[orderIndex], payload);
    }
    delete(id: number): Order {
        throw new Error('Method not implemented.');
    }
}
