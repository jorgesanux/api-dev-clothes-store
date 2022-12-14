import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from "../../common/entity/base.entity";

@Entity('product')
export class Product extends BaseEntity {
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'float' })
    price: number;

    @Column({ type: 'float' })
    stock: number;

    @Column({ type: 'text' })
    image: string;
}
