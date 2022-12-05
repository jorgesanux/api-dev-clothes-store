import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDTO, UpdateCustomerDTO } from 'src/dto/customer.dto';
import { Customer } from 'src/entity/customer.entity';
import { BaseServiceInterface } from 'src/interface/base-service.interface';

@Injectable()
export class CustomerService implements BaseServiceInterface<Customer, number> {
    private SEQUENCE = 0;
    private customers: Customer[] = [];

    findAll(): Customer[] {
        return this.customers;
    }

    findOne(id: number): Customer {
        const customer: Customer = this.customers.find((c) => c.id === id);
        if (!customer) {
            throw new NotFoundException(`Customer with id ${id} not found`);
        }
        return customer;
    }

    create(payload: CreateCustomerDTO): Customer {
        this.SEQUENCE++;
        const customer: Customer = {
            id: this.SEQUENCE,
            ...payload,
        };
        this.customers.push(customer);
        return customer;
    }

    update(id: number, payload: UpdateCustomerDTO): Customer {
        const customerIndex = this.customers.findIndex((c) => c.id === id);
        if (customerIndex < 0) {
            throw new NotFoundException(`Customer with id ${id} not found`);
        }
        return Object.assign(this.customers[customerIndex], payload);
    }

    delete(id: number): Customer {
        const customerIndex = this.customers.findIndex((c) => c.id === id);
        if (customerIndex < 0) {
            throw new NotFoundException(`Customer with id ${id} not found`);
        }
        return this.customers.splice(customerIndex, 1)[0];
    }
}
