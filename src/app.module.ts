import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { FlightsModule } from './flights/flights.module';
import { NewsModule } from './news/news.module';
import { TicketsModule } from './tickets/tickets.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SeatsModule } from './seats/seats.module';
import * as dotenv from 'dotenv';
import { SuperAdminAuthModule } from './admin/superadmin.module';
import { LoyaltyprogramModule } from './loyaltyprogram/loyaltyprogram.module';
import { AiraportModule } from './airaport/airaport.module';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    FlightsModule,
    NewsModule,
    TicketsModule,
    ReviewsModule,
    SeatsModule,
    SuperAdminAuthModule,
    LoyaltyprogramModule,
    AiraportModule,
    CountryModule,
    CityModule
  ],
})
export class AppModule {}
