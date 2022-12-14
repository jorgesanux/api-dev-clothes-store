import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Between,
    DeleteResult,
    EntityManager,
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
import { CastHelper } from '../../common/helper/cast.helper';

@Injectable()
export class UserService implements IBaseCRUDService<User, string> {
    relations: Object | string[];

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

    async findOne(
        id: string,
        entityManager: EntityManager = null,
    ): Promise<User> {
        const where: FindOptionsWhere<User> = { id };
        const user: User = entityManager
            ? await entityManager.getRepository(User).findOneBy(where)
            : await this.userRepository.findOneBy(where);
        if (user !== null) return user;

        throw new NotFoundException(`User with id ${id} not found`);
    }

    async findByEmail(
        email: string,
        relations = this.relations,
    ): Promise<User> {
        const user: User = await this.userRepository.findOne({
            relations,
            where: { email },
        });
        if (user !== null) return user;

        throw new NotFoundException(`User with email ${email} not found`);
    }

    async create(
        payload: CreateUserDTO,
        entityManager: EntityManager = null,
    ): Promise<User> {
        try {
            if (!entityManager) entityManager = this.userRepository.manager;
            // const user: User = this.userRepository.create(payload);
            const user: User = new User();
            user.email = payload.email;
            user.role = payload.role;
            user.password = CastHelper.StringToBuffer(
                await AuthHelper.hashPassword(payload.password),
            );
            return await entityManager.getRepository(User).save(user);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: string, payload: UpdateUserDTO): Promise<User> {
        try {
            const user: User = await this.findOne(id);
            // if(Object.keys(payload).length <= 0) return user;

            if (payload.email) user.email = payload.email;
            if (payload.role) user.role = payload.role;
            if (payload.password)
                user.password = CastHelper.StringToBuffer(
                    await AuthHelper.hashPassword(payload.password),
                );

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
