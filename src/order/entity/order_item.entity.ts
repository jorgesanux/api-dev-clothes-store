import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from '../../common/entity/base.entity';
import { Product } from '../../product/entity/product.entity';
import { Order } from './order.entity';

@Entity('order_item')
export class OrderItem extends BaseEntity {
    @Column({ type: 'float' })
    quantity: number;

    @Column({ name: 'unit_value', type: 'float' })
    unitValue: number;

    @Column({ name: 'total_value', type: 'float' })
    totalValue: number;

    @ManyToOne(() => Order, (order) => order.orderItems, { nullable: false })
    @JoinColumn({ name: 'order_id' })
    @Index()
    order: Order;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    @Index()
    product: Product;
}
