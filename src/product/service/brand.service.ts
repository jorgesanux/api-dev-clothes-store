import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, QueryFailedError, Repository } from 'typeorm';

import { CreateBrandDTO, UpdateBrandDTO } from 'src/product/dto/brand.dto';
import { Brand } from 'src/product/entity/brand.entity';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { QueryFailedErrorHandler } from 'src/common/handler/query_failed_error.handler';

@Injectable()
export class BrandService implements BaseServiceInterface<Brand, string> {
    constructor(
        @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    ) {}

    async findAll(limit: number, page: number): Promise<[Brand[], number]> {
        return this.brandRepository.findAndCount({
            order: { id: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: string): Promise<Brand> {
        const brand: Brand = await this.brandRepository.findOneBy({ id });
        if (brand !== null) return brand;

        throw new NotFoundException(`Brand with id ${id} not found`);
    }

    async create(payload: CreateBrandDTO): Promise<Brand> {
        try {
            const brand: Brand = this.brandRepository.create(payload);
            return await this.brandRepository.save(brand);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: string, payload: UpdateBrandDTO): Promise<Brand> {
        try {
            const brand: Brand = await this.findOne(id);
            await this.brandRepository.merge(brand, payload);
            return await this.brandRepository.save(brand);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async delete(id: string): Promise<Brand> {
        const brand: Brand = await this.findOne(id);
        const result: DeleteResult = await this.brandRepository.delete({
            id: brand.id,
        });
        if (result.affected > 0) return brand;
        throw new InternalServerErrorException(
            `Can not delete the brand with id ${id}`,
        );
    }
}
