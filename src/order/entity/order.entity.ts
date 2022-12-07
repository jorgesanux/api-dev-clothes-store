import { Product } from 'src/product/entity/product.entity';
import { Customer } from 'src/user/entity/customer.entity';

export class Order {
    id: number;
    observation: string;
    customer: Customer;
    products: Product[];
}
