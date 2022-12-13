import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("category")
export class Category {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'text'})
    description: string;

    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
