import { BaseEntity } from '../entity/base.entity';
import { BaseQueryDTO } from '../dto/base_query.dto';

export interface IBaseCRUDService<T extends BaseEntity = any, Y = any> {
    relations?: string[] | Object;
    findAll(
        queryDTO: BaseQueryDTO,
        relations?: string[] | Object,
    ): [T[], number] | Promise<[T[], number]>;
    findOne(id: Y, relations?: string[] | Object): T | Promise<T>;
    create(payload: any): T | Promise<T>;
    update(id: Y, payload: any): T | Promise<T>;
    delete(id: Y): T | Promise<T>;
}
