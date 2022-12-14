import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";
import { Product } from "./product.entity";

@Entity("category")
export class Category extends BaseEntity {

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'text'})
    description: string;

    @ManyToMany( () => Product, (product) => product.categories, { nullable: false })
    products: Product[];
}
