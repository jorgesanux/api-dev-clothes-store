export interface BaseServiceInterface<T = any, Y = any> {
    //TODO: Remove T[] | Promise<T[]> and add [T[], number] only for findAll
    findAll(
        limit: number,
        page: number,
    ): T[] | Promise<T[]> | Promise<[T[], number]>;
    findOne(id: Y): T | Promise<T>;
    create(payload: any): T | Promise<T>;
    update(id: Y, payload: any): T | Promise<T>;
    delete(id: Y): T | Promise<T>;
}
