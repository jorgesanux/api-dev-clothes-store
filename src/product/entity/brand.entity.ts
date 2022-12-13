import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("brand")
export class Brand {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'text'})
    description: string;

    @Column({ name: "created_at", type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
