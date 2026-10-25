import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        required: true,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    })
    priority: string;

    @Prop({
        required: true,
        enum: ['open', 'in_progress', 'closed'],
        default: 'open',
    })
    status: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);