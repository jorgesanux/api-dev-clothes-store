import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './auth/guard/api_key.guard';
import { PublicEndpoint } from './auth/decorator/public_endpoint.decorator';

@Controller()
@UseGuards(ApiKeyGuard)
export class AppController {
    constructor(private readonly appService: AppService) {}

    @PublicEndpoint()
    @Get('/')
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('/testGuard')
    testGuard(): string {
        return 'El guard dejo pasar.';
    }
}
