import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Product } from './product.entity';

@Entity('brand')
export class Brand extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];
}
