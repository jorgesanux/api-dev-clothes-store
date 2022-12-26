import { Controller, Get } from '@nestjs/common';
import { Public } from '../../auth/decorator/public.decorator';

@Controller() //the base path in the url is defined on RouterModule in AppModule.
@Public()
export class ApiController {
    @Get('/')
    async getApi(): Promise<string> {
        return `<h1>Dev Clothes Store API - Alpha</h1>`;
    }
}
