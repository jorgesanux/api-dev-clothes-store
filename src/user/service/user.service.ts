import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Between,
    DeleteResult,
    FindOptionsWhere,
    QueryFailedError,
    Repository,
} from 'typeorm';

import { IBaseCRUDService } from 'src/common/interface/base_crud_service.interface';
import { User } from 'src/user/entity/user.entity';
import {
    CreateUserDTO,
    QueryUserDTO,
    UpdateUserDTO,
} from 'src/user/dto/user.dto';
import { QueryFailedErrorHandler } from '../../common/handler/query_failed_error.handler';
import { AuthHelper } from '../../common/helper/auth.helper';

@Injectable()
export class UserService implements IBaseCRUDService<User, string> {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async findAll(queryDTO: QueryUserDTO): Promise<[User[], number]> {
        const {
            role,
            email,
            limit,
            createdAtEnd,
            updatedAtEnd,
            createdAtInit,
            updatedAtInit,
            page,
        } = queryDTO;
        const where: FindOptionsWhere<User> = {
            email,
            role,
            updatedAt:
                updatedAtInit && updatedAtEnd
                    ? Between(updatedAtInit, updatedAtEnd)
                    : undefined,
            createdAt:
                createdAtInit && createdAtEnd
                    ? Between(createdAtInit, createdAtEnd)
                    : undefined,
        };

        return this.userRepository.findAndCount({
            where,
            order: { id: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: string): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ id });
        if (user !== null) return user;

        throw new NotFoundException(`User with id ${id} not found`);
    }

    async findByEmail(email: string): Promise<User> {
        const user: User = await this.userRepository.findOne({
            where: { email },
        });
        if (user !== null) return user;

        throw new NotFoundException(`User with email ${email} not found`);
    }

    async create(payload: CreateUserDTO): Promise<User> {
        try {
            const user: User = this.userRepository.create(payload);
            user.password = await AuthHelper.hashPassword(payload.password);
            return await this.userRepository.save(user);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: string, payload: UpdateUserDTO): Promise<User> {
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

    async delete(id: string): Promise<User> {
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
