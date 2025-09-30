import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { SuperAdminAuthModule } from './superadmin.module';
import { NewsModule } from 'src/news/news.module';
import { CreateSuperAdmin } from 'src/utils/createsuperadmin';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Flight]),
    JwtModule,
    SuperAdminAuthModule,
    forwardRef(() => NewsModule),
  ],
  controllers: [AdminController],
  providers: [AdminService, CreateSuperAdmin],
  exports: [AdminService],
})
export class AdminModule { }
