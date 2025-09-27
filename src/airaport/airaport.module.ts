import { Module } from '@nestjs/common';
import { AiraportService } from './airaport.service';
import { AiraportController } from './airaport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './entities/airaport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airport])],
  controllers: [AiraportController],
  providers: [AiraportService],
})
export class AiraportModule {}
