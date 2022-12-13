import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, QueryFailedError, Repository } from 'typeorm';

import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { User } from 'src/user/entity/user.entity';
import { CreateUserDTO, UpdateUserDTO } from 'src/user/dto/user.dto';
import { QueryFailedErrorHandler } from '../../common/handler/query_failed_error.handler';
import { Constant } from '../../common/constant';

@Injectable()
export class UserService implements BaseServiceInterface<User, number> {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async findAll(limit: number, page: number): Promise<[User[], number]> {
        return this.userRepository.findAndCount({
            order: { id: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: number): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ id });
        if (user !== null) return user;

        throw new NotFoundException(`User with id ${id} not found`);
    }

    async create(payload: CreateUserDTO): Promise<User> {
        try {
            const user: User = this.userRepository.create(payload);
            return await this.userRepository.save(user);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: number, payload: UpdateUserDTO): Promise<User> {
        try {
            const user: User = await this.findOne(id);
            await this.userRepository.merge(user, payload);
            return await this.userRepository.save(user);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async delete(id: number): Promise<User> {
        const user: User = await this.findOne(id);
        const result: DeleteResult = await this.userRepository.delete({
            id: user.id,
        });
        if (result.affected > 0) return user;
        throw new InternalServerErrorException(
            `Can not delete the user with id ${id}`,
        );
    }
}
