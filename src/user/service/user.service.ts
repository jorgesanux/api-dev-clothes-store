import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateUserDTO, UpdateUserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { Constant } from "../../common/constant";
import { Client, QueryResult } from "pg";

@Injectable()
export class UserService implements BaseServiceInterface<User, number> {
    private SEQUENCE = 0;
    private users: User[] = [];

    constructor(
        @Inject(Constant.providerKeys.PG_CLIENT) private clientDbPg: Client,
    ) { }

    async findAll(): Promise<User[]> {
        try{
            let queryResult: QueryResult<User> = await this.clientDbPg.query("select * from users");
            return queryResult.rows;
        }catch(error: unknown){
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findOne(id: number): Promise<User> {
        try{
            let queryResult: QueryResult<User> = await this.clientDbPg.query("select * from users where id=$1", [id]);
            if(queryResult.rows.length <= 0) throw new NotFoundException(`User with id ${id} not found`);
            return queryResult.rows[0];
        }catch(error: unknown){
            if(error instanceof NotFoundException){
                throw error;
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    create(payload: CreateUserDTO): User {
        this.SEQUENCE++;
        const user: User = {
            id: this.SEQUENCE,
            ...payload,
        };
        this.users.push(user);
        return user;
    }

    update(id: number, payload: UpdateUserDTO): User {
        const userIndex = this.users.findIndex((c) => c.id === id);
        if (userIndex < 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return Object.assign(this.users[userIndex], payload);
    }

    delete(id: number): User {
        const userIndex = this.users.findIndex((c) => c.id === id);
        if (userIndex < 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return this.users.splice(userIndex, 1)[0];
    }
}
