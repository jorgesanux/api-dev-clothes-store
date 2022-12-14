import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Between,
    DeleteResult,
    EntityManager,
    FindOptionsWhere,
    Like,
    QueryFailedError,
    Repository,
} from 'typeorm';

import {
    CreateCustomerDTO,
    QueryCustomerDTO,
    UpdateCustomerDTO,
} from 'src/user/dto/customer.dto';
import { Customer } from 'src/user/entity/customer.entity';
import { IBaseCRUDService } from 'src/common/interface/base_crud_service.interface';
import { QueryFailedErrorHandler } from 'src/common/handler/query_failed_error.handler';
import { UserService } from './user.service';

@Injectable()
export class CustomerService implements IBaseCRUDService<Customer, string> {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        private userService: UserService,
    ) {}

    relations: Object | string[] = {
        user: true,
    };

    async findAll(
        queryDTO: QueryCustomerDTO,
        relations = this.relations,
    ): Promise<[Customer[], number]> {
        const {
            userId,
            name,
            lastName,
            companyName,
            address,
            limit,
            page,
            updatedAtInit,
            updatedAtEnd,
            createdAtInit,
            createdAtEnd,
            phone,
        } = queryDTO;
        const where: FindOptionsWhere<Customer> = {
            name: name ? Like(`%${name}%`) : undefined,
            lastName: lastName ? Like(`%${lastName}%`) : undefined,
            companyName: companyName ? Like(`%${companyName}%`) : undefined,
            address: address ? Like(`%${address}%`) : undefined,
            phone: phone ? Like(`%${phone}%`) : undefined,
            user: {
                id: userId || undefined,
            },
            updatedAt:
                updatedAtInit && updatedAtEnd
                    ? Between(updatedAtInit, updatedAtEnd)
                    : undefined,
            createdAt:
                createdAtInit && createdAtEnd
                    ? Between(createdAtInit, createdAtEnd)
                    : undefined,
        };
        return this.customerRepository.findAndCount({
            where,
            relations,
            order: { id: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: string, relations = this.relations): Promise<Customer> {
        const customer: Customer = await this.customerRepository.findOne({
            relations,
            where: {
                id,
            },
        });
        if (customer !== null) return customer;

        throw new NotFoundException(`Customer with id ${id} not found`);
    }

    async findByUserId(
        userId: string,
        relations = this.relations,
    ): Promise<Customer> {
        const customer: Customer = await this.customerRepository.findOne({
            relations,
            where: {
                user: {
                    id: userId,
                },
            },
        });

        if (customer !== null) return customer;

        throw new NotFoundException(
            `Customer with User id relation ${userId} not found`,
        );
    }

    async create(
        payload: CreateCustomerDTO,
        entityManager: EntityManager = null,
    ): Promise<Customer> {
        try {
            if (!entityManager) entityManager = this.customerRepository.manager;
            const customer: Customer = this.customerRepository.create(payload);
            customer.user = await this.userService.findOne(
                payload.userId,
                entityManager,
            );
            return await entityManager.getRepository(Customer).save(customer);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: string, payload: UpdateCustomerDTO): Promise<Customer> {
        try {
            const customer: Customer = await this.findOne(id);
            if (payload.userId)
                customer.user = await this.userService.findOne(payload.userId);
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
