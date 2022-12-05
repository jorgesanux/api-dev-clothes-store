export interface BaseServiceInterface<T = any, Y = any> {
    findAll(): T[];
    findOne(id: Y): T;
    create(payload: any): T;
    update(id: Y, payload: any): T;
    delete(id: Y): T;
}
