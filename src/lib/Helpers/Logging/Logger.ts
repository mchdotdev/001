/* eslint-disable @typescript-eslint/indent */
import { colors } from './Colors';

export interface LoggerOptions {
  debug?: boolean;
}

export class Logger {
  private source: string;
  protected options: LoggerOptions;

  /**
   *
   * @param source The name of the file where the logger is used
   * @param options Some logger options (debug mode)
   */

  constructor(source: string, options?: LoggerOptions) {
    this.source = source;
    this.options = {
      ...options,
      debug: process.env.NODE_ENV === 'development',
    };
  }

  public toHHMMSS(time: Date): string {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  public log(message: string, color?: keyof typeof colors): void {
    console.log(
      `${colors[color ? color : 'fgWhite']}%s${colors.reset}`,
      message,
    );
  }

  public info(message: string): void {
    this.log(
      `[${this.toHHMMSS(new Date())}] [${this.source}] ${message}`,
      'fgBlue',
    );
  }

  public error(message: string): void {
    this.log(
      `[${this.toHHMMSS(new Date())}] [${this.source}] ${message}`,
      'fgRed',
    );
  }

  public warn(message: string): void {
    this.log(
      `[${this.toHHMMSS(new Date())}] [${this.source}] ${message}`,
      'fgYellow',
    );
  }

  public debug(message: string): void {
    if (this.options.debug) {
      this.log(
        `{DEBUG_MODE} [${this.toHHMMSS(new Date())}] [${
          this.source
        }] ${message}`,
        'fgGreen',
      );
    }
  }
}
