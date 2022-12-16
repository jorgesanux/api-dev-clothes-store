import { BaseEntity } from '../../common/entity/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { OrderItem } from './order_item.entity';
import { Customer } from '../../user/entity/customer.entity';

@Entity('purchase_order')
export class Order extends BaseEntity {
    @Column({ type: 'float', default: 0 })
    total: number;

    @Column({ type: 'text', nullable: true })
    observation: string;

    @OneToOne(() => Customer, (customer) => customer.order)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @OneToMany(() => OrderItem, () => null)
    orderItems: OrderItem[];
}
