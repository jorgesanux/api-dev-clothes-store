import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entity/base.entity";

@Entity("category")
export class Category extends BaseEntity {

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'text'})
    description: string;
}
