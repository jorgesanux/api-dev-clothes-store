import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, QueryFailedError, Repository } from "typeorm";

import {
    CreateCustomerDTO,
    UpdateCustomerDTO,
} from 'src/user/dto/customer.dto';
import { Customer } from 'src/user/entity/customer.entity';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { QueryFailedErrorHandler } from "src/common/handler/query_failed_error.handler";

@Injectable()
export class CustomerService implements BaseServiceInterface<Customer, string> {
    constructor(
        @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    ) {}

    async findAll(limit: number, page: number): Promise<[Customer[], number]> {
        return this.customerRepository.findAndCount({
            order: { id: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: string): Promise<Customer> {
        const customer: Customer = await this.customerRepository.findOneBy({ id });
        if (customer !== null) return customer;

        throw new NotFoundException(`Customer with id ${id} not found`);
    }

    async create(payload: CreateCustomerDTO): Promise<Customer> {
        try {
            const customer: Customer = this.customerRepository.create(payload);
            return await this.customerRepository.save(customer);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: string, payload: UpdateCustomerDTO): Promise<Customer> {
        try {
            const customer: Customer = await this.findOne(id);
            await this.customerRepository.merge(customer, payload);
            return await this.customerRepository.save(customer);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async delete(id: string): Promise<Customer> {
        const customer: Customer = await this.findOne(id);
        const result: DeleteResult = await this.customerRepository.delete({
            id: customer.id,
        });
        if (result.affected > 0) return customer;
        throw new InternalServerErrorException(
            `Can not delete the customer with id ${id}`,
        );
    }
}
