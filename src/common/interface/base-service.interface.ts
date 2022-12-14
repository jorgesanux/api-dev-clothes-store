export interface BaseServiceInterface<T = any, Y = any> {
    //TODO: Remove the ? optional
    relations?: string[];

    //TODO: Remove T[] | Promise<T[]> and add [T[], number] only for findAll
    findAll(
        limit: number,
        page: number,
        relations?: string[]
    ): T[] | Promise<T[]> | Promise<[T[], number]>;
    findOne(id: Y, relations?: string[]): T | Promise<T>;
    create(payload: any): T | Promise<T>;
    update(id: Y, payload: any): T | Promise<T>;
    delete(id: Y): T | Promise<T>;
}
