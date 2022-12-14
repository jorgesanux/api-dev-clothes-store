import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from "../../common/entity/base.entity";

@Entity('users')
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 30 })
    name: string;

    @Column({ name: 'last_name', type: 'varchar', length: 30 })
    lastName: string;

    @Column({ name: 'birth_date', type: 'date' })
    birthDate: Date;

    @Column({ type: 'varchar', length: 50, unique: true })
    email: string;
}
