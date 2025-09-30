import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { Flight } from './entities/flight.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Admin } from 'src/admin/entities/admin.entity';
import { Airport } from 'src/airaport/entities/airaport.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flight, Admin, Airport, Seat, Ticket])],
  controllers: [FlightsController],
  providers: [FlightsService],
  exports: [FlightsService]
})
export class FlightsModule { }
