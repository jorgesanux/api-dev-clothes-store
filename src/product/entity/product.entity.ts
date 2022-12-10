import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("product")
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text'})
    description: string;

    @Column({ type: 'float'})
    price: number;

    @Column({ type: 'float'})
    stock: number;

    @Column({ type: 'text'})
    image: string;
}
