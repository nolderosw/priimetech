/* eslint-disable @typescript-eslint/require-await */
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private readonly queueName = 'access_logs';
  private isConnected = false;

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost';
      const rabbitmqPort = process.env.RABBITMQ_PORT || '5672';
      const rabbitmqUser = process.env.RABBITMQ_DEFAULT_USER || 'admin';
      const rabbitmqPass = process.env.RABBITMQ_DEFAULT_PASS || 'admin123';

      const connectionString = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}`;

      this.connection = await amqp.connect(connectionString);

      if (this.connection) {
        this.channel = await this.connection.createChannel();

        if (this.channel) {
          await this.channel.assertQueue(this.queueName, {
            durable: true,
          });
          this.isConnected = true;
          this.logger.log('RabbitMQ connected successfully');
        }
      }
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      this.isConnected = false;
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error);
    }
  }

  async publishAuditLog(data: any): Promise<void> {
    if (!this.isConnected || !this.channel) {
      this.logger.warn('RabbitMQ not connected, skipping audit log');
      return;
    }

    try {
      const message = JSON.stringify(data);
      this.channel.sendToQueue(this.queueName, Buffer.from(message), {
        persistent: true,
      });
      this.logger.debug('Audit log published to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to publish audit log', error);
    }
  }
}
