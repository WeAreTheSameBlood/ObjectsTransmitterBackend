import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { LogLevel } from '../levels/log-levels';

@Injectable()
export class LoggerService implements NestLoggerService {
  // MARK: - Color mapping
  private readonly levelColors: Record<LogLevel, string> = {
    [LogLevel.Info]:    '\x1b[32m',   // green
    [LogLevel.Warn]:    '\x1b[33m',   // orange
    [LogLevel.Error]:   '\x1b[31m',   // red
    [LogLevel.Custom]:  '\x1b[35m',   // violet
  };
  private readonly resetColor = '\x1b[0m';

  // MARK: - Log
  log(level: LogLevel, message: any, meta?: any): void {
    const timestamp = this.formatDate(new Date());
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;
    const metaStr = meta !== undefined ? ` ${JSON.stringify(meta)}` : '';
    const color = this.levelColors[level] ?? '\x1b[36m';  // light blue
    console.log(
      `${'\x1b[36m'}[ App ]: ${this.resetColor}[${timestamp}] ${color}${level}: ${msg}${metaStr}${this.resetColor}`,
    );
  }

  info(message: any, meta?: any): void {
    this.log(LogLevel.Info, message, meta);
  }

  warn(message: any, meta?: any): void {
    this.log(LogLevel.Warn, message, meta);
  }

  error(message: any, meta?: any): void {
    this.log(LogLevel.Error, message, meta);
  }

  // MARK: - Private
  private formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${min}:${ss}`;
  }
}
