import { Module } from '@nestjs/common';
import { CustomerController } from './controller/customer.controller';
import { UserController } from './controller/user.controller';
import { CustomerService } from './service/customer.service';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Customer } from './entity/customer.entity';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './service/profile.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Customer])],
    controllers: [UserController, CustomerController, ProfileController],
    providers: [UserService, CustomerService, ProfileService],
    exports: [CustomerService, UserService],
})
export class UserModule {}
