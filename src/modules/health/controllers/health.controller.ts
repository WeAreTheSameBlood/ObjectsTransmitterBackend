import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { LoggerService } from '@src/common/services';
import { LogLevel } from '@src/common/services/logger/levels/log-levels';

@Controller('health')
export class HealthController {
    // MARK: - Init
    constructor(
        private readonly logger: LoggerService
    ) { }

    // MARK: - GET - Health Check
    @Get()
    @HttpCode(HttpStatus.OK)
    async healtCheck(): Promise<{ status: string }> {
        const status: string = 'Server is working!!! ᕙ(  •̀ ᗜ •́  )ᕗ';
        this.logger.log(LogLevel.Custom, status);
        return { status };
    }
}
