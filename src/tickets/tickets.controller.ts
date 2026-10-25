import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { FilterTicketsQueryDto } from './dto/filter-tickets-query.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { StaffGuard } from './guards/staff.guard.js';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }
    @Get()
    findAll(@Query() filters: FilterTicketsQueryDto) {
        return this.ticketsService.findAll(filters.status, filters.priority);
    }
    @Get('env')
    getEnv() {
        return {
            environment: process.env.NODE_ENV
        }
    }


    @Get('external/posts')
    fetchExternalPosts() {
        return this.ticketsService.fetchExternalPosts();
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @Post()
    create(@Body() payload: CreateTicketDto) {
        return this.ticketsService.create(payload);
    }

    @Patch(':id')
    update(@Param('id') id: string,
        @Body() payload: UpdateTicketDto) {
        return this.ticketsService.update(id, payload);
    }

    @UseGuards(StaffGuard)
    @Patch(':id/close')
    closeTicket(@Param('id') id: string) {
        return this.ticketsService.closeTicket(id);
    }


}
