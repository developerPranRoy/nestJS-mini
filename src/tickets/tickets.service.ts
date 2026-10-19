import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';


@Injectable()
export class TicketsService {
    private readonly tickets: Ticket[] = [
        { id: 1, title: 'Ticket 1', subject: 'Subject for Ticket 1', description: 'Description for Ticket 1', priority: 'medium', status: 'open' },
        { id: 2, title: 'Ticket 2', subject: 'Subject for Ticket 2', description: 'Description for Ticket 2', priority: 'high', status: 'in_progress' },
        { id: 3, title: 'Ticket 3', subject: 'Subject for Ticket 3', description: 'Description for Ticket 3', priority: 'low', status: 'closed' },
    ];

    private nextTicketId = 4;
    findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
        let tickets = this.tickets;
        if (status) {
            tickets = tickets.filter(ticket => ticket.status === status);
        }

        if (priority) {
            tickets = tickets.filter(ticket => ticket.priority === priority);
        }
        return tickets;

    }

    findOne(id: number) {
        const ticket = this.tickets.find(ticket => ticket.id === id);
        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${id} not found`);
        }
        return ticket;
    }

    create(payload: CreateTicketDto) {
        const newTicket: Ticket = {
            id: this.nextTicketId++,
            title: payload.title,
            subject: payload.subject,
            description: payload.description,
            priority: payload.priority,
            status: 'open',
            createdAt: new Date(),
        };
        this.tickets.push(newTicket);
        return newTicket;
    }

    update(id: number, payload: UpdateTicketDto) {
        const ticket = this.findOne(id);
        if (ticket.status === 'closed') {
            throw new BadRequestException(`Ticket with ID ${id} is closed and cannot be updated`);
        }
        if (payload.title !== undefined) {
            ticket.title = payload.title;
        }
        if (payload.subject !== undefined) {
            ticket.subject = payload.subject;
        }
        if (payload.description !== undefined) {
            ticket.description = payload.description;
        }
        if (payload.priority !== undefined) {
            ticket.priority = payload.priority;
        }
        Object.assign(ticket, payload);
        return ticket;

    }


    closeTicket(id: number) {
        const ticket = this.findOne(id);
        if (ticket.status === 'closed') {
            throw new BadRequestException(`Ticket with ID ${id} is already closed`);
        }
        ticket.status = 'closed';

        return ticket;
    }

}