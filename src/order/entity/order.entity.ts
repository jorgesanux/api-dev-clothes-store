import { BaseEntity } from '../../common/entity/base.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { OrderItem } from './order_item.entity';
import { Customer } from '../../user/entity/customer.entity';

@Entity('purchase_order')
export class Order extends BaseEntity {
    @Column({ type: 'float', default: 0 })
    total: number;

    @Column({ type: 'text', nullable: true })
    observation: string;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    @JoinColumn({ name: 'customer_id' })
    @Index()
    customer: Customer;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];
}
