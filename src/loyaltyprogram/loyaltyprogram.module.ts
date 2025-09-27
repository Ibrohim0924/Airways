import { Module } from '@nestjs/common';
import { LoyaltyprogramService } from './loyaltyprogram.service';
import { LoyaltyprogramController } from './loyaltyprogram.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Loyaltyprogram } from './entities/loyaltyprogram.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Loyaltyprogram])],
  controllers: [LoyaltyprogramController],
  providers: [LoyaltyprogramService],
  exports: [LoyaltyprogramService]
})
export class LoyaltyprogramModule {}
