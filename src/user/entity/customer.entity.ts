import {
    Column,
    Entity,
    Index,
    JoinColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { User } from './user.entity';
import { Order } from '../../order/entity/order.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('customer')
@Index(['name', 'lastName'])
export class Customer extends BaseEntity {
    @Column({ type: 'varchar', length: 30, nullable: true })
    name: string;

    @Column({ name: 'last_name', type: 'varchar', length: 30, nullable: true })
    lastName: string;

    @Column({
        name: 'company_name',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    companyName: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @OneToOne(() => User, (user) => user.customer, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    @Index()
    @Exclude()
    user: User;

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];

    @Expose()
    get fullName(): string {
        return `${this.name} ${this.lastName}`;
    }

    @Expose()
    get email(): string {
        return this.user.email;
    }

    @Expose()
    get role(): string {
        return this.user.role;
    }
}
