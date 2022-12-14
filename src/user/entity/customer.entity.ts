import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";

@Entity('customer')
export class Customer extends BaseEntity {
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
}
