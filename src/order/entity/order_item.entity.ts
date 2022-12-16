import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Product } from '../../product/entity/product.entity';
import { Order } from './order.entity';

@Entity('order_item')
export class OrderItem extends BaseEntity {
    @Column({ type: 'float' })
    quantity: number;

    @Column({ type: 'float' })
    unitValue: number;

    @Column({ type: 'float' })
    totalValue: number;

    @ManyToOne(() => Order, (order) => order.orderItems, { nullable: false })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product, () => null, { nullable: false })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
