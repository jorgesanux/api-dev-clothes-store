import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDTO, UpdateBrandDTO } from 'src/dto/brand.dto';
import { Brand } from 'src/entity/brand.entity';
import { BaseServiceInterface } from 'src/interface/base-service.interface';

@Injectable()
export class BrandService implements BaseServiceInterface<Brand, number> {
    private SEQUENCE = 0;
    private brands: Brand[] = [];

    findAll(): Brand[] {
        return this.brands;
    }

    findOne(id: number): Brand {
        const brand: Brand = this.brands.find((c) => c.id === id);
        if (!brand) {
            throw new NotFoundException(`Brand with id ${id} not found`);
        }
        return brand;
    }

    create(payload: CreateBrandDTO): Brand {
        this.SEQUENCE++;
        const brand: Brand = {
            id: this.SEQUENCE,
            ...payload,
        };
        this.brands.push(brand);
        return brand;
    }

    update(id: number, payload: UpdateBrandDTO): Brand {
        const brandIndex = this.brands.findIndex((c) => c.id === id);
        if (brandIndex < 0) {
            throw new NotFoundException(`Brand with id ${id} not found`);
        }
        return Object.assign(this.brands[brandIndex], payload);
    }

    delete(id: number): Brand {
        const brandIndex = this.brands.findIndex((c) => c.id === id);
        if (brandIndex < 0) {
            throw new NotFoundException(`Brand with id ${id} not found`);
        }
        return this.brands.splice(brandIndex, 1)[0];
    }
}
