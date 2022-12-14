import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";
import { Brand } from "./brand.entity";

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

    @ManyToOne(() => Brand, (brand) => brand.product, { nullable: false })
    @JoinColumn({ name: "brand_id" })
    brand: Brand;
}
