import {
    Column,
    Entity,
    Index,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Customer } from './customer.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 50, unique: true })
    @Index()
    email: string;

    @Column({ type: 'text' })
    @Exclude()
    password: string; //TODO: Add ecryptation

    @Column({ type: 'varchar', length: 50 })
    @Index()
    role: string;

    @OneToOne(() => Customer, (customer) => customer.user)
    customer: Customer;
}
