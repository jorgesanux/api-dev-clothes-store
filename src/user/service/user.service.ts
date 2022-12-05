import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';

@Injectable()
export class UserService implements BaseServiceInterface<User, number> {
    private SEQUENCE = 0;
    private users: User[] = [];

    findAll(): User[] {
        return this.users;
    }

    findOne(id: number): User {
        const user: User = this.users.find((c) => c.id === id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
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
