import { Injectable } from '@nestjs/common';
import { Order } from '../../order/entity/order.entity';
import { Customer } from '../entity/customer.entity';
import { CustomerService } from './customer.service';

@Injectable()
export class ProfileService {
    constructor(private customerService: CustomerService) {}
    async findOrdersByCustomerWithUserId(userId: string): Promise<Order[]> {
        const customer: Customer = await this.customerService.findByUserId(
            userId,
            ['orders'],
        );
        return customer.orders;
    }
}
