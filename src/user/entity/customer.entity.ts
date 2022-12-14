import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { User } from './user.entity';

@Entity('customer')
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
    user: User;
}
