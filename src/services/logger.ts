export default class Logger implements LoggerInterface {
  readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  error(message: string): void {
    console.error(`[${this.namespace}] ${message}`);
  }

  log(message: string): void {
    console.log(`[${this.namespace}] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[${this.namespace}] ${message}`);
  }
}
