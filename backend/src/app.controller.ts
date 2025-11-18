import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Handle favicon requests to prevent 500 errors
  @Get('favicon.ico')
  getFavicon(@Res() res: Response) {
    // Return 204 No Content instead of 500 error
    res.status(204).end();
  }
}
