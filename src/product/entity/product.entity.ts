import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

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

    @Column({ name: "created_at", type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
