import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";
import { Customer } from "./customer.entity";

@Entity('users')
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 50, unique: true })
    email: string;

    @Column({ type: 'text' })
    password: string; //TODO: Add ecryptation

    @Column({ type: 'varchar', length: 50 })
    role: string;

    @OneToOne(() => Customer, (customer) => customer.user)
    customer: Customer;
}
