export interface BaseServiceInterface<T = any, Y = any> {
    findAll(): T[] | Promise<T[]>;
    findOne(id: Y): T | Promise<T>;
    create(payload: any): T | Promise<T>;
    update(id: Y, payload: any): T | Promise<T>;
    delete(id: Y): T | Promise<T>;
}
