import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Public } from './auth/decorator/public.decorator';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Public()
    @Get('/')
    root(@Res() res: Response): void {
        res.sendFile('index.html', {
            root: 'public',
        });
    }
}
