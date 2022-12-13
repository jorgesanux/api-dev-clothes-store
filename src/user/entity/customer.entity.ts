import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('customer')
export class Customer {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    name: string;

    @Column({ name: "last_name", type: 'varchar', length: 30, nullable: true })
    lastName: string;

    @Column({ name: "company_name", type: 'varchar', length: 100, nullable: true })
    companyName: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    email: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @Column({ name: "created_at", type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
