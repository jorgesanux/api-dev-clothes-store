import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";
import { Brand } from "./brand.entity";
import { Category } from "./category.entity";

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

    @ManyToOne(() => Brand, (brand) => brand.products, { nullable: false })
    @JoinColumn({ name: "brand_id" })
    brand: Brand;

    @ManyToMany( () => Category, (category) => category.products, { nullable: false })
    @JoinTable({
        name: "category_x_product",
        joinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        }
    })
    categories: Category[];
}
