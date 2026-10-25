
import {
    BadRequestException,
    Injectable,
    NotFoundException,
    BadGatewayException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { Ticket as TicketSchemaClass } from './schemas/ticket.schema.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@Injectable()
export class TicketsService {
    constructor(
        @InjectModel(TicketSchemaClass.name)
        private readonly ticketModel: Model<TicketSchemaClass>,
        private readonly httpService: HttpService,
    ) { }

    async findAll(status?: string, priority?: string) {
        const filter: Record<string, string> = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        return this.ticketModel.find(filter).exec();
    }

    async findOne(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ticket ID');
        }

        const ticket = await this.ticketModel.findById(id).exec();

        if (!ticket) {
            throw new NotFoundException(`Ticket ${id} not found`);
        }

        return ticket;
    }

    async create(payload: CreateTicketDto) {
        return this.ticketModel.create({
            ...payload,
            status: 'open',
        });
    }

    async update(id: string, payload: UpdateTicketDto) {
        const ticket = await this.findOne(id);

        if (ticket.status === 'closed') {
            throw new BadRequestException(
                'Closed tickets cannot be updated',
            );
        }

        Object.assign(ticket, payload);
        return ticket.save();
    }

    async closeTicket(id: string) {
        const ticket = await this.findOne(id);

        if (ticket.status === 'closed') {
            throw new BadRequestException(
                'Ticket is already closed',
            );
        }

        ticket.status = 'closed';
        return ticket.save();
    }

    async fetchExternalPosts() {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    'https://jsonplaceholder.typicode.com/posts',
                ),
            );

            return response.data;
        } catch {
            throw new BadGatewayException(
                'Failed to fetch external posts',
            );
        }
    }
}
