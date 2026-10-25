import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';
import { RequestLoggerMiddleware } from '../common/request-logger.middleware.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/ticket.schema.js';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema }
    ]),
    HttpModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService]
})
export class TicketsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes(TicketsController);
  }
}
